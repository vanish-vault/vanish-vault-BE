import s3Utils from "../utils/s3";
import {
  findSecretsToCleanup,
  deleteSecretsByIds,
} from "../repositories/secret.repository";
import { deleteFilesByIds } from "../repositories/file.repository";
import { Secret, File } from "../entities";

const INTERVAL_MS = 60 * 1000; // 1 minute

async function runCleanup() {
  try {
    const secretsToCleanup = await findSecretsToCleanup();

    if (!secretsToCleanup.length) return;

    // Collect all unique files across secrets that need cleanup
    const allFiles = secretsToCleanup.flatMap((secret: Secret) => secret.files ?? []);
    const uniqueFiles = Array.from(
      new Map(allFiles.map((f: File) => [f.id, f])).values(),
    );

    // Delete secret records first — this cascades and removes
    // the secret_files join rows, unblocking the file FK constraint
    await deleteSecretsByIds(secretsToCleanup.map((s: Secret) => s.id));

    // Now safe to delete orphaned file records and their S3 objects
    if (uniqueFiles.length) {
      await Promise.allSettled(
        uniqueFiles.map((file: File) => s3Utils.deleteFile(file.path)),
      );

      // Remove file records from DB (secret_files rows are already gone)
      await deleteFilesByIds(uniqueFiles.map((f: File) => f.id));
    }

    console.log(
      `[cleanup-cron] Successfully cleaned up ${secretsToCleanup.length} secret(s) (expired or views zero) and ${uniqueFiles.length} associated file(s).`,
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
