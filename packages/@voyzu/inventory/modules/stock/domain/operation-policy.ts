export interface OperationBlocker {
  code: string;
  message: string;
}
type WarehouseStatus = "ACTIVE" | "INACTIVE";

function inactiveWarehouse(
  status: WarehouseStatus,
  code: string,
  message: string,
): OperationBlocker[] {
  return status === "INACTIVE" ? [{ code, message }] : [];
}
export function MoveAvailableStock(
  requirements: Array<{ available: number; requested: number }>,
): OperationBlocker[] {
  const unavailable = requirements.find(
    ({ available, requested }) => requested > available,
  );
  return unavailable
    ? [
        {
          code: "INSUFFICIENT_AVAILABLE_STOCK",
          message: `Only ${unavailable.available} units are available for this item and warehouse`,
        },
      ]
    : [];
}
export function Transfer(
  fromWarehouseId: number,
  toWarehouseId: number,
  requirements: Array<{ available: number; requested: number }> = [],
  toWarehouseStatus: WarehouseStatus = "ACTIVE",
): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (fromWarehouseId === toWarehouseId)
    blockers.push({ code: "SAME_WAREHOUSE", message: "From and To warehouses must be different" });
  return [
    ...blockers,
    ...inactiveWarehouse(
      toWarehouseStatus,
      "INACTIVE_DESTINATION_WAREHOUSE",
      "Stock cannot be transferred into an inactive warehouse",
    ),
    ...MoveAvailableStock(requirements),
  ];
}
export function Adjust(
  lines: Array<{ quantityChange: number; reasonCode?: string | null }>,
  notes?: string | null,
  warehouseStatus: WarehouseStatus = "ACTIVE",
): OperationBlocker[] {
  const blockers = lines.some((line) => line.quantityChange !== 0)
    ? []
    : [{ code: "NO_ADJUSTMENT", message: "Enter at least one quantity adjustment" }];
  return [
    ...inactiveWarehouse(
      warehouseStatus,
      "INACTIVE_WAREHOUSE",
      "Stock quantities cannot be adjusted in an inactive warehouse",
    ),
    ...blockers,
    ...OtherReasonRequiresNotes(lines, notes),
  ];
}

export function OtherReasonRequiresNotes(
  lines: Array<{ reasonCode?: string | null }>,
  notes: string | null | undefined,
): OperationBlocker[] {
  return lines.some(
    ({ reasonCode }) =>
      reasonCode === "OTHER" || reasonCode === "WRITE_OFF_OTHER",
  ) && !notes?.trim()
    ? [
        {
          code: "OTHER_REASON_REQUIRES_NOTES",
          message: "Notes are required when a reason is Other",
        },
      ]
    : [];
}

export function Receive(
  lines: Array<{ reasonCode: string | null | undefined }>,
  notes: string | null | undefined,
  missingRequiredCustomFields: string[] = [],
  warehouseStatus: WarehouseStatus = "ACTIVE",
): OperationBlocker[] {
  return [
    ...inactiveWarehouse(
      warehouseStatus,
      "INACTIVE_WAREHOUSE",
      "Stock cannot be received into an inactive warehouse",
    ),
    ...OtherReasonRequiresNotes(lines, notes),
    ...RequiredCustomFields(missingRequiredCustomFields),
  ];
}

export function Issue(
  requirements: Array<{ available: number; requested: number }>,
  lines: Array<{ reasonCode: string | null | undefined }>,
  notes: string | null | undefined,
  missingRequiredCustomFields: string[] = [],
): OperationBlocker[] {
  return [...OtherReasonRequiresNotes(lines, notes), ...RequiredCustomFields(missingRequiredCustomFields), ...MoveAvailableStock(requirements)];
}

function RequiredCustomFields(names: string[]): OperationBlocker[] {
  return names.length
    ? [{ code: "REQUIRED_CUSTOM_FIELDS_MISSING", message: `Complete required custom fields: ${names.join(", ")}` }]
    : [];
}

export function Reserve(
  requirements: Array<{ available: number; requested: number }>,
  lines: Array<{ reasonCode: string | null | undefined }>,
  notes: string | null | undefined,
  warehouseStatuses: WarehouseStatus[] = [],
): OperationBlocker[] {
  return [
    ...(warehouseStatuses.some((status) => status === "INACTIVE")
      ? [{ code: "INACTIVE_WAREHOUSE", message: "Stock cannot be reserved in an inactive warehouse" }]
      : []),
    ...OtherReasonRequiresNotes(lines, notes),
    ...MoveAvailableStock(requirements),
  ];
}

export function CreateStockCount(
  lines: Array<{ reasonCode: string | null | undefined }>,
  notes: string | null | undefined,
  warehouseStatus: WarehouseStatus = "ACTIVE",
): OperationBlocker[] {
  return [
    ...inactiveWarehouse(
      warehouseStatus,
      "INACTIVE_WAREHOUSE",
      "A stocktake cannot be created for an inactive warehouse",
    ),
    ...OtherReasonRequiresNotes(lines, notes),
  ];
}

export function SaveStockCount(
  currentStatus: string,
  lines: Array<{ reasonCode: string | null | undefined }>,
  notes: string | null | undefined,
  warehouseStatus: WarehouseStatus = "ACTIVE",
): OperationBlocker[] {
  return [
    ...inactiveWarehouse(
      warehouseStatus,
      "INACTIVE_WAREHOUSE",
      "A stocktake for an inactive warehouse cannot be changed",
    ),
    ...(currentStatus === "COMPLETED"
      ? [{ code: "STOCK_COUNT_COMPLETED", message: "A completed stocktake cannot be changed" }]
      : []),
    ...OtherReasonRequiresNotes(lines, notes),
  ];
}

export function CompleteStockCount(
  currentStatus: string,
  lines: Array<{ reasonCode: string | null | undefined }>,
  notes: string | null | undefined,
  warehouseStatus: WarehouseStatus = "ACTIVE",
): OperationBlocker[] {
  return [
    ...inactiveWarehouse(
      warehouseStatus,
      "INACTIVE_WAREHOUSE",
      "A stocktake for an inactive warehouse cannot be completed",
    ),
    ...(currentStatus === "COMPLETED"
      ? [{ code: "STOCK_COUNT_ALREADY_COMPLETED", message: "This stocktake is already complete" }]
      : []),
    ...OtherReasonRequiresNotes(lines, notes),
  ];
}

export function DeleteStockCount(currentStatus: string): OperationBlocker[] {
  return currentStatus === "COMPLETED"
    ? [{ code: "STOCK_COUNT_COMPLETED", message: "A completed stocktake cannot be deleted" }]
    : [];
}
