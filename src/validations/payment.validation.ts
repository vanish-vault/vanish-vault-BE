import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { validateBody } from "../handlers/validation.handler";

export class CreatePaymentValidation {
  @IsString()
  @IsNotEmpty()
  planId!: string;
}

export const createPaymentValidation = validateBody(CreatePaymentValidation);
