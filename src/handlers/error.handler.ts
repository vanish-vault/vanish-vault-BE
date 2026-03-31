import { Request, Response, NextFunction } from "express";
import { ValidationError } from "class-validator";
import { errorResponse } from "./response.handler";
import { formatValidationErrors } from "./validation.utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // If it's an array of class-validator errors
  if (Array.isArray(err) && err.length && err[0] instanceof ValidationError) {
    const details = formatValidationErrors(err as ValidationError[]);
    return errorResponse(res, "Validation failed", 400, details);
  }

  // If error has validationErrors property (some libraries)
  if (err && Array.isArray(err.validationErrors)) {
    const details = formatValidationErrors(
      err.validationErrors as ValidationError[],
    );
    return errorResponse(res, "Validation failed", 400, details);
  }

  // Custom errors with statusCode
  if (err && err.statusCode) {
    return errorResponse(
      res,
      err.message || "Error",
      err.details || null,
      err.statusCode,
    );
  }

  // Syntax error (malformed JSON)
  if (err instanceof SyntaxError) {
    return errorResponse(res, "Malformed JSON body", 400, err.message);
  }

  // Fallback
  console.error(err);
  return errorResponse(res, err?.message || "Internal server error", 500);
};
