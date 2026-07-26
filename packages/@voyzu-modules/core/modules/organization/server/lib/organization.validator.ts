import type {
  OrganizationResponseDto,
  OrganizationUpdateRequestDto,
} from "@voyzu-modules/core/types/modules/organization";

type FieldValidator<T> = (value: T) => string | null;

function createUpdateValidator() {
  return {
    code: (value) => {
      if (value === undefined) return null;
      if (!value || value.trim().length === 0) return "Code is required";
      if (!/^[A-Z0-9_-]+$/.test(value)) return "Code can only contain capital letters, numbers, dashes and underscores";
      if (value.length > 40) return "Code must be 40 characters or less";
      return null;
    },
    organizationName: (value) => {
      if (!value || value.trim().length === 0) return "Organization name is required";
      return null;
    },
  } satisfies {
    [K in keyof OrganizationUpdateRequestDto]-?: FieldValidator<OrganizationUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: OrganizationUpdateRequestDto): string[] {
  const errors: string[] = [];
  const v = createUpdateValidator();
  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);
  const nameErr = v.organizationName(input.organizationName);
  if (nameErr) errors.push(nameErr);
  return errors;
}

function createResponseValidator() {
  return {
    id: (value) => (!Number.isFinite(value) ? "id is required" : null),
    code: (value) => (!value || value.trim().length === 0 ? "code is required" : null),
    organizationName: (value) => (!value || value.trim().length === 0 ? "organizationName is required" : null),
    status: (value) => (!["ACTIVE", "INACTIVE"].includes(value) ? "status must be ACTIVE or INACTIVE" : null),
    hasPostings: (value) => (typeof value !== "boolean" ? "hasPostings must be a boolean" : null),
    audit: (value) => {
      if (!value) return "audit is required";
      if (!value.created) return "audit.created is required";
      if (!value.updated) return "audit.updated is required";
      if (!value.created.date || value.created.date.trim().length === 0) return "audit.created.date is required";
      if (!value.updated.date || value.updated.date.trim().length === 0) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof OrganizationResponseDto]-?: FieldValidator<OrganizationResponseDto[K]>;
  };
}

export function validateResponse(input: OrganizationResponseDto): string[] {
  const errors: string[] = [];
  const v = createResponseValidator();
  for (const [key, fn] of Object.entries(v) as [keyof OrganizationResponseDto, FieldValidator<unknown>][]) {
    const err = fn(input[key] as unknown);
    if (err) errors.push(err);
  }
  return errors;
}
