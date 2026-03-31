import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { validateBody } from "../handlers/validation.handler";

export class ChangePasswordDTO {
  @IsString()
  @IsOptional()
  oldPassword?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string;
}

export class ChangeNameDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export const changePasswordValidation = validateBody(ChangePasswordDTO);
export const changeNameValidation = validateBody(ChangeNameDTO);
