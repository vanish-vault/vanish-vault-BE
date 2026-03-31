import { Response } from "express";
import * as userService from "../services/user.service";
import { createdResponse } from "../handlers/response.handler";
import {
  ChangePasswordDTO,
  ChangeNameDTO,
} from "../validations/user.validation";

export const changePassword = async (req: any, res: Response) => {
  const body = req.body as ChangePasswordDTO;
  await userService.changePassword(body, req.userId!);
  return createdResponse(res, { message: "Password changed successfully" });
};

export const changeName = async (req: any, res: Response) => {
  const body = req.body as ChangeNameDTO;
  await userService.changeName(body, req.userId!);
  return createdResponse(res, { message: "Name changed successfully" });
};
