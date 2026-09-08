import Type from "typebox";

const PositiveId = Type.Integer({ minimum: 1 });
const BusinessCode = Type.String({ pattern: "^[A-Z0-9][A-Z0-9_-]*$" });
const NonBlankText = Type.String({ pattern: "\\S" });

// ERP Core owns the interface; neither peer imports the other's types or services.
export const inventoryFinanceCapability = {
  processInventoryMovement: {
    input: Type.Object({
      organizationId: PositiveId,
      movement: Type.Object({
        inventoryFinancialActivityId: PositiveId,
        inventoryTransactionLineId: PositiveId,
        inventoryDocumentCode: BusinessCode,
        inventoryDocumentType: Type.Union([
          Type.Literal("RECEIPT"), Type.Literal("ISSUE"), Type.Literal("ADJUSTMENT"),
        ]),
        itemId: PositiveId,
        itemCode: BusinessCode,
        itemName: NonBlankText,
        quantityChange: Type.Number(),
        reasonCode: NonBlankText,
        activityDate: Type.String({ format: "date-time" }),
      }, { additionalProperties: false }),
    }, { additionalProperties: false }),
    output: Type.Object({
      financeInventoryActivityId: PositiveId,
      // RECEIVED includes movements waiting for a matched financial document.
      processingStatus: Type.Union([Type.Literal("RECEIVED"), Type.Literal("PROCESSED")]),
    }, { additionalProperties: false }),
    transactional: true,
  },
} as const;
