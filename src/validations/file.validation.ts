import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { validateBody } from "../handlers/validation.handler";

export class CreateTempSignedUrlDTO {
  @IsString()
  @IsNotEmpty()
  filename!: string;

  @IsString()
  @IsNotEmpty()
  contentType!: string;

  @IsNumber()
  @IsNotEmpty()
  fileSize!: number;
}

export const createTempSignedUrlValidation = validateBody(
  CreateTempSignedUrlDTO,
);
