export type ProfitLossSection = "INCOME" | "EXPENSE";

export interface ProfitLossLineDto {
  glAccountId: number;
  glAccountCode: string;
  glAccountName: string;
  section: ProfitLossSection;
  amount: number;
  categoryCode?: string | null;
  categoryName?: string | null;
  categorySequence?: number | null;
}

export interface ProfitLossResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  fromDate: string;
  toDate: string;
  incomeLines: ProfitLossLineDto[];
  expenseLines: ProfitLossLineDto[];
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}
