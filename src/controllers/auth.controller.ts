import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import {
  createdResponse,
  errorResponse,
  successResponse,
} from "../handlers/response.handler";
import {
  GoogleOAuthDTO,
  LoginDTO,
  RefreshDTO,
  RegisterDTO,
} from "../validations/auth.validation";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as RegisterDTO;
  const result = await authService.register({
    username,
    email,
    password,
  });
  return createdResponse(res, result);
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body as LoginDTO;
  const result = await authService.login(identifier, password);
  return successResponse(res, result);
};
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as RefreshDTO;
    const result = await authService.refresh(refreshToken);

    return successResponse(res, result);
  } catch (err: any) {
    return errorResponse(res, err.message, 401);
  }
};

export const googleOAuth = async (req: Request, res: Response) => {
  const { idToken } = req.body as GoogleOAuthDTO;
  const result = await authService.loginWithGoogle(idToken);
  return successResponse(res, result);
};
