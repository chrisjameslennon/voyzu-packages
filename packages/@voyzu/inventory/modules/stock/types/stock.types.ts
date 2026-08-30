import Type, { type Static } from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/types/modules/core";
const Id = Type.Integer({ minimum: 1 });
const Qty = Type.Number({ exclusiveMinimum: 0 });
const Text = Type.String({ pattern: "\\S" });
export const StockPositionDto = StrictObject({
  id: Id,
  itemId: Id,
  sku: Text,
  itemName: Text,
  unit: Type.Union([Type.String(), Type.Null()]),
  warehouseId: Id,
  warehouseName: Text,
  onHand: Type.Number(),
  reserved: Type.Number({ minimum: 0 }),
  available: Type.Number(),
});
export type StockPosition = Static<typeof StockPositionDto>;
export const StockActivityDto = StrictObject({
  id: Type.Integer(),
  date: Type.String(),
  type: Text,
  sku: Text,
  itemName: Text,
  warehouse: Text,
  quantityChange: Type.Union([Type.Number(), Type.Null()]),
  source: Type.Union([Type.String(), Type.Null()]),
  sourceId: Type.Union([Type.String(), Type.Null()]),
  reference: Type.Union([Type.String(), Type.Null()]),
});
export type StockActivity = Static<typeof StockActivityDto>;
export const StockOptionDto = StrictObject({
  id: Id,
  code: Text,
  name: Text,
  unit: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});
export type StockOption = Static<typeof StockOptionDto>;
export const MovementLineDto = StrictObject({
  itemId: Id,
  quantity: Qty,
});
export type MovementLine = Static<typeof MovementLineDto>;
export const StockCustomFieldValueDto = Type.Union([
  Type.String(),
  Type.Number(),
  Type.Boolean(),
  Type.Array(Id),
  Type.Null(),
]);
export const StockCustomFieldInputDto = StrictObject({
  customFieldId: Id,
  value: StockCustomFieldValueDto,
});
export type StockCustomFieldInput = Static<typeof StockCustomFieldInputDto>;
export const MovementRequestDto = StrictObject({
  date: Text,
  warehouseId: Id,
  reference: Type.Optional(Type.String()),
  lines: Type.Array(MovementLineDto, { minItems: 1 }),
  customFields: Type.Optional(Type.Array(StockCustomFieldInputDto)),
});
export type MovementRequest = Static<typeof MovementRequestDto>;
export const TransferRequestDto = StrictObject({
  date: Text,
  itemId: Id,
  fromWarehouseId: Id,
  toWarehouseId: Id,
  quantity: Qty,
  reference: Type.Optional(Type.String()),
});
export type TransferRequest = Static<typeof TransferRequestDto>;
export const ReservationLineDto = StrictObject({
  warehouseId: Id,
  quantity: Qty,
});
export const ReservationRequestDto = StrictObject({
  itemId: Id,
  reference: Type.Optional(Type.String()),
  lines: Type.Array(ReservationLineDto, { minItems: 1 }),
});
export type ReservationRequest = Static<typeof ReservationRequestDto>;
export const AdjustmentRequestDto = StrictObject({
  date: Text,
  warehouseId: Id,
  reference: Type.Optional(Type.String()),
  lines: Type.Array(
    StrictObject({ itemId: Id, quantityChange: Type.Number() }),
    { minItems: 1 },
  ),
});
export type AdjustmentRequest = Static<typeof AdjustmentRequestDto>;
export const StockCountLineDto = StrictObject({
  id: Id,
  itemId: Id,
  sku: Text,
  itemName: Text,
  expectedQuantity: Type.Number({ minimum: 0 }),
  countedQuantity: Type.Union([Type.Number({ minimum: 0 }), Type.Null()]),
  variance: Type.Union([Type.Number(), Type.Null()]),
});
export type StockCountLine = Static<typeof StockCountLineDto>;
export const StockCountRowDto = StrictObject({
  id: Id,
  countNo: Text,
  warehouse: Text,
  countDate: Text,
  items: Type.Integer({ minimum: 0 }),
  adjustments: Type.Integer({ minimum: 0 }),
  status: Type.Union([
    Type.Literal("DRAFT"),
    Type.Literal("IN_PROGRESS"),
    Type.Literal("COMPLETED"),
  ]),
});
export type StockCountRow = Static<typeof StockCountRowDto>;
export const StockCountDetailDto = StrictObject({
  id: Id,
  countNo: Text,
  warehouseId: Id,
  warehouse: Text,
  countDate: Text,
  notes: Type.String(),
  status: Type.Union([
    Type.Literal("DRAFT"),
    Type.Literal("IN_PROGRESS"),
    Type.Literal("COMPLETED"),
  ]),
  lines: Type.Array(StockCountLineDto),
  audit: AuditMetadataDto,
});
export type StockCountDetail = Static<typeof StockCountDetailDto>;
export const StockCountRequestDto = StrictObject({
  warehouseId: Id,
  countDate: Text,
  notes: Type.Optional(Type.String()),
  lines: Type.Array(
    StrictObject({
      itemId: Id,
      countedQuantity: Type.Union([Type.Number({ minimum: 0 }), Type.Null()]),
    }),
  ),
});
export type StockCountRequest = Static<typeof StockCountRequestDto>;
