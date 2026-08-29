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
