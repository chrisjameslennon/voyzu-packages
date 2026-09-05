export enum InventoryProcessingRuleAction {
  WaitForMatchedDocument = "WAIT_FOR_MATCHED_DOCUMENT",
  CreateInventoryReceiptJournal = "CREATE_INVENTORY_RECEIPT_JOURNAL",
  CreateInventoryIssueJournal = "CREATE_INVENTORY_ISSUE_JOURNAL",
  CreateInventoryAdjustmentJournal = "CREATE_INVENTORY_ADJUSTMENT_JOURNAL",
}

export type InventoryProcessingRuleDocumentType = "RECEIPT" | "ISSUE" | "ADJUSTMENT";

export enum InventoryProcessingRuleDirection {
  Increase = "INCREASE",
  Decrease = "DECREASE",
}

export const INVENTORY_PROCESSING_RULE_ACTIONS_BY_DOCUMENT_TYPE = {
  RECEIPT: [
    InventoryProcessingRuleAction.WaitForMatchedDocument,
    InventoryProcessingRuleAction.CreateInventoryReceiptJournal,
  ],
  ISSUE: [
    InventoryProcessingRuleAction.WaitForMatchedDocument,
    InventoryProcessingRuleAction.CreateInventoryIssueJournal,
  ],
  ADJUSTMENT: [
    InventoryProcessingRuleAction.WaitForMatchedDocument,
    InventoryProcessingRuleAction.CreateInventoryAdjustmentJournal,
  ],
} as const satisfies Record<InventoryProcessingRuleDocumentType, readonly InventoryProcessingRuleAction[]>;

export function inventoryProcessingRuleActionsFor(
  documentType: InventoryProcessingRuleDocumentType,
): readonly InventoryProcessingRuleAction[] {
  return INVENTORY_PROCESSING_RULE_ACTIONS_BY_DOCUMENT_TYPE[documentType];
}

export function isInventoryProcessingRuleActionAllowed(
  documentType: InventoryProcessingRuleDocumentType,
  action: InventoryProcessingRuleAction,
): boolean {
  return (inventoryProcessingRuleActionsFor(documentType) as readonly InventoryProcessingRuleAction[]).includes(action);
}
