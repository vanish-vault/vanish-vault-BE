import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Validate,
} from "class-validator";
import { validateBody, validateParams } from "../handlers/validation.handler";
import { Transform } from "class-transformer";
import {
  IsUint8ArrayConstraint,
  Uint8ArrayMaxSize,
  Uint8ArrayMinSize,
  MIN_SECRET_SIZE,
  MAX_SECRET_SIZE,
} from "./custom.validation";

export class FileDTO {
  @IsString()
  @IsNotEmpty()
  filename!: string;

  @IsString()
  @IsNotEmpty()
  path!: string;
}

export class CreateSecretDTO {
  @Transform(({ value }) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return new Uint8Array(Object.values(value) as number[]);
    }
    return value;
  })
  @Validate(IsUint8ArrayConstraint)
  @Uint8ArrayMinSize(MIN_SECRET_SIZE, {
    message: "Secret data is too small to be valid encrypted content",
  })
  @Uint8ArrayMaxSize(MAX_SECRET_SIZE, {
    message: `Secret exceeds maximum size of ${MAX_SECRET_SIZE} bytes`,
  })
  secret!: Uint8Array;

  @Transform(({ value }) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return new Uint8Array(Object.values(value) as number[]);
    }
    return value;
  })
  @Validate(IsUint8ArrayConstraint)
  @Uint8ArrayMinSize(MIN_SECRET_SIZE, {
    message: "title data is too small to be valid encrypted content",
  })
  @Uint8ArrayMaxSize(MAX_SECRET_SIZE, {
    message: `title exceeds maximum size of ${MAX_SECRET_SIZE} bytes`,
  })
  @IsOptional()
  title?: Uint8Array<ArrayBufferLike>;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  views!: number;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  salt?: string;

  @IsBoolean()
  @IsNotEmpty()
  isBurnable!: boolean;

  @IsDateString()
  @IsNotEmpty()
  expiresAt!: string;

  @IsString()
  @IsOptional()
  ipRange?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  files?: string[];
}

export class ViewSecretDTO {
  @IsString()
  @IsOptional()
  password?: string;
}

export class CheckSecretDTO {
  @IsString()
  @IsNotEmpty()
  id!: string;
}

export const createSecretValidation = validateBody(CreateSecretDTO);
export const viewSecretValidation = validateBody(ViewSecretDTO);
export const checkSecretValidation = validateParams(CheckSecretDTO);
