import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/finance/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";
import { InventoryProcessingRuleAction, InventoryProcessingRuleDirection } from "@voyzu/finance/inventory-processing/domain";

export const InventoryProcessingDocumentTypeDto = Type.Union([
  Type.Literal("RECEIPT"),
  Type.Literal("ISSUE"),
  Type.Literal("ADJUSTMENT"),
]);
export type InventoryProcessingDocumentType = Type.Static<typeof InventoryProcessingDocumentTypeDto>;

export const InventoryProcessingStatusDto = Type.Union([
  Type.Literal("RECEIVED"),
  Type.Literal("PROCESSED"),
]);
export type InventoryProcessingStatus = Type.Static<typeof InventoryProcessingStatusDto>;

const NullableText = Type.Union([Type.String(), Type.Null()]);
const NullableId = Type.Union([PositiveId, Type.Null()]);

export const FinanceInventoryActivityDto = StrictObject({
  id: PositiveId,
  inventoryFinancialActivityId: PositiveId,
  inventoryTransactionLineId: PositiveId,
  inventoryDocumentCode: BusinessCode,
  inventoryDocumentType: InventoryProcessingDocumentTypeDto,
  itemId: PositiveId,
  itemCode: BusinessCode,
  itemName: NonBlankText,
  quantityChange: Type.Number(),
  reasonCode: NullableText,
  activityDate: Type.String({ format: "date-time" }),
  processingStatus: InventoryProcessingStatusDto,
  financeDocumentType: NullableText,
  financeDocumentId: NullableId,
  financeDocumentCode: Type.Union([BusinessCode, Type.Null()]),
  processedAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  audit: AuditMetadataDto,
});
export type FinanceInventoryActivity = Type.Static<typeof FinanceInventoryActivityDto>;

export const ProcessInventoryMovementRequestDto = StrictObject({
  inventoryFinancialActivityId: PositiveId,
  inventoryTransactionLineId: PositiveId,
  inventoryDocumentCode: BusinessCode,
  inventoryDocumentType: InventoryProcessingDocumentTypeDto,
  itemId: PositiveId,
  itemCode: BusinessCode,
  itemName: NonBlankText,
  quantityChange: Type.Number(),
  reasonCode: NonBlankText,
  activityDate: Type.String({ format: "date-time" }),
});
export type ProcessInventoryMovementRequest = Type.Static<typeof ProcessInventoryMovementRequestDto>;

export const InventoryProcessingRuleActionDto = Type.Union([
  Type.Literal(InventoryProcessingRuleAction.WaitForMatchedDocument),
  Type.Literal(InventoryProcessingRuleAction.CreateInventoryReceiptJournal),
  Type.Literal(InventoryProcessingRuleAction.CreateInventoryIssueJournal),
  Type.Literal(InventoryProcessingRuleAction.CreateInventoryAdjustmentJournal),
]);

export const InventoryProcessingRuleDirectionDto = Type.Union([
  Type.Literal(InventoryProcessingRuleDirection.Increase),
  Type.Literal(InventoryProcessingRuleDirection.Decrease),
]);

export const FinanceInventoryProcessingRuleDto = StrictObject({
  id: PositiveId,
  inventoryDocumentType: InventoryProcessingDocumentTypeDto,
  reasonCode: NonBlankText,
  direction: InventoryProcessingRuleDirectionDto,
  action: InventoryProcessingRuleActionDto,
  offsetGlAccountId: NullableId,
  offsetGlAccount: Type.Union([
    StrictObject({ code: BusinessCode, name: NonBlankText }),
    Type.Null(),
  ]),
  audit: AuditMetadataDto,
});
export type FinanceInventoryProcessingRule = Type.Static<typeof FinanceInventoryProcessingRuleDto>;

export const FinanceInventoryProcessingRulePatchDto = StrictObject({
  action: InventoryProcessingRuleActionDto,
  offsetGlAccountId: NullableId,
});
export type FinanceInventoryProcessingRulePatch = Type.Static<typeof FinanceInventoryProcessingRulePatchDto>;
