import type { DrCr } from "@voyzu/core/types/modules/core";
export interface BankCashMovementLineDto {
  id: string;
  journalId: number;
  journalCode: string;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  postingDate: string;
  documentDate: string;
  bankCashCode: string;
  bankCashType: string;
  bankCashGlAccountCode: string;
  bankCashGlAccountName: string;
  txId: string | null;
  txCode: string | null;
  txRef: string | null;
  txDetails: string | null;
  paymentRef: string | null;
  drCr: DrCr;
  amount: number;
}

export interface BankCashMovementResponseDto {
  companyId: number;
  companyName: string;
  baseCurrencyCode: string;
  fromDate: string;
  toDate: string;
  bankCashFilter: {
    code: string | null;
    label: string;
  };
  lines: BankCashMovementLineDto[];
  trialBalanceReconciled: boolean;
}
