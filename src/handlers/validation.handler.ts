import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { formatValidationErrors } from "./validation.utils";

export const validateBody =
  (DTOClass: any) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const dto = Object.assign(new DTOClass(), req.body);
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });
    if (errors.length) {
      // throw so centralized error handler handles formatting
      const formatted = formatValidationErrors(errors as ValidationError[]);
      const err: any = new Error("Validation failed");
      err.statusCode = 400;
      err.details = formatted;
      throw err;
    }
    return next();
  };

export const validateParams =
  (DTOClass: any) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const dto = Object.assign(new DTOClass(), req.params);
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });
    if (errors.length) {
      const formatted = formatValidationErrors(errors as ValidationError[]);
      const err: any = new Error("Validation failed");
      err.statusCode = 400;
      err.details = formatted;
      throw err;
    }
    return next();
  };

export const validateQuery =
  (DTOClass: any) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const dto = plainToInstance(DTOClass, req.query) as object;
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });
    if (errors.length) {
      const formatted = formatValidationErrors(errors as ValidationError[]);
      const err: any = new Error("Validation failed");
      err.statusCode = 400;
      err.details = formatted;
      throw err;
    }
    // Update req.query properties with the transformed DTO
    Object.assign(req.query, dto);
    return next();
  };
