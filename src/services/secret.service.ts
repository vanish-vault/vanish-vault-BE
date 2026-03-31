import { User, File } from "../entities";
import { compare, hash } from "../libs/password";
import { findFileByIds, updateFile } from "../repositories/file.repository";
import {
  insertSecret,
  findSecretsByUserIdWithCount,
  deleteSecretById,
  consumeSecretAndGetResult,
  findSecretById,
} from "../repositories/secret.repository";
import { CreateSecretDTO } from "../validations/secret.validation";
import s3Utils from "../utils/s3";
import {
  findUserById,
  incrementMonthlyFileUploads,
} from "../repositories/user.repository";

class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createSecret = async (
  data: CreateSecretDTO & { userId: string },
) => {
  const { userId, files, ...rest } = data;

  const user = await findUserById(userId);
  if (!user) throw new HttpError("User not found", 404);

  let _files: File[] = [];
  if (files?.length) {
    const maxFiles = user.plan.maxFiles;
    const isUnlimited = maxFiles === -1; // Pro plan seeds -1 for all unlimited fields
    if (!isUnlimited && files.length + (user.monthlyFileUploads ?? 0) > maxFiles) {
      throw new HttpError("Max files exceeded", 400);
    }
    _files = await findFileByIds(files);
    await Promise.all(
      _files.map(async (file) => {
        const newPath = file.path.replace("temp/", "secrets/");
        const newFullPath = `${process.env.AWS_S3_BUCKET_BASE_URL}/${newPath}`;
        await s3Utils.moveFile(file.path, newPath);
        await updateFile(file.id, {
          path: newPath,
          status: "completed",
          fileFullPath: newFullPath,
        });
        await incrementMonthlyFileUploads(user.id);
      }),
    );
  }

  // Convert string values to Buffer if needed by the repository/entity
  const payload = {
    ...rest,
    maxViews: rest.views,
    title: rest.title ?? new Uint8Array(0),
    secret: rest.secret ?? new Uint8Array(0),
    expiresAt: new Date(rest.expiresAt),
  };

  if (payload.password) {
    payload.password = await hash(payload.password);
  }

  const secret = await insertSecret(user, payload, _files);
  return secret;
};

export const getActiveSecrets = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [secrets, total] = await findSecretsByUserIdWithCount(
    userId,
    skip,
    limit,
  );

  return {
    totalActive: total,
    page,
    totalPages: Math.ceil(total / limit),
    secrets,
  };
};

export const deleteSecret = async (secretId: string) => {
  await deleteSecretById(secretId);
  return { message: "Secret deleted" };
};

export const viewSecret = async (secretId: string, password?: string) => {
  const result = await consumeSecretAndGetResult(secretId, async (item) => {
    if (item.views !== null && item.views <= 0) {
      throw new HttpError("Secret not found", 404);
    }

    if (item.password) {
      const ok = password ? await compare(password, item.password) : false;
      if (!ok) {
        throw new HttpError("Invalid password", 401);
      }
    }
    return true;
  });

  if (!result || !result.item) {
    throw new HttpError("Secret not found", 404);
  }

  const { item, newViews } = result;

  const burned = !!(item.isBurnable && newViews !== null && newViews <= 0);

  if (burned) {
    console.log("webhook: secret.burned", {
      secretId,
      hasPassword: !!item.password,
      hasIpRestriction: !!item.ipRange,
    });
  } else if (newViews !== null) {
    console.log("webhook: secret.viewed", {
      secretId,
      hasPassword: !!item.password,
      hasIpRestriction: !!item.ipRange,
      viewsRemaining: newViews,
    });
  }

  const itemWithoutPassword = { ...item } as any;
  delete itemWithoutPassword.password;

  if (itemWithoutPassword.secret) {
    itemWithoutPassword.secret = itemWithoutPassword.secret.toString("utf-8");
  }
  if (itemWithoutPassword.title) {
    itemWithoutPassword.title = itemWithoutPassword.title.toString("utf-8");
  }

  return {
    ...itemWithoutPassword,
    views: newViews,
    burned,
  };
};

export const checkSecret = async (secretId: string) => {
  const item = await findSecretById(secretId);

  if (!item || (item.views !== null && item.views <= 0)) {
    throw new HttpError("Secret not found", 404);
  }

  return {
    views: item.views,
    expiresAt: item.expiresAt,
    isPasswordProtected: !!item.password,
  };
};
