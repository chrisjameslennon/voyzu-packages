export interface ArCounterpartySummaryResponseDto {
  counterpartyCode: string;
  counterpartyName: string;
  /** Sum of open balances across this counterparty's AR invoices
   * (invoice amount minus CREDIT applications posted against the invoice). */
  openInvoicesAmount: number;
  /** Sum of receipt amounts that have not yet been drawn down by applications
   * (receipt amount minus DEBIT applications posted against the receipt). */
  unappliedReceiptsAmount: number;
  /** openInvoicesAmount − unappliedReceiptsAmount. Positive = owed by counterparty. */
  netBalance: number;
}
