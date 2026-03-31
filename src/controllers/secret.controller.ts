import { Request, Response, NextFunction } from "express";
import * as secretService from "../services/secret.service";
import { successResponse, createdResponse } from "../handlers/response.handler";
import { CreateSecretDTO } from "../validations/secret.validation";
import { PaginationDTO } from "../validations/pagination.validation";

export const createSecret = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body as CreateSecretDTO;
    const result = await secretService.createSecret({
      ...payload,
      userId: req.userId,
    });
    return createdResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getActiveSecrets = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit } = req.query as PaginationDTO;
    const result = await secretService.getActiveSecrets(
      req.userId,
      page,
      limit,
    );
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const deleteSecret = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await secretService.deleteSecret(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const viewSecret = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await secretService.viewSecret(
      req.params.id,
      req.body?.password,
    );
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const checkSecret = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await secretService.checkSecret(req.params.id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};
