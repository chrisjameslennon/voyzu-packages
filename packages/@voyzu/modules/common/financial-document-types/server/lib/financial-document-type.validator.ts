import type { FinancialDocumentTypeCreateRequestDto } from "@voyzu/types/modules/financial-document-types";
import type { FinancialDocumentTypePatchRequestDto } from "@voyzu/types/modules/financial-document-types";
import type { FinancialDocumentTypeResponseDto } from "@voyzu/types/modules/financial-document-types";
import type { FinancialDocumentTypeUpdateRequestDto } from "@voyzu/types/modules/financial-document-types";

const VALID_STATUSES = ["ACTIVE", "INACTIVE"] as const;
const VALID_SUPPORTING_LEDGERS = ["ACCOUNTS_PAYABLE", "ACCOUNTS_RECEIVABLE", "GENERAL", "TAX", "INVENTORY", "BANK_CASH"] as const;

type FieldValidator<T> = (value: T) => string | null;

function validateFields<T extends object>(input: T, validators: { [K in keyof T]-?: FieldValidator<T[K]> }): string[] {
  return (Object.keys(validators) as Array<keyof T>)
    .map((key) => validators[key](input[key]))
    .filter((error): error is string => error !== null);
}

function checkDescription(value: unknown, label = "Description"): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return `${label} is required`;
  if (value.length > 200) return `${label} must be 200 characters or fewer`;
  if (value !== value.trim()) return `${label} cannot have leading or trailing spaces`;
  return null;
}

function checkDocumentPurpose(value: unknown, label = "Document purpose"): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return `${label} is required`;
  if (value.length > 70) return `${label} must be 70 characters or fewer`;
  if (value !== value.trim()) return `${label} cannot have leading or trailing spaces`;
  return null;
}

function checkSupportingLedger(value: unknown, fieldLabel = "Primary supporting ledger"): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return `${fieldLabel} is required`;
  }
  if (!VALID_SUPPORTING_LEDGERS.includes(value as typeof VALID_SUPPORTING_LEDGERS[number])) {
    return `${fieldLabel} must be one of: ${VALID_SUPPORTING_LEDGERS.join(", ")}`;
  }
  return null;
}

function requiredText(value: string | undefined, label: string): string | null {
  return value?.trim() ? null : `${label} is required`;
}

function createCreateValidator() {
  return {
    code: (value) => requiredText(value, "Code"),
    name: (value) => requiredText(value, "Name"),
    description: checkDescription,
    documentPurpose: checkDocumentPurpose,
    primarySupportingLedger: checkSupportingLedger,
  } satisfies {
    [K in keyof FinancialDocumentTypeCreateRequestDto]-?: FieldValidator<FinancialDocumentTypeCreateRequestDto[K]>;
  };
}

export function validateCreate(input: FinancialDocumentTypeCreateRequestDto): string[] {
  return validateFields(input, createCreateValidator());
}

function createUpdateValidator() {
  return {
    code: (value) => requiredText(value, "Code"),
    name: (value) => requiredText(value, "Name"),
    description: checkDescription,
    documentPurpose: checkDocumentPurpose,
    primarySupportingLedger: checkSupportingLedger,
    status: (value) => VALID_STATUSES.includes(value) ? null : "Status must be ACTIVE or INACTIVE",
  } satisfies {
    [K in keyof FinancialDocumentTypeUpdateRequestDto]-?: FieldValidator<FinancialDocumentTypeUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: FinancialDocumentTypeUpdateRequestDto): string[] {
  return validateFields(input, createUpdateValidator());
}

function createPatchValidator() {
  return {
    code: (value) => value === undefined || value.trim() ? null : "Code cannot be empty",
    name: (value) => value === undefined || value.trim() ? null : "Name cannot be empty",
    description: (value) => value === undefined ? null : checkDescription(value)?.replace("is required", "cannot be empty") ?? null,
    documentPurpose: (value) => value === undefined ? null : checkDocumentPurpose(value)?.replace("is required", "cannot be empty") ?? null,
    primarySupportingLedger: (value) => value === undefined ? null : checkSupportingLedger(value),
    status: (value) => value === undefined || VALID_STATUSES.includes(value) ? null : "Status must be ACTIVE or INACTIVE",
  } satisfies {
    [K in keyof FinancialDocumentTypePatchRequestDto]-?: FieldValidator<FinancialDocumentTypePatchRequestDto[K]>;
  };
}

export function validatePatch(input: FinancialDocumentTypePatchRequestDto): string[] {
  return validateFields(input, createPatchValidator());
}

function createResponseValidator() {
  return {
    code: (value) => requiredText(value, "code"),
    name: (value) => requiredText(value, "name"),
    description: (value) => checkDescription(value, "description"),
    documentPurpose: (value) => checkDocumentPurpose(value, "documentPurpose"),
    primarySupportingLedger: (value) => checkSupportingLedger(value, "primarySupportingLedger"),
    supportsDimensions: (value) => typeof value === "boolean" ? null : "supportsDimensions must be a boolean",
    cashMovement: (value) => typeof value === "boolean" ? null : "cashMovement must be a boolean",
    supportsItems: (value) => typeof value === "boolean" ? null : "supportsItems must be a boolean",
    status: (value) => VALID_STATUSES.includes(value) ? null : "status must be ACTIVE or INACTIVE",
    audit: (value) => {
      if (!value?.created?.date?.trim()) return "audit.created.date is required";
      if (!value?.updated?.date?.trim()) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof FinancialDocumentTypeResponseDto]-?: FieldValidator<FinancialDocumentTypeResponseDto[K]>;
  };
}

export function validateResponse(input: FinancialDocumentTypeResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}
