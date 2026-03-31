import { Router } from "express";
import { changePassword, changeName } from "../controllers/user.controller";
import {
  changePasswordValidation,
  changeNameValidation,
} from "../validations/user.validation";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/change-password",
  authMiddleware,
  changePasswordValidation,
  changePassword,
);

router.post("/change-name", authMiddleware, changeNameValidation, changeName);

export default router;
