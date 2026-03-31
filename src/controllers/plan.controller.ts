import { Request, Response } from "express";
import * as planService from "../services/plan.service";
import { successResponse } from "../handlers/response.handler";

export const getPlans = async (req: Request, res: Response) => {
  const result = await planService.getPlans();
  return successResponse(res, result, "Plans retrieved successfully");
};

export const getUserPlan = async (req: any, res: Response) => {
  const result = await planService.getUserPlan(req.userId);
  return successResponse(res, result, "User plan retrieved successfully");
};
