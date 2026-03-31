import { Response } from "express";

export const successResponse = (
  res: Response,
  data: any,
  message = "Success",
  status = 200,
) => {
  return res.status(status).json({ success: true, message, data });
};

export const createdResponse = (
  res: Response,
  data: any,
  message = "Created",
) => successResponse(res, data, message, 201);

export const errorResponse = (
  res: Response,
  message = "Error",
  status = 400,
  details?: any,
) => res.status(status).json({ success: false, error: { message, details } });
