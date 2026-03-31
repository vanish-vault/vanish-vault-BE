import { ValidationError } from "class-validator";

export const formatValidationErrors = (errors: ValidationError[]): string[] =>
  errors.flatMap((e) => {
    if (e.constraints) return Object.values(e.constraints);
    if (e.children && e.children.length) return formatValidationErrors(e.children);
    return [] as string[];
  });
