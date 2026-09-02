import Type, { type Static } from "typebox";

export const STOCK_ADJUSTMENT_REASONS = [
  { code: "STOCK_VARIANCE", label: "Stock variance" },
  { code: "DAMAGED", label: "Damaged stock" },
  { code: "MISSING", label: "Missing stock" },
  { code: "FOUND", label: "Found stock" },
  { code: "DATA_CORRECTION", label: "Data correction" },
  { code: "OTHER", label: "Other" },
] as const;

export const STOCK_ISSUE_REASONS = [
  { code: "SALE", label: "Sale / customer fulfilment" },
  { code: "INTERNAL_CONSUMPTION", label: "Internal consumption" },
  { code: "WRITE_OFF_DAMAGED", label: "Write-off - damaged" },
  { code: "WRITE_OFF_OTHER", label: "Write-off - other" },
  { code: "SUPPLIER_RETURN", label: "Return to supplier" },
  { code: "SAMPLE", label: "Sample / promotional use" },
  { code: "OTHER", label: "Other" },
] as const;

export const STOCK_RECEIPT_REASONS = [
  { code: "PURCHASE", label: "Purchase / supplier receipt" },
  { code: "CUSTOMER_RETURN", label: "Customer return" },
  { code: "OPENING_STOCK", label: "Opening stock" },
  { code: "PRODUCTION", label: "Produced / manufactured stock" },
  { code: "OTHER", label: "Other" },
] as const;

export const StockAdjustmentReasonCode = Type.Union([
  Type.Literal("STOCK_VARIANCE"),
  Type.Literal("DAMAGED"),
  Type.Literal("MISSING"),
  Type.Literal("FOUND"),
  Type.Literal("DATA_CORRECTION"),
  Type.Literal("OTHER"),
]);
export type StockAdjustmentReasonCode = Static<typeof StockAdjustmentReasonCode>;

export const StockIssueReasonCode = Type.Union([
  Type.Literal("SALE"),
  Type.Literal("INTERNAL_CONSUMPTION"),
  Type.Literal("WRITE_OFF_DAMAGED"),
  Type.Literal("WRITE_OFF_OTHER"),
  Type.Literal("SUPPLIER_RETURN"),
  Type.Literal("SAMPLE"),
  Type.Literal("OTHER"),
]);
export type StockIssueReasonCode = Static<typeof StockIssueReasonCode>;

export const StockReceiptReasonCode = Type.Union([
  Type.Literal("PURCHASE"),
  Type.Literal("CUSTOMER_RETURN"),
  Type.Literal("OPENING_STOCK"),
  Type.Literal("PRODUCTION"),
  Type.Literal("OTHER"),
]);
export type StockReceiptReasonCode = Static<typeof StockReceiptReasonCode>;

export const StockReasonCode = Type.Union([
  StockAdjustmentReasonCode,
  StockIssueReasonCode,
  StockReceiptReasonCode,
]);
export type StockReasonCode = Static<typeof StockReasonCode>;
