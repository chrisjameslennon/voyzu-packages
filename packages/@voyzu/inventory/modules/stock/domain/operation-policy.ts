export interface OperationBlocker {
  code: string;
  message: string;
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
): OperationBlocker[] {
  return fromWarehouseId === toWarehouseId
    ? [
        {
          code: "SAME_WAREHOUSE",
          message: "From and To warehouses must be different",
        },
      ]
    : [];
}
export function Adjust(
  lines: Array<{ quantityChange: number }>,
): OperationBlocker[] {
  return lines.some((line) => line.quantityChange !== 0)
    ? []
    : [
        {
          code: "NO_ADJUSTMENT",
          message: "Enter at least one quantity adjustment",
        },
      ];
}

export function OtherReasonRequiresNotes(
  lines: Array<{ reasonCode: string | null | undefined }>,
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
