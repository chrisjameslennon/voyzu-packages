export interface OperationBlocker {
  code: string;
  message: string;
}

export function Create(input: {
  hasManualSku: boolean;
  hasReservedSku: boolean;
  quantityTracked: boolean;
  unit: string | null;
}): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (input.hasManualSku && input.hasReservedSku)
    blockers.push({ code: "MULTIPLE_SKU_SOURCES", message: "Use either a manual SKU or a reserved automatic SKU" });
  if (input.quantityTracked && input.unit === null)
    blockers.push({ code: "TRACKED_ITEM_REQUIRES_UNIT", message: "Unit is required when quantity tracking is enabled" });
  return blockers;
}

export function ReserveSku(): OperationBlocker[] { return []; }

export function Update(input: {
  quantityTracked: boolean;
  unit: string | null;
  missingRequiredCustomFields: string[];
}): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (input.quantityTracked && input.unit === null)
    blockers.push({ code: "TRACKED_ITEM_REQUIRES_UNIT", message: "Unit is required when quantity tracking is enabled" });
  if (input.missingRequiredCustomFields.length)
    blockers.push({
      code: "REQUIRED_CUSTOM_FIELDS_MISSING",
      message: `Complete required custom field${input.missingRequiredCustomFields.length === 1 ? "" : "s"}: ${input.missingRequiredCustomFields.join(", ")}`,
    });
  return blockers;
}

export function Activate(): OperationBlocker[] { return []; }
export function Deactivate(): OperationBlocker[] { return []; }

export function ChangeCategory(input: { proposedCategoryAvailable: boolean }): OperationBlocker[] {
  return input.proposedCategoryAvailable
    ? []
    : [{ code: "CATEGORY_NOT_AVAILABLE", message: "Select an active item category" }];
}

export function Delete(records: Array<{ hasUnitsOnHand: boolean }>): OperationBlocker[] {
  return records.some(({ hasUnitsOnHand }) => hasUnitsOnHand)
    ? [{ code: "STOCK_ON_HAND", message: "The stock must be issued or written off before the item can be deleted" }]
    : [];
}
