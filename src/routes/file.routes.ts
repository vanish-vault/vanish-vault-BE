import { Router } from "express";
import { createTempSignedUrl } from "../controllers/file.controller";
import { createTempSignedUrlValidation } from "../validations/file.validation";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/temp/signed-url",
  authMiddleware,
  createTempSignedUrlValidation,
  createTempSignedUrl,
);

export default router;
