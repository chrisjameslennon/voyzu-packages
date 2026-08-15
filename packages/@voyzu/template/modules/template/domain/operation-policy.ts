import type { OperationBlocker, Status } from "@voyzu/types/modules/core";

export interface TemplateOperationState {
  code: string;
  status: Status;
}

export function Activate(current: TemplateOperationState): OperationBlocker[] {
  return current.status === "ACTIVE"
    ? [{ code: "ALREADY_ACTIVE", message: `Template ${current.code} is already active` }]
    : [];
}

export function Deactivate(current: TemplateOperationState): OperationBlocker[] {
  return current.status === "INACTIVE"
    ? [{ code: "ALREADY_INACTIVE", message: `Template ${current.code} is already inactive` }]
    : [];
}

export function Delete(_current: TemplateOperationState): OperationBlocker[] {
  return [];
}
