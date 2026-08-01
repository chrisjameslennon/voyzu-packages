import { InputValidationError } from "@voyzu/capability/errors";
import type { ItemPostingProfileCreateRequestDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";
import type { ItemPostingProfilePatchRequestDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";
import type { ItemPostingProfileUpdateRequestDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";

type FieldValidator<T> = (value: T) => string | null;

function validateCode(label: string, code: unknown): string | null {
  return typeof code === "string" && /^[A-Z0-9_ -]+$/i.test(code.trim())
    ? null
    : `${label} must contain letters, numbers, spaces, underscores or hyphens`;
}

function validateNullableCode(label: string, code: unknown): string | null {
  return code === null || code === undefined || code === "" ? null : validateCode(label, code);
}

function validateBoolean(label: string, value: unknown): string | null {
  return typeof value === "boolean" ? null : `${label} must be a boolean`;
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
    profile_code: (value) => validateCode("profile_code", value),
    profile_name: (value) => requiredText(value, "profile_name"),
    description: (value) => requiredText(value, "description"),
    is_sold: (value) => validateBoolean("is_sold", value),
    is_purchased: (value) => validateBoolean("is_purchased", value),
    is_consumed: (value) => validateBoolean("is_consumed", value),
    revenue_code: (value) => validateNullableCode("revenue_code", value),
    cogs_code: (value) => validateNullableCode("cogs_code", value),
    purchase_expense_code: (value) => validateNullableCode("purchase_expense_code", value),
    consumption_code: (value) => validateNullableCode("consumption_code", value),
    adjustment_gain_code: (value) => validateNullableCode("adjustment_gain_code", value),
    adjustment_loss_code: (value) => validateNullableCode("adjustment_loss_code", value),
  } satisfies {
    [K in keyof ItemPostingProfileCreateRequestDto]-?: FieldValidator<ItemPostingProfileCreateRequestDto[K]>;
  };
}

export function validateCreate(input: ItemPostingProfileCreateRequestDto) {
  assertValid(input, createCreateValidator());
}

function createUpdateValidator() {
  return {
    ...createCreateValidator(),
  } satisfies {
    [K in keyof ItemPostingProfileUpdateRequestDto]-?: FieldValidator<ItemPostingProfileUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: ItemPostingProfileUpdateRequestDto) {
  assertValid(input, createUpdateValidator());
}

function createPatchValidator() {
  return {
    profile_code: (value) => value === undefined ? null : validateCode("profile_code", value),
    profile_name: (value) => value === undefined || value.trim() ? null : "profile_name cannot be blank",
    description: (value) => value === undefined || value.trim() ? null : "description cannot be blank",
    is_sold: (value) => value === undefined ? null : validateBoolean("is_sold", value),
    is_purchased: (value) => value === undefined ? null : validateBoolean("is_purchased", value),
    is_consumed: (value) => value === undefined ? null : validateBoolean("is_consumed", value),
    revenue_code: (value) => value === undefined ? null : validateNullableCode("revenue_code", value),
    cogs_code: (value) => value === undefined ? null : validateNullableCode("cogs_code", value),
    purchase_expense_code: (value) => value === undefined ? null : validateNullableCode("purchase_expense_code", value),
    consumption_code: (value) => value === undefined ? null : validateNullableCode("consumption_code", value),
    adjustment_gain_code: (value) => value === undefined ? null : validateNullableCode("adjustment_gain_code", value),
    adjustment_loss_code: (value) => value === undefined ? null : validateNullableCode("adjustment_loss_code", value),
  } satisfies {
    [K in keyof ItemPostingProfilePatchRequestDto]-?: FieldValidator<ItemPostingProfilePatchRequestDto[K]>;
  };
}

export function validatePatch(input: ItemPostingProfilePatchRequestDto) {
  assertValid(input, createPatchValidator());
}
