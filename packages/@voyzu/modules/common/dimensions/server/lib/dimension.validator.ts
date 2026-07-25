import type { DimensionCreateRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionUpdateRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionPatchRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionResponseDto } from "@voyzu/types/modules/dimensions";
import type { DimensionValueResponseDto } from "@voyzu/types/modules/dimensions";
import type { DimensionValueCreateRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionValuePatchRequestDto } from "@voyzu/types/modules/dimensions";

type FieldValidator<T> = (value: T) => string | null;

const VALID_STATUSES = ["ACTIVE", "INACTIVE"];
const DIMENSION_CODE_PATTERN = /^[A-Z0-9_-]{1,14}$/;
const DIMENSION_VALUE_NAME_PATTERN = /^[A-Za-z0-9 _-]{1,14}$/;

function validateDimensionCode(value: string | undefined, required: boolean): string | null {
  if (!value?.trim()) return required ? "Code is required" : "Code cannot be empty";
  if (!DIMENSION_CODE_PATTERN.test(value)) {
    return "Code must be 1 to 14 capital letters, numbers, dashes or underscores";
  }
  return null;
}

function validateDimensionValueName(value: string | undefined, required: boolean): string | null {
  if (!value?.trim()) return required ? "Name is required" : "Name cannot be empty";
  if (!DIMENSION_VALUE_NAME_PATTERN.test(value)) {
    return "Name must be 1 to 14 letters, numbers, spaces, dashes or underscores";
  }
  return null;
}

export function validateDimensionValueCreate(input: DimensionValueCreateRequestDto): string[] {
  const validators = {
    name: (value) => validateDimensionValueName(value, true),
    status: (value) => value !== undefined && !VALID_STATUSES.includes(value)
      ? "Status must be ACTIVE or INACTIVE"
      : null,
  } satisfies {
    [K in keyof DimensionValueCreateRequestDto]-?: FieldValidator<DimensionValueCreateRequestDto[K]>;
  };

  const errors = [
    validators.name(input.name),
    validators.status(input.status),
  ];
  return errors.filter((error): error is string => error !== null);
}

export function validateDimensionValuePatch(input: DimensionValuePatchRequestDto): string[] {
  const validators = {
    name: (value) => value === undefined ? null : validateDimensionValueName(value, false),
    status: (value) => value !== undefined && !VALID_STATUSES.includes(value)
      ? "Status must be ACTIVE or INACTIVE"
      : null,
  } satisfies {
    [K in keyof DimensionValuePatchRequestDto]-?: FieldValidator<DimensionValuePatchRequestDto[K]>;
  };

  const errors = [
    validators.name(input.name),
    validators.status(input.status),
  ];
  return errors.filter((error): error is string => error !== null);
}

function validateValueResponse(value: DimensionValueResponseDto, index: number): string[] {
  const errors: string[] = [];
  const path = `values[${index}]`;
  if (!Number.isFinite(value.id)) errors.push(`${path}.id is required`);
  if (!Number.isFinite(value.dimensionId)) errors.push(`${path}.dimensionId is required`);
  if (!value.name?.trim()) errors.push(`${path}.name is required`);
  if (!VALID_STATUSES.includes(value.status)) errors.push(`${path}.status must be ACTIVE or INACTIVE`);
  if (typeof value.hasPostings !== "boolean") errors.push(`${path}.hasPostings must be a boolean`);
  if (!Array.isArray(value.companiesWithPostings) || value.companiesWithPostings.some((item) => typeof item !== "string")) {
    errors.push(`${path}.companiesWithPostings must contain strings`);
  }
  return errors;
}

// ── Create ────────────────────────────────────────────────────

function createCreateValidator() {
  return {
    code: (value) => {
      return validateDimensionCode(value, true);
    },
    name: (value) => {
      if (!value || value.trim().length === 0) return "Name is required";
      return null;
    },
  } satisfies {
    [K in keyof DimensionCreateRequestDto]-?: FieldValidator<DimensionCreateRequestDto[K]>;
  };
}

export function validateCreate(input: DimensionCreateRequestDto): string[] {
  const errors: string[] = [];
  const v = createCreateValidator();

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  return errors;
}

// ── Update (full replace) ─────────────────────────────────────

function createUpdateValidator() {
  return {
    name: (value) => {
      if (!value || value.trim().length === 0) return "Name is required";
      return null;
    },
  } satisfies {
    [K in keyof DimensionUpdateRequestDto]-?: FieldValidator<DimensionUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: DimensionUpdateRequestDto): string[] {
  const errors: string[] = [];
  const v = createUpdateValidator();

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  return errors;
}

// ── Patch (partial) ───────────────────────────────────────────

function createPatchValidator() {
  return {
    code: (value) => value === undefined ? null : validateDimensionCode(value, false),
    name: (value) => {
      if (value !== undefined && value.trim().length === 0) return "Name cannot be empty";
      return null;
    },
  } satisfies {
    [K in keyof DimensionPatchRequestDto]-?: FieldValidator<DimensionPatchRequestDto[K]>;
  };
}

export function validatePatch(input: DimensionPatchRequestDto): string[] {
  const errors: string[] = [];
  const v = createPatchValidator();

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  return errors;
}

// ── Response ──────────────────────────────────────────────────

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
    status: (value) => {
      if (!VALID_STATUSES.includes(value)) return "status must be AVAILABLE or RETIRED";
      return null;
    },
    values: (value) => {
      if (value === undefined) return null;
      if (!Array.isArray(value)) return "values must be an array";
      const errors = value.flatMap(validateValueResponse);
      return errors.length ? errors.join("; ") : null;
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
    [K in keyof DimensionResponseDto]-?: FieldValidator<DimensionResponseDto[K]>;
  };
}

export function validateResponse(input: DimensionResponseDto): string[] {
  const errors: string[] = [];
  const v = createResponseValidator();

  const idErr = v.id(input.id);
  if (idErr) errors.push(idErr);

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const statusErr = v.status(input.status);
  if (statusErr) errors.push(statusErr);

  const valuesErr = v.values(input.values);
  if (valuesErr) errors.push(valuesErr);

  const postingsErr = v.hasPostings(input.hasPostings);
  if (postingsErr) errors.push(postingsErr);
  const companiesWithPostingsErr = v.companiesWithPostings(input.companiesWithPostings);
  if (companiesWithPostingsErr) errors.push(companiesWithPostingsErr);
  const auditErr = v.audit(input.audit);
  if (auditErr) errors.push(auditErr);

  return errors;
}
