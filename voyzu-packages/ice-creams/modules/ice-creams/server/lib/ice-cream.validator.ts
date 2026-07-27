import type {
  IceCreamCreateRequestDto,
  IceCreamPatchRequestDto,
  IceCreamResponseDto,
  IceCreamUpdateRequestDto,
} from "../../../types";

const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]*$/;

type FieldValidator<T> = (value: T) => string | null;

function validateFields<T extends object>(
  input: T,
  validators: { [K in keyof T]-?: FieldValidator<T[K]> },
): string[] {
  return (Object.keys(validators) as Array<keyof T>)
    .map((key) => validators[key](input[key]))
    .filter((error): error is string => error !== null);
}

function requiredText(value: string | undefined, label: string): string | null {
  return value?.trim() ? null : `${label} is required`;
}

function code(value: string | undefined, label: string): string | null {
  if (!value?.trim()) return `${label} is required`;
  return CODE_PATTERN.test(value) ? null : `${label} must contain only uppercase letters, numbers, underscores or hyphens`;
}

function createCreateValidator() {
  return {
    code: (value) => code(value, "Code"),
    name: (value) => requiredText(value, "Name"),
    flavorCode: (value) => code(value, "Flavour"),
    supplier: (value) => requiredText(value, "Supplier"),
  } satisfies {
    [K in keyof IceCreamCreateRequestDto]-?: FieldValidator<IceCreamCreateRequestDto[K]>;
  };
}

export function validateCreate(input: IceCreamCreateRequestDto): string[] {
  return validateFields(input, createCreateValidator());
}

function createUpdateValidator() {
  return {
    name: (value) => requiredText(value, "Name"),
    flavorCode: (value) => code(value, "Flavour"),
    supplier: (value) => requiredText(value, "Supplier"),
  } satisfies {
    [K in keyof IceCreamUpdateRequestDto]-?: FieldValidator<IceCreamUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: IceCreamUpdateRequestDto): string[] {
  return validateFields(input, createUpdateValidator());
}

function createPatchValidator() {
  return {
    name: (value) => value === undefined || value.trim() ? null : "Name must not be empty",
    flavorCode: (value) => value === undefined ? null : code(value, "Flavour"),
    supplier: (value) => value === undefined || value.trim() ? null : "Supplier must not be empty",
  } satisfies {
    [K in keyof IceCreamPatchRequestDto]-?: FieldValidator<IceCreamPatchRequestDto[K]>;
  };
}

export function validatePatch(input: IceCreamPatchRequestDto): string[] {
  return validateFields(input, createPatchValidator());
}

function createResponseValidator() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    code: (value) => code(value, "code"),
    name: (value) => requiredText(value, "name"),
    flavor: (value) => value?.id > 0 && value.code && value.name ? null : "flavor is required",
    supplier: (value) => requiredText(value, "supplier"),
    status: (value) => value === "ACTIVE" || value === "INACTIVE" ? null : "status must be ACTIVE or INACTIVE",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
  } satisfies {
    [K in keyof IceCreamResponseDto]-?: FieldValidator<IceCreamResponseDto[K]>;
  };
}

export function validateResponse(input: IceCreamResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}
