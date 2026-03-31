import { AppDataSource } from "../config/data-source";
import { User, Secret, File } from "../entities";
import { LessThan } from "typeorm";

export const insertSecret = async (
  user: User | null,
  data: any,
  files: File[],
) => {
  const secretRepo = AppDataSource.getRepository(Secret);
  const secret = secretRepo.create({
    ...data,
    user,
    files,
  });
  await secretRepo.save(secret);
  return secret;
};

export const findSecretsByUserIdWithCount = async (
  userId: string,
  skip: number,
  take: number,
) => {
  const secretRepo = AppDataSource.getRepository(Secret);
  return secretRepo.findAndCount({
    where: { user: { id: userId } },
    order: { createdAt: "DESC" },
    skip,
    take,
  });
};

export const deleteSecretById = async (secretId: string) => {
  const secretRepo = AppDataSource.getRepository(Secret);
  return secretRepo.delete({ id: secretId });
};

export const findSecretById = async (secretId: string) => {
  const secretRepo = AppDataSource.getRepository(Secret);
  return secretRepo.findOne({ where: { id: secretId }, relations: ["files"] });
};

export const consumeSecretAndGetResult = async (
  secretId: string,
  verifier: (item: Secret) => Promise<boolean> | boolean,
) => {
  return AppDataSource.manager.transaction(async (manager) => {
    const item = await manager.findOne(Secret, {
      where: { id: secretId },
      relations: ["files"],
    });

    if (!item) return null;

    // Call the external verifier to check password, expiration, views logic
    const ok = await verifier(item);
    if (!ok) return null; // or throw depending on how we want to handle it inside the transaction. Better to throw in the verifier if we want it passed up.

    const newViews = item.views !== null ? item.views - 1 : null;

    if (item.isBurnable && newViews !== null && newViews <= 0) {
      await manager.delete(Secret, { id: secretId });
    } else if (newViews !== null) {
      await manager.update(Secret, { id: secretId }, { views: newViews });
    }

    return { item, newViews };
  });
};

export const countSecretsByUserId = async (userId: string) => {
  const secretRepo = AppDataSource.getRepository(Secret);
  return secretRepo.count({
    where: { user: { id: userId } },
  });
};

export const findExpiredSecrets = async () => {
  const secretRepo = AppDataSource.getRepository(Secret);
  return secretRepo.find({
    where: { expiresAt: LessThan(new Date()) },
    relations: ["files"],
  });
};

export const deleteSecretsByIds = async (ids: string[]) => {
  if (!ids.length) return;
  const secretRepo = AppDataSource.getRepository(Secret);
  return secretRepo.delete(ids);
};
