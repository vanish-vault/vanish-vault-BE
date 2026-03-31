import s3Utils from "../utils/s3";
import * as fileRepository from "../repositories/file.repository";
import { findUserById } from "../repositories/user.repository";
import { getCurrentMonthYear } from "../libs/date";

class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createTempSignedUrl = async (
  userId: string,
  filename: string,
  contentType: string,
  fileSize: number,
) => {
  try {
    // --- Quota check ---
    const user = await findUserById(userId);
    if (!user) throw new HttpError("User not found", 404);

    const maxFiles = user.plan?.maxFiles ?? 0;
    const isUnlimited = maxFiles === -1; // Pro plan seeds -1 for all unlimited fields
    const currentMonthYear = getCurrentMonthYear();
    const isNewMonth = user.fileUploadMonthYear !== currentMonthYear;
    const currentUploads = isNewMonth ? 0 : (user.monthlyFileUploads ?? 0);

    if (!isUnlimited && maxFiles > 0 && currentUploads >= maxFiles) {
      throw new HttpError(
        `Monthly file upload limit reached (${maxFiles} files/month). Resets on the 1st of next month.`,
        403,
      );
    }
    // --- End quota check ---

    const currentTimeInEpoch = Math.floor(Date.now() / 1000);
    const _filename = `${currentTimeInEpoch}-${filename}`;
    const key = `temp/${_filename}`;

    const result = await s3Utils.createSignedUrl(key, contentType);
    if (!result) {
      throw new Error("Failed to create signed URL");
    }

    const file = await fileRepository.insertFile({
      filename: _filename,
      originalFilename: filename,
      fileFullPath: `${process.env.AWS_S3_BUCKET_BASE_URL}/${key}`,
      fileSize: fileSize,
      contentType: contentType,
      path: key,
      status: "pending",
    });

    return {
      id: file.id,
      filename: file.filename,
      status: file.status,
      signedUrl: result,
    };
  } catch (error) {
    throw error;
  }
};

