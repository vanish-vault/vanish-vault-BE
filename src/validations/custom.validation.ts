import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from "class-validator";

export const MIN_SECRET_SIZE = 1; // replace with your actual value
export const MAX_SECRET_SIZE = 1024; // replace with your actual value

// --- Constraint: Is valid Uint8Array (or object convertible to one) ---
@ValidatorConstraint({ name: "isUint8Array", async: false })
export class IsUint8ArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value instanceof Uint8Array) return true;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const values = Object.values(value);
      return values.every((v) => typeof v === "number");
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return "$property must be a valid Uint8Array";
  }
}

// --- Constraint: Min size ---
@ValidatorConstraint({ name: "uint8ArrayMinSize", async: false })
export class Uint8ArrayMinSizeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const arr =
      value instanceof Uint8Array
        ? value
        : new Uint8Array(Object.values(value) as number[]);
    return arr.length >= args.constraints[0];
  }

  defaultMessage(args: ValidationArguments) {
    return "$property is too small to be valid encrypted content";
  }
}

// --- Constraint: Max size ---
@ValidatorConstraint({ name: "uint8ArrayMaxSize", async: false })
export class Uint8ArrayMaxSizeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const arr =
      value instanceof Uint8Array
        ? value
        : new Uint8Array(Object.values(value) as number[]);
    return arr.length <= args.constraints[0];
  }

  defaultMessage(args: ValidationArguments) {
    return `$property exceeds maximum size of ${MAX_SECRET_SIZE} bytes`;
  }
}

// --- Decorators ---
export function IsUint8Array(validationOptions?: ValidationOptions) {
  return registerDecorator({
    target: validationOptions?.each ? Object : Function,
    propertyName: "",
    options: validationOptions,
    constraints: [],
    validator: IsUint8ArrayConstraint,
  });
}

export function Uint8ArrayMinSize(
  min: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [min],
      validator: Uint8ArrayMinSizeConstraint,
    });
  };
}

export function Uint8ArrayMaxSize(
  max: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [max],
      validator: Uint8ArrayMaxSizeConstraint,
    });
  };
}
