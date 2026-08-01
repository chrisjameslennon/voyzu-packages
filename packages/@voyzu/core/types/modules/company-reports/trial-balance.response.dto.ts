import type { AccountType } from "@voyzu/core/types/modules/core";

export interface TrialBalanceLineDto {
  glAccountId: number;
  glAccountCode: string;
  glAccountName: string;
  accountType: AccountType;
  debitTotal: number;
  creditTotal: number;
}

export interface TrialBalanceResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  asAtDate: string | null;
  lines: TrialBalanceLineDto[];
  totalDebit: number;
  totalCredit: number;
}

