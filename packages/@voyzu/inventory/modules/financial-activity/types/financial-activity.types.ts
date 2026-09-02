import Type, { type Static } from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/types/modules/core";
import { StockReasonCode } from "../../core/types";

const Id = Type.Integer({ minimum: 1 });
const Text = Type.String({ pattern: "\\S" });

export const FinancialMovementTypeDto = Type.Union([
  Type.Literal("RECEIPT"),
  Type.Literal("ISSUE"),
  Type.Literal("ADJUSTMENT"),
]);
export type FinancialMovementType = Static<typeof FinancialMovementTypeDto>;

export const FinancialActivityStatusDto = Type.Union([
  Type.Literal("AVAILABLE"),
  Type.Literal("PROCESSED"),
]);
export type FinancialActivityStatus = Static<typeof FinancialActivityStatusDto>;

export const FinancialActivitySummaryDto = StrictObject({
  id: Id,
  organizationId: Id,
  inventoryTransactionLineId: Id,
  inventoryTransactionId: Id,
  transactionCode: Text,
  transactionDate: Type.String(),
  movementType: FinancialMovementTypeDto,
  reasonCode: StockReasonCode,
  status: FinancialActivityStatusDto,
  itemId: Id,
  itemCode: Text,
  itemName: Text,
  warehouseId: Id,
  warehouseName: Text,
  quantityChange: Type.Number(),
});
export type FinancialActivitySummary = Static<typeof FinancialActivitySummaryDto>;

export const FinancialActivityDetailDto = StrictObject({
  ...FinancialActivitySummaryDto.properties,
  reference: Type.Union([Type.String(), Type.Null()]),
  notes: Type.String(),
  sourceType: Text,
  sourceCode: Type.Union([Type.String(), Type.Null()]),
  audit: AuditMetadataDto,
});
export type FinancialActivityDetail = Static<typeof FinancialActivityDetailDto>;
