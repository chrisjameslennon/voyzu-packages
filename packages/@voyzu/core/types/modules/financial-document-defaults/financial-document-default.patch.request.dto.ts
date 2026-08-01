export interface FinancialDocumentDefaultPatchRequestDto {
  /** Unique numeric identifier of the GL account to link to this posting code. */
  glAccountId?: number;
  /** Unique numeric identifier of the Bank / Cash control account to link to this posting code. */
  bankCashControlAccountId?: number;
}
