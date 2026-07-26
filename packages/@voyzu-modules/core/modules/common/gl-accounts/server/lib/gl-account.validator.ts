import type { GlAccountCreateRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts";
import type { GlAccountPatchRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts";
import type { GlAccountResponseDto } from "@voyzu-modules/core/types/modules/gl-accounts";
import type { GlAccountUpdateRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts";

type FieldValidator<T> = (value: T) => string | null;

const VALID_ACCOUNT_TYPES = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"] as const;
const VALID_STATUSES = ["ACTIVE", "INACTIVE"] as const;
const VALID_POINTER_TYPES = [
  "Accounts Payable Control Accounts",
  "Accounts Receivable Control Accounts",
  "Bank / Cash Accounts",
  "Tax Control Accounts",
  "Inventory Control Accounts",
  "Financial Document Defaults",
  "Item Posting Profiles",
] as const;

// Create

function createCreateValidator() {
  return {
    code: (value) => {
      if (!value || value.trim().length === 0) return "Code is required";
      return null;
    },
    name: (value) => {
      if (!value || value.trim().length === 0) return "Name is required";
      return null;
    },
    accountType: (value) => {
      if (!value || !VALID_ACCOUNT_TYPES.includes(value as typeof VALID_ACCOUNT_TYPES[number])) {
        return "Account type must be one of: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE";
      }
      return null;
    },
    accountCategoryId: (value) => {
      if (!Number.isInteger(value) || value <= 0) return "Reporting category is required";
      return null;
    },
  } satisfies {
    [K in keyof GlAccountCreateRequestDto]-?: FieldValidator<GlAccountCreateRequestDto[K]>;
  };
}

export function validateCreate(input: GlAccountCreateRequestDto): string[] {
  const errors: string[] = [];
  const v = createCreateValidator();

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const typeErr = v.accountType(input.accountType);
  if (typeErr) errors.push(typeErr);

  const catErr = v.accountCategoryId(input.accountCategoryId);
  if (catErr) errors.push(catErr);

  return errors;
}

// Update

function createUpdateValidator() {
  return {
    code: (value) => {
      if (!value || value.trim().length === 0) return "Code is required";
      if (value.length > 14) return "Code must be 14 characters or fewer";
      return null;
    },
    name: (value) => {
      if (!value || value.trim().length === 0) return "Name is required";
      return null;
    },
    accountType: (value) => {
      if (!value || !VALID_ACCOUNT_TYPES.includes(value as typeof VALID_ACCOUNT_TYPES[number])) {
        return "Account type must be one of: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE";
      }
      return null;
    },
    accountCategoryId: (_value) => null,
  } satisfies {
    [K in keyof GlAccountUpdateRequestDto]-?: FieldValidator<GlAccountUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: GlAccountUpdateRequestDto): string[] {
  const errors: string[] = [];
  const v = createUpdateValidator();

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const typeErr = v.accountType(input.accountType);
  if (typeErr) errors.push(typeErr);

  const catErr = v.accountCategoryId(input.accountCategoryId);
  if (catErr) errors.push(catErr);

  return errors;
}

// Patch

function createPatchValidator() {
  return {
    name: (value) => {
      if (value !== undefined && value.trim().length === 0) return "Name cannot be empty";
      return null;
    },
    accountType: (value) => {
      if (value !== undefined && !VALID_ACCOUNT_TYPES.includes(value as typeof VALID_ACCOUNT_TYPES[number])) {
        return "Account type must be one of: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE";
      }
      return null;
    },
    accountCategoryId: (_value) => null,
  } satisfies {
    [K in keyof GlAccountPatchRequestDto]-?: FieldValidator<GlAccountPatchRequestDto[K]>;
  };
}

export function validatePatch(input: GlAccountPatchRequestDto): string[] {
  const errors: string[] = [];
  const v = createPatchValidator();

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const typeErr = v.accountType(input.accountType);
  if (typeErr) errors.push(typeErr);

  const catErr = v.accountCategoryId(input.accountCategoryId);
  if (catErr) errors.push(catErr);

  return errors;
}

// Response

function createResponseValidator() {
  return {
    id: (value) => {
      if (value === undefined || value === null || !Number.isFinite(value)) return "id is required";
      return null;
    },
    code: (value) => {
      if (!value || value.trim().length === 0) return "code is required";
      return null;
    },
    name: (value) => {
      if (!value || value.trim().length === 0) return "name is required";
      return null;
    },
    accountType: (value) => {
      if (!value || !VALID_ACCOUNT_TYPES.includes(value as typeof VALID_ACCOUNT_TYPES[number])) {
        return "accountType must be valid";
      }
      return null;
    },
    accountCategoryId: (_value) => null,
    category: (_value) => null,
    status: (value) => {
      if (!VALID_STATUSES.includes(value as typeof VALID_STATUSES[number])) {
        return "status must be AVAILABLE or RETIRED";
      }
      return null;
    },
    linkedBy: (value) => {
      if (!Array.isArray(value)) return "linkedBy must be an array";
      for (const link of value) {
        if (!VALID_POINTER_TYPES.includes(link.type as typeof VALID_POINTER_TYPES[number])) {
          return "linkedBy type must be valid";
        }
        if (!link.code || link.code.trim().length === 0) return "linkedBy code is required";
      }
      return null;
    },
    hasPostings: (value) => {
      if (typeof value !== "boolean") return "hasPostings must be a boolean";
      return null;
    },
    companiesWithPostings: (value) => {
      if (!Array.isArray(value)) return "companiesWithPostings must be an array";
      if (value.some((item) => typeof item !== "string")) return "companiesWithPostings must contain strings";
      return null;
    },
    audit: (value) => {
      if (!value) return "audit is required";
      if (!value.created) return "audit.created is required";
      if (!value.updated) return "audit.updated is required";
      if (!value.created.date || value.created.date.trim().length === 0) return "audit.created.date is required";
      if (!value.updated.date || value.updated.date.trim().length === 0) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof GlAccountResponseDto]-?: FieldValidator<GlAccountResponseDto[K]>;
  };
}

export function validateResponse(input: GlAccountResponseDto): string[] {
  const errors: string[] = [];
  const v = createResponseValidator();

  const idErr = v.id(input.id);
  if (idErr) errors.push(idErr);

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const typeErr = v.accountType(input.accountType);
  if (typeErr) errors.push(typeErr);

  const catIdErr = v.accountCategoryId(input.accountCategoryId);
  if (catIdErr) errors.push(catIdErr);

  const catErr = v.category(input.category);
  if (catErr) errors.push(catErr);

  const statusErr = v.status(input.status);
  if (statusErr) errors.push(statusErr);

  const linkedByErr = v.linkedBy(input.linkedBy);
  if (linkedByErr) errors.push(linkedByErr);

  const postingsErr = v.hasPostings(input.hasPostings);
  if (postingsErr) errors.push(postingsErr);

  const companiesWithPostingsErr = v.companiesWithPostings(input.companiesWithPostings);
  if (companiesWithPostingsErr) errors.push(companiesWithPostingsErr);

  const auditErr = v.audit(input.audit);
  if (auditErr) errors.push(auditErr);

  return errors;
}

