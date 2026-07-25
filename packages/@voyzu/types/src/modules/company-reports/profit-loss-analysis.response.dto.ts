import type { ProfitLossSection } from "./profit-loss.response.dto";

export interface ProfitLossDimensionSelectionDto {
  dimensionCode: string;
  dimensionName: string;
  valueNames: string[];
}

export interface ProfitLossBreakdownDto {
  dimensionCode: string;
  dimensionName: string;
  valueNames: string[];
}

export interface ProfitLossAnalysisLineDto {
  glAccountId: number;
  glAccountCode: string;
  glAccountName: string;
  section: ProfitLossSection;
  amount: number;
  amountsByColumn: Record<string, number>;
  categoryCode?: string | null;
  categoryName?: string | null;
  categorySequence?: number | null;
}

export interface ProfitLossAnalysisResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  fromDate: string;
  toDate: string;
  dimensionFilters: ProfitLossDimensionSelectionDto[];
  breakdown: ProfitLossBreakdownDto | null;
  breakdownColumns: string[];
  incomeLines: ProfitLossAnalysisLineDto[];
  expenseLines: ProfitLossAnalysisLineDto[];
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}
