import type { CurrencyCreateRequestDto } from "@voyzu-modules/core/types/modules/currencies";
import type { CurrencyUpdateRequestDto } from "@voyzu-modules/core/types/modules/currencies";
import type { CurrencyPatchRequestDto } from "@voyzu-modules/core/types/modules/currencies";
import type { CurrencyResponseDto } from "@voyzu-modules/core/types/modules/currencies";

type FieldValidator<T> = (value: T) => string | null;

function createCreateValidator() {
  return {
    code: (value) => value?.trim() ? null : "Code is required",
    name: (value) => value?.trim() ? null : "Name is required",
    symbol: (_value) => null,
  } satisfies {
    [K in keyof CurrencyCreateRequestDto]-?: FieldValidator<CurrencyCreateRequestDto[K]>;
  };
}

export function validateCreate(input: CurrencyCreateRequestDto): string[] {
  const v = createCreateValidator();
  return [v.code(input.code), v.name(input.name), v.symbol(input.symbol)].filter((error): error is string => error !== null);
}

function createUpdateValidator() {
  return {
    name: (value) => value?.trim() ? null : "Name is required",
    symbol: (_value) => null,
  } satisfies {
    [K in keyof CurrencyUpdateRequestDto]-?: FieldValidator<CurrencyUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: CurrencyUpdateRequestDto): string[] {
  const v = createUpdateValidator();
  return [v.name(input.name), v.symbol(input.symbol)].filter((error): error is string => error !== null);
}


function createPatchValidator() {
  return {
    name: (value) => {
      if (value !== undefined && value.trim().length === 0) return "Name cannot be empty";
      return null;
    },
    symbol: (_value) => null,
  } satisfies {
    [K in keyof CurrencyPatchRequestDto]-?: FieldValidator<CurrencyPatchRequestDto[K]>;
  };
}

export function validatePatch(input: CurrencyPatchRequestDto): string[] {
  const errors: string[] = [];
  const suppliedKeys = Object.keys(input);
  const allowedKeys = new Set<string>(["name", "symbol"]);
  const unknownKeys = suppliedKeys.filter((key) => !allowedKeys.has(key));
  if (unknownKeys.length) {
    errors.push(`Unknown field(s): ${unknownKeys.join(", ")}`);
    return errors;
  }
  if (suppliedKeys.length === 0) {
    errors.push("At least one field must be provided");
    return errors;
  }
  const v = createPatchValidator();

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const symbolErr = v.symbol(input.symbol);
  if (symbolErr) errors.push(symbolErr);

  return errors;
}


function createResponseValidator() {
  return {
    id: (value) => {
      if (!value || value.trim().length === 0) return "id is required";
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

    symbol: (_value) => null,

    status: (value) => {
      if (value !== "ACTIVE" && value !== "INACTIVE") return "status must be ACTIVE or INACTIVE";
      return null;
    },

    hasPostings: (value) => {
      if (typeof value !== "boolean") return "hasPostings must be a boolean";
      return null;
    },

    linkedBy: (value) => Array.isArray(value) ? null : "linkedBy must be an array",

    audit: (value) => {
      if (!value) return "audit is required";
      if (!value.created) return "audit.created is required";
      if (!value.updated) return "audit.updated is required";
      if (!value.created.date || value.created.date.trim().length === 0) return "audit.created.date is required";
      if (!value.updated.date || value.updated.date.trim().length === 0) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof CurrencyResponseDto]-?: FieldValidator<CurrencyResponseDto[K]>;
  };
}

export function validateResponse(input: CurrencyResponseDto): string[] {
  const errors: string[] = [];
  const v = createResponseValidator();

  const idErr = v.id(input.id);
  if (idErr) errors.push(idErr);

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const symbolErr = v.symbol(input.symbol);
  if (symbolErr) errors.push(symbolErr);

  const statusErr = v.status(input.status);
  if (statusErr) errors.push(statusErr);

  const hasPostingsErr = v.hasPostings(input.hasPostings);
  if (hasPostingsErr) errors.push(hasPostingsErr);
  const linkedByErr = v.linkedBy(input.linkedBy);
  if (linkedByErr) errors.push(linkedByErr);

  const auditErr = v.audit(input.audit);
  if (auditErr) errors.push(auditErr);

  return errors;
}
