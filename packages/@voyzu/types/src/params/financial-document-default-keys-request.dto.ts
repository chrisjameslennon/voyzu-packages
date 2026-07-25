export interface FinancialDocumentDefaultKeyDto {
  /** Financial document processor code this default belongs to. */
  documentCode: string;

  /** Financial document default slot code. */
  code: string;
}

export interface FinancialDocumentDefaultKeysRequestDto {
  /** Composite financial document default keys identifying the records to act on. */
  keys: FinancialDocumentDefaultKeyDto[];
}
