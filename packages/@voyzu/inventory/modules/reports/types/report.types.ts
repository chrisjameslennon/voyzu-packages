import Type, { type Static } from "typebox";
import { StrictObject } from "@voyzu/types/api";
export const InventoryReportKeyDto = Type.Union([
  Type.Literal("items"),
  Type.Literal("item-categories"),
  Type.Literal("stock-on-hand"),
  Type.Literal("stock-availability"),
  Type.Literal("stock-activity"),
  Type.Literal("stock-reservation-activity"),
  Type.Literal("stock-issuances"),
  Type.Literal("stock-receipts"),
  Type.Literal("stock-transfers"),
  Type.Literal("stocktake-variance"),
  Type.Literal("quantity-adjustments"),
  Type.Literal("financial-activity"),
]);
export type InventoryReportKey = Static<typeof InventoryReportKeyDto>;
export const InventoryReportDto = StrictObject({
  title: Type.String(),
  headers: Type.Array(Type.String()),
  rows: Type.Array(
    StrictObject({
      id: Type.String(),
      cells: Type.Array(Type.String()),
      date: Type.Optional(Type.String()),
      inactive: Type.Optional(Type.Boolean()),
      details: Type.Optional(
        Type.Array(
          StrictObject({ label: Type.String(), value: Type.String() }),
        ),
      ),
    }),
  ),
});
export type InventoryReport = Static<typeof InventoryReportDto>;
