import type { FinancialDocumentDefaultCreateRequestDto } from "@voyzu-modules/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultPatchRequestDto } from "@voyzu-modules/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultResponseDto } from "@voyzu-modules/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultUpdateRequestDto } from "@voyzu-modules/types/modules/financial-document-defaults";

const VALID_ACCOUNT_TYPES = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"] as const;
const VALID_TARGET_TYPES = ["GENERAL_LEDGER", "BANK_CASH_ACCOUNT"] as const;
const VALID_OVERRIDE_SCOPES = ["HEADER", "LINE", "HEADER_AND_LINE"] as const;

type FieldValidator<T> = (value: T) => string | null;

function validateFields<T extends object>(input: T, validators: { [K in keyof T]-?: FieldValidator<T[K]> }): string[] {
  return (Object.keys(validators) as Array<keyof T>)
    .map((key) => validators[key](input[key]))
    .filter((error): error is string => error !== null);
}

function requiredText(value: string | undefined, label: string): string | null {
  return value?.trim() ? null : `${label} is required`;
}

function optionalId(value: number | undefined, label: string): string | null {
  return value === undefined || Number.isFinite(value) ? null : `${label} must be a number`;
}

function validateAccountTypes(value: readonly string[] | undefined, requiredMessage: string): string | null {
  if (!Array.isArray(value) || value.length === 0) return requiredMessage;
  return value.every((accountType) => VALID_ACCOUNT_TYPES.includes(accountType as typeof VALID_ACCOUNT_TYPES[number]))
    ? null
    : `Account type must be one of: ${VALID_ACCOUNT_TYPES.join(", ")}`;
}

function createCreateValidator() {
  return {
    documentCode: (value) => requiredText(value, "Document code"),
    code: (value) => requiredText(value, "Code"),
    name: (value) => requiredText(value, "Name"),
    targetType: (value) => VALID_TARGET_TYPES.includes(value) ? null : `Target type must be one of: ${VALID_TARGET_TYPES.join(", ")}`,
    allowedAccountTypes: (value) => validateAccountTypes(value, "Allowed account types are required"),
    overridePropertyName: (value) => requiredText(value, "Override property name"),
    overrideScope: (value) => VALID_OVERRIDE_SCOPES.includes(value) ? null : `Override scope must be one of: ${VALID_OVERRIDE_SCOPES.join(", ")}`,
    glAccountId: (value) => optionalId(value, "GL account"),
    bankCashControlAccountId: (value) => optionalId(value, "Bank / Cash control account"),
  } satisfies {
    [K in keyof FinancialDocumentDefaultCreateRequestDto]-?: FieldValidator<FinancialDocumentDefaultCreateRequestDto[K]>;
  };
}

export function validateCreate(input: FinancialDocumentDefaultCreateRequestDto): string[] {
  return validateFields(input, createCreateValidator());
}

function createUpdateValidator() {
  return {
    glAccountId: (value) => optionalId(value, "GL account"),
    bankCashControlAccountId: (value) => optionalId(value, "Bank / Cash control account"),
  } satisfies {
    [K in keyof FinancialDocumentDefaultUpdateRequestDto]-?: FieldValidator<FinancialDocumentDefaultUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: FinancialDocumentDefaultUpdateRequestDto): string[] {
  return validateFields(input, createUpdateValidator());
}

function createPatchValidator() {
  return {
    glAccountId: (value) => optionalId(value, "GL account"),
    bankCashControlAccountId: (value) => optionalId(value, "Bank / Cash control account"),
  } satisfies {
    [K in keyof FinancialDocumentDefaultPatchRequestDto]-?: FieldValidator<FinancialDocumentDefaultPatchRequestDto[K]>;
  };
}

export function validatePatch(input: FinancialDocumentDefaultPatchRequestDto): string[] {
  return validateFields(input, createPatchValidator());
}

function createResponseValidator() {
  return {
    documentCode: (value) => requiredText(value, "documentCode"),
    code: (value) => requiredText(value, "code"),
    name: (value) => requiredText(value, "name"),
    targetType: (value) => VALID_TARGET_TYPES.includes(value) ? null : `targetType must be one of: ${VALID_TARGET_TYPES.join(", ")}`,
    allowedAccountTypes: (value) => validateAccountTypes(value, "allowedAccountTypes is required"),
    overridePropertyName: (value) => requiredText(value, "overridePropertyName"),
    overrideScope: (value) => VALID_OVERRIDE_SCOPES.includes(value) ? null : `overrideScope must be one of: ${VALID_OVERRIDE_SCOPES.join(", ")}`,
    glAccountId: (value) => value === null || Number.isFinite(value) ? null : "glAccountId must be a number or null",
    accountTypeCode: (value) => VALID_ACCOUNT_TYPES.includes(value) ? null : "accountTypeCode is invalid",
    glAccount: (value) => value === null || (value.code && value.name && VALID_ACCOUNT_TYPES.includes(value.accountType)) ? null : "glAccount is invalid",
    isBankLinked: (value) => typeof value === "boolean" ? null : "isBankLinked must be a boolean",
    bankCashControlAccountId: (value) => value === null || Number.isFinite(value) ? null : "bankCashControlAccountId must be a number or null",
    bankCashControlAccount: (value) => value === null || (value.code && Number.isFinite(value.glAccountId) && value.glAccountCode && value.glAccountName)
      ? null
      : "bankCashControlAccount is invalid",
    status: (value) => ["ACTIVE", "INACTIVE"].includes(value) ? null : "status must be ACTIVE or INACTIVE",
    linkedBy: (value) => {
      if (!Array.isArray(value)) return "linkedBy must be an array";
      return value.some((reference) => typeof reference.type !== "string" || typeof reference.code !== "string")
        ? "linkedBy must contain pointer references"
        : null;
    },
    audit: (value) => {
      if (!value?.created?.date?.trim()) return "audit.created.date is required";
      if (!value?.updated?.date?.trim()) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof FinancialDocumentDefaultResponseDto]-?: FieldValidator<FinancialDocumentDefaultResponseDto[K]>;
  };
}

export function validateResponse(input: FinancialDocumentDefaultResponseDto): string[] {
  const errors = validateFields(input, createResponseValidator());
  if (input.targetType === "GENERAL_LEDGER" && !input.glAccount) errors.push("glAccount is required for GENERAL_LEDGER defaults");
  if (input.targetType === "BANK_CASH_ACCOUNT" && !input.bankCashControlAccount) errors.push("bankCashControlAccount is required for BANK_CASH_ACCOUNT defaults");
  if (input.glAccount && !input.allowedAccountTypes.includes(input.glAccount.accountType)) errors.push("glAccount.accountType must be allowed");
  return errors;
}
