import { CodeChange, CodeChangeAvailability, Deactivation, Deletion, type LinkedReference, type OperationBlocker } from "@voyzu/core/common/domain/operation-policy";

export interface DimensionOperationState {
  code: string;
  hasPostings: boolean;
  linkedBy?: LinkedReference[];
}

export function ChangeCode(current: DimensionOperationState, proposedCode: string): OperationBlocker[] {
  return CodeChange(current, proposedCode, "Dimension");
}

export function ChangeCodeAvailability(current: DimensionOperationState): OperationBlocker[] {
  return CodeChangeAvailability(current, "Dimension");
}

export function Deactivate(current: DimensionOperationState): OperationBlocker[] {
  return Deactivation({ ...current, linkedBy: current.linkedBy ?? [] }, "Dimension");
}

export function Delete(current: DimensionOperationState): OperationBlocker[] {
  return Deletion({ ...current, linkedBy: current.linkedBy ?? [] }, "Dimension", { blockWhenHasPostings: true });
}

export interface DimensionValueOperationState {
  name: string;
  hasPostings: boolean;
}

export function ChangeValueNameAvailability(current: DimensionValueOperationState): OperationBlocker[] {
  if (!current.hasPostings) return [];
  return [{
    code: "HAS_POSTINGS_NAME_LOCKED",
    message: `Dimension value ${current.name} has postings and its name cannot be changed`,
  }];
}

export function ChangeValueName(current: DimensionValueOperationState, proposedName: string): OperationBlocker[] {
  if (proposedName === current.name) return [];
  return ChangeValueNameAvailability(current);
}

export function DeactivateValue(_current: DimensionValueOperationState): OperationBlocker[] {
  return [];
}

export function DeleteValue(current: DimensionValueOperationState): OperationBlocker[] {
  if (!current.hasPostings) return [];
  return [{
    code: "HAS_POSTINGS_CANNOT_BE_DELETED",
    message: `Dimension value ${current.name} has postings and cannot be deleted`,
  }];
}
