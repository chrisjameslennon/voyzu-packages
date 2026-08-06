import { InputValidationError } from "@voyzu/capability/errors";

import type { InventoryCategoryCreateRequestDto } from "@voyzu/core/types/modules/inventory-categories";
import type { InventoryCategoryPatchRequestDto } from "@voyzu/core/types/modules/inventory-categories";
import type { InventoryCategoryResponseDto } from "@voyzu/core/types/modules/inventory-categories";
import type { InventoryCategoryUpdateRequestDto } from "@voyzu/core/types/modules/inventory-categories";

type FieldValidator<T> = (value: T) => string | null;

function validateCode(code: unknown): string | null {
  return typeof code === "string" && /^[A-Z0-9_ -]+$/i.test(code.trim())
    ? null
    : "code must contain letters, numbers, spaces, underscores or hyphens";
}

function requiredText(value: string | undefined, label: string): string | null {
  return value?.trim() ? null : `${label} is required`;
}

function assertValid<T extends object>(input: T, validators: { [K in keyof T]-?: FieldValidator<T[K]> }): void {
  for (const key of Object.keys(validators) as Array<keyof T>) {
    const error = validators[key](input[key]);
    if (error) throw new InputValidationError(error);
  }
}

function createCreateValidator() {
  return {
    code: validateCode,
    name: (value) => requiredText(value, "name"),
    description: (value) => requiredText(value, "description"),
    posting_profile_code: validateCode,
  } satisfies {
    [K in keyof InventoryCategoryCreateRequestDto]-?: FieldValidator<InventoryCategoryCreateRequestDto[K]>;
  };
}

export function validateCreate(input: InventoryCategoryCreateRequestDto) {
  assertValid(input, createCreateValidator());
}

function createUpdateValidator() {
  return {
    name: (value) => requiredText(value, "name"),
    description: (value) => requiredText(value, "description"),
    posting_profile_code: validateCode,
  } satisfies {
    [K in keyof InventoryCategoryUpdateRequestDto]-?: FieldValidator<InventoryCategoryUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: InventoryCategoryUpdateRequestDto) {
  assertValid(input, createUpdateValidator());
}

function createPatchValidator() {
  return {
    code: (value) => value === undefined ? null : validateCode(value),
    name: (value) => value === undefined || value.trim() ? null : "name cannot be blank",
    description: (value) => value === undefined || value.trim() ? null : "description cannot be blank",
    posting_profile_code: (value) => value === undefined ? null : validateCode(value),
  } satisfies {
    [K in keyof InventoryCategoryPatchRequestDto]-?: FieldValidator<InventoryCategoryPatchRequestDto[K]>;
  };
}

export function validatePatch(input: InventoryCategoryPatchRequestDto) {
  assertValid(input, createPatchValidator());
}

function createResponseValidator() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    code: (value) => requiredText(value, "code"),
    name: (value) => requiredText(value, "name"),
    description: (value) => typeof value === "string" ? null : "description must be text",
    posting_profile_code: (value) => requiredText(value, "posting_profile_code"),
    status: (value) => value === "ACTIVE" || value === "INACTIVE" ? null : "status is invalid",
    numberOfItems: (value) => value && [value.total, value.active, value.inactive].every((count) => Number.isInteger(count) && count >= 0) ? null : "numberOfItems is invalid",
    linkedBy: (value) => Array.isArray(value) ? null : "linkedBy must be an array",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
  } satisfies {
    [K in keyof InventoryCategoryResponseDto]-?: FieldValidator<InventoryCategoryResponseDto[K]>;
  };
}

export function validateResponse(input: InventoryCategoryResponseDto): string[] {
  const errors: string[] = [];
  const validators = createResponseValidator();
  for (const key of Object.keys(validators) as Array<keyof InventoryCategoryResponseDto>) {
    const error = validators[key](input[key] as never);
    if (error) errors.push(error);
  }
  return errors;
}
