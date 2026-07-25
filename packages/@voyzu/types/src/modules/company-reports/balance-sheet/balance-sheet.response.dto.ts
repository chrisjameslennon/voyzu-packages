export type BalanceSheetSection = "ASSET" | "LIABILITY" | "EQUITY";

export interface BalanceSheetLineDto {
  glAccountId: number | null;
  glAccountCode: string | null;
  glAccountName: string;
  section: BalanceSheetSection;
  amount: number;
  categoryCode?: string | null;
  categoryName?: string | null;
  categorySequence?: number | null;
}

export interface BalanceSheetResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  asAtDate: string | null;
  assetLines: BalanceSheetLineDto[];
  liabilityLines: BalanceSheetLineDto[];
  equityLines: BalanceSheetLineDto[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
}
