import s3Utils from "../utils/s3";
import {
  findExpiredSecrets,
  deleteSecretsByIds,
} from "../repositories/secret.repository";
import { deleteFilesByIds } from "../repositories/file.repository";

const INTERVAL_MS = 60 * 1000; // 1 minute

async function runCleanup() {
  try {
    const expiredSecrets = await findExpiredSecrets();

    if (!expiredSecrets.length) return;

    // Collect all unique files across expired secrets
    const allFiles = expiredSecrets.flatMap((secret) => secret.files ?? []);
    const uniqueFiles = Array.from(
      new Map(allFiles.map((f) => [f.id, f])).values(),
    );

    // Delete files from S3 in parallel
    if (uniqueFiles.length) {
      await Promise.allSettled(
        uniqueFiles.map((file) => s3Utils.deleteFile(file.path)),
      );

      // Remove file records from DB
      await deleteFilesByIds(uniqueFiles.map((f) => f.id));
    }

    // Delete expired secret records (cascade removes secret_files join rows)
    await deleteSecretsByIds(expiredSecrets.map((s) => s.id));

    console.log(
      `[cleanup-cron] Deleted ${expiredSecrets.length} expired secret(s) and ${uniqueFiles.length} associated file(s).`,
    );
  } catch (err) {
    console.error("[cleanup-cron] Error during cleanup:", err);
  }
}

export function startCleanupCron() {
  console.log(
    "[cleanup-cron] Scheduled to run every minute. First run in 60s.",
  );
  setInterval(runCleanup, INTERVAL_MS);
}
