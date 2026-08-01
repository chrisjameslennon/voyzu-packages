import { Deactivation, Deletion, type OperationBlocker } from "@voyzu/core/common/domain/operation-policy";

export interface InventoryCategoryOperationState {
  code: string;
  numberOfItems: {
    total: number;
    active: number;
  };
}

function itemReferences(current: InventoryCategoryOperationState, count: number) {
  return count > 0 ? [{ type: "Inventory Items", code: `${count} items` }] : [];
}

export function Deactivate(current: InventoryCategoryOperationState): OperationBlocker[] {
  return Deactivation(
    { code: current.code, linkedBy: itemReferences(current, current.numberOfItems.active) },
    "Inventory category",
  );
}

export function Delete(current: InventoryCategoryOperationState): OperationBlocker[] {
  return Deletion(
    { code: current.code, linkedBy: itemReferences(current, current.numberOfItems.total) },
    "Inventory category",
  );
}
