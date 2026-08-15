import type { TemplateCreateRequestDto, TemplatePatchRequestDto, TemplateResponseDto, TemplateUpdateRequestDto } from "../../../types";

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

export function validateTemplateCode(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return "Code is required and must be text";
  if (value.length > 40) return "Code must be 40 characters or fewer";
  return CODE_PATTERN.test(value) ? null : "Code must contain only uppercase letters, numbers, underscores or hyphens";
}

function validateDescription(value: unknown): string | null {
  if (value !== null && value !== undefined && typeof value !== "string") return "Description must be text or null";
  return typeof value === "string" && value.trim().length > 200
    ? "Description must be 200 characters or fewer"
    : null;
}

function validateRequiredDescription(value: unknown): string | null {
  return value === undefined ? "Description must be supplied as text or null" : validateDescription(value);
}

function createCreateValidator() {
  return {
    code: validateTemplateCode,
    description: validateRequiredDescription,
  } satisfies {
    [K in keyof TemplateCreateRequestDto]-?: FieldValidator<TemplateCreateRequestDto[K]>;
  };
}

export function validateCreate(input: TemplateCreateRequestDto): string[] {
  return validateFields(input, createCreateValidator());
}

function createPatchValidator() {
  return {
    description: validateDescription,
  } satisfies {
    [K in keyof TemplatePatchRequestDto]-?: FieldValidator<TemplatePatchRequestDto[K]>;
  };
}

export function validatePatch(input: TemplatePatchRequestDto): string[] {
  return validateFields(input, createPatchValidator());
}

export function validateUpdate(input: TemplateUpdateRequestDto): string[] {
  return validateFields(input, { description: validateRequiredDescription });
}

function createResponseValidator() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    code: validateTemplateCode,
    description: validateRequiredDescription,
    status: (value) => value === "ACTIVE" || value === "INACTIVE" ? null : "status must be ACTIVE or INACTIVE",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
  } satisfies {
    [K in keyof TemplateResponseDto]-?: FieldValidator<TemplateResponseDto[K]>;
  };
}

export function validateResponse(input: TemplateResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}
