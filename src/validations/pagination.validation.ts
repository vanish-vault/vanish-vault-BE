import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { validateQuery } from "../handlers/validation.handler";
import { Type } from "class-transformer";

export class PaginationDTO {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  page!: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  limit!: number;
}

export const paginationValidation = validateQuery(PaginationDTO);
