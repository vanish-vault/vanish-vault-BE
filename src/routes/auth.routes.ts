import { Router } from "express";
import {
  register,
  login,
  refresh,
  googleOAuth,
} from "../controllers/auth.controller";
import {
  registerValidation,
  loginValidation,
  refreshValidation,
  googleOAuthValidation,
} from "../validations/auth.validation";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/refresh", refreshValidation, refresh);
router.post("/google", googleOAuthValidation, googleOAuth);

export default router;
