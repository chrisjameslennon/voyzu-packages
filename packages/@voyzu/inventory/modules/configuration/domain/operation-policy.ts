export interface OperationBlocker {
  code: string;
  message: string;
}

export function Create(input: {
  kind: "category" | "warehouse" | "custom-field" | "option-list";
  hasCode: boolean;
  hasDataType: boolean;
  hasAppliesTo: boolean;
}): OperationBlocker[] {
  if ((input.kind === "category" || input.kind === "warehouse") && !input.hasCode)
    return [{ code: "CODE_REQUIRED", message: "Code is required" }];
  if (input.kind === "custom-field" && (!input.hasDataType || !input.hasAppliesTo))
    return [{ code: "CUSTOM_FIELD_DEFINITION_INCOMPLETE", message: "Data type and Applies To are required" }];
  return [];
}

export function Update(): OperationBlocker[] { return []; }
export function Activate(): OperationBlocker[] { return []; }

export function Deactivate(
  kind: "category" | "warehouse" | "custom-field" | "option-list",
  records: Array<{ name: string; inUse: boolean }>,
): OperationBlocker[] {
  if (kind !== "category") return [];
  const used = records.filter(({ inUse }) => inUse);
  return used.length
    ? [{
        code: "CATEGORY_CONTAINS_ITEMS",
        message: `Item categories containing items cannot be deleted or made inactive. This applies whether the items are active or inactive. [${used.map(({ name }) => name).join(", ")}]`,
      }]
    : [];
}

export function Delete(
  records: Array<{ name: string; inUse: boolean }>,
): OperationBlocker[] {
  const used = records.filter((record) => record.inUse);
  return used.length
    ? [
        {
          code: "IN_USE",
          message: `In-use records cannot be deleted: ${used.map((record) => record.name).join(", ")}`,
        },
      ]
    : [];
}

export function DeleteWarehouse(
  records: Array<{ name: string; hasUnitsOnHand: boolean }>,
): OperationBlocker[] {
  const stocked = records.filter((record) => record.hasUnitsOnHand);
  return stocked.length
    ? [
        {
          code: "STOCK_ON_HAND",
          message: `The stock must be issued, transferred, or written off before the warehouse can be deleted. [${stocked.map(({ name }) => name).join(", ")}]`,
        },
      ]
    : [];
}

export function AddOptionValue(): OperationBlocker[] { return []; }
export function UpdateOptionValue(): OperationBlocker[] { return []; }
export function DeleteOptionValue(): OperationBlocker[] { return []; }
