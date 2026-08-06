import { InputValidationError } from "@voyzu/capability/errors";
import type { InventoryItemCreateRequestDto } from "@voyzu/core/types/modules/inventory-items";
import type { InventoryItemPatchRequestDto } from "@voyzu/core/types/modules/inventory-items";
import type { InventoryItemUpdateRequestDto } from "@voyzu/core/types/modules/inventory-items";
import type { InventoryItemResponseDto } from "@voyzu/core/types/modules/inventory-items";

type FieldValidator<T> = (value: T) => string | null;

function validateCode(label: string, code: unknown): string | null {
  return typeof code === "string" && /^[A-Z0-9_ -]+$/i.test(code.trim())
    ? null
    : `${label} must contain letters, numbers, spaces, underscores or hyphens`;
}

function validateUnit(unit: unknown): string | null {
  return typeof unit === "string" && /^[a-z][a-z0-9_-]*$/i.test(unit.trim())
    ? null
    : "unit_code must contain letters, numbers, underscores or hyphens";
}

function validateItemType(itemType: unknown): string | null {
  return itemType === "INVENTORY" || itemType === "NON_INVENTORY" || itemType === "SERVICE"
    ? null
    : "item_type must be INVENTORY, NON_INVENTORY or SERVICE";
}

function validateNumberOrNull(label: string, value: unknown): string | null {
  return value === null || (typeof value === "number" && Number.isFinite(value)) ? null : `${label} must be a number or null`;
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
    item_code: (value) => validateCode("item_code", value),
    item_name: (value) => requiredText(value, "item_name"),
    description: (value) => requiredText(value, "description"),
    item_type: validateItemType,
    category_code: (value) => validateCode("category_code", value),
    unit_code: validateUnit,
    quantity_on_hand_derived: (value) => validateNumberOrNull("quantity_on_hand_derived", value),
    book_value_derived: (value) => validateNumberOrNull("book_value_derived", value),
    avg_unit_book_value_derived: (value) => validateNumberOrNull("avg_unit_book_value_derived", value),
  } satisfies {
    [K in keyof InventoryItemCreateRequestDto]-?: FieldValidator<InventoryItemCreateRequestDto[K]>;
  };
}

export function validateCreate(input: InventoryItemCreateRequestDto) {
  assertValid(input, createCreateValidator());
}

function createUpdateValidator() {
  return {
    item_name: (value) => requiredText(value, "item_name"),
    description: (value) => requiredText(value, "description"),
    item_type: validateItemType,
    category_code: (value) => validateCode("category_code", value),
    unit_code: validateUnit,
    quantity_on_hand_derived: (value) => validateNumberOrNull("quantity_on_hand_derived", value),
    book_value_derived: (value) => validateNumberOrNull("book_value_derived", value),
    avg_unit_book_value_derived: (value) => validateNumberOrNull("avg_unit_book_value_derived", value),
  } satisfies {
    [K in keyof InventoryItemUpdateRequestDto]-?: FieldValidator<InventoryItemUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: InventoryItemUpdateRequestDto) {
  assertValid(input, createUpdateValidator());
}

function createPatchValidator() {
  return {
    item_code: (value) => value === undefined ? null : validateCode("item_code", value),
    item_name: (value) => value === undefined || value.trim() ? null : "item_name cannot be blank",
    description: (value) => value === undefined || value.trim() ? null : "description cannot be blank",
    item_type: (value) => value === undefined ? null : validateItemType(value),
    category_code: (value) => value === undefined ? null : validateCode("category_code", value),
    unit_code: (value) => value === undefined ? null : validateUnit(value),
    quantity_on_hand_derived: (value) => value === undefined ? null : validateNumberOrNull("quantity_on_hand_derived", value),
    book_value_derived: (value) => value === undefined ? null : validateNumberOrNull("book_value_derived", value),
    avg_unit_book_value_derived: (value) => value === undefined ? null : validateNumberOrNull("avg_unit_book_value_derived", value),
  } satisfies {
    [K in keyof InventoryItemPatchRequestDto]-?: FieldValidator<InventoryItemPatchRequestDto[K]>;
  };
}

export function validatePatch(input: InventoryItemPatchRequestDto) {
  assertValid(input, createPatchValidator());
}

function createResponseValidator() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    item_code: (value) => validateCode("item_code", value),
    item_name: (value) => requiredText(value, "item_name"),
    description: (value) => typeof value === "string" ? null : "description must be text",
    item_type: validateItemType,
    category_code: (value) => validateCode("category_code", value),
    unit_code: validateUnit,
    status: (value) => value === "ACTIVE" || value === "INACTIVE" ? null : "status is invalid",
    hasPostings: (value) => typeof value === "boolean" ? null : "hasPostings must be a boolean",
    quantity_on_hand_derived: (value) => validateNumberOrNull("quantity_on_hand_derived", value),
    book_value_derived: (value) => validateNumberOrNull("book_value_derived", value),
    avg_unit_book_value_derived: (value) => validateNumberOrNull("avg_unit_book_value_derived", value),
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
  } satisfies {
    [K in keyof InventoryItemResponseDto]-?: FieldValidator<InventoryItemResponseDto[K]>;
  };
}

export function validateResponse(input: InventoryItemResponseDto): string[] {
  const errors: string[] = [];
  const validators = createResponseValidator();
  for (const key of Object.keys(validators) as Array<keyof InventoryItemResponseDto>) {
    const error = validators[key](input[key] as never);
    if (error) errors.push(error);
  }
  return errors;
}
