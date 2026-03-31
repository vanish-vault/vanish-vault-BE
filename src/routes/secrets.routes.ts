import { Router } from "express";
import {
  createSecret,
  getActiveSecrets,
  deleteSecret,
  viewSecret,
  checkSecret,
} from "../controllers/secret.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  checkSecretValidation,
  createSecretValidation,
  viewSecretValidation,
} from "../validations/secret.validation";
import { paginationValidation } from "../validations/pagination.validation";

const router = Router();

// List secrets for authenticated user
router.get("/", authMiddleware, paginationValidation, getActiveSecrets);

// Create a secret (requires auth for now)
router.post("/", authMiddleware, createSecretValidation, createSecret);

// Retrieve and consume a secret (view)
router.post("/:id", viewSecretValidation, checkSecretValidation, viewSecret);

// Check secret metadata (views/title/password flag)
router.get("/:id/check", checkSecretValidation, checkSecret);

// Delete secret (auth required)
router.delete("/:id", deleteSecret);

export default router;
