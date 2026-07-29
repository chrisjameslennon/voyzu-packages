import type { OperationBlocker, Status } from "@voyzu/types/modules/core";

export interface IceCreamOperationState {
  code: string;
  status: Status;
}

export function Activate(current: IceCreamOperationState): OperationBlocker[] {
  return current.status === "ACTIVE"
    ? [{ code: "ALREADY_ACTIVE", message: `Ice cream ${current.code} is already active` }]
    : [];
}

export function Deactivate(current: IceCreamOperationState): OperationBlocker[] {
  return current.status === "INACTIVE"
    ? [{ code: "ALREADY_INACTIVE", message: `Ice cream ${current.code} is already inactive` }]
    : [];
}

export function Delete(_current: IceCreamOperationState): OperationBlocker[] {
  return [];
}
