import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { validateBody } from "../handlers/validation.handler";

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  identifier!: string; // username or email

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RefreshDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class GoogleOAuthDTO {
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}

export const registerValidation = validateBody(RegisterDTO);
export const loginValidation = validateBody(LoginDTO);
export const refreshValidation = validateBody(RefreshDTO);
export const googleOAuthValidation = validateBody(GoogleOAuthDTO);
