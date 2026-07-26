import { CodeChange, CodeChangeAvailability as SharedCodeChangeAvailability, type OperationBlocker } from "@voyzu-modules/all-modules/common/domain/operation-policy";

export interface InventoryItemOperationState {
  item_code: string;
  hasPostings: boolean;
}

function operationState(current: InventoryItemOperationState) {
  return { code: current.item_code, hasPostings: current.hasPostings };
}

export function ChangeCode(current: InventoryItemOperationState, proposedCode: string): OperationBlocker[] {
  return CodeChange(operationState(current), proposedCode, "Item");
}

export function ChangeCodeAvailability(current: InventoryItemOperationState): OperationBlocker[] {
  return SharedCodeChangeAvailability(operationState(current), "Item");
}

export function Deactivate(_current: InventoryItemOperationState): OperationBlocker[] {
  return [];
}

export function Delete(_current: InventoryItemOperationState): OperationBlocker[] {
  return [];
}
