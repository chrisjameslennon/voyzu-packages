export interface ApCounterpartySummaryResponseDto {
  counterpartyCode: string;
  counterpartyName: string;
  openBillsAmount: number;
  unappliedPaymentsAmount: number;
  netBalance: number;
}
