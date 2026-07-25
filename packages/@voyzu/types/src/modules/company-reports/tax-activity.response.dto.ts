export interface TaxActivityAuthorityColumnDto {
  taxAuthorityCode: string;
  taxAuthorityName: string;
}

export interface TaxActivityLineDto {
  key: "OUTPUT_TAX_PAYABLE" | "INPUT_TAX_RECEIVABLE" | "TAX_ADJUSTMENTS" | "TAX_PAYMENTS" | "TAX_REFUNDS";
  label: string;
  amountsByAuthority: Record<string, number>;
  total: number;
}

export interface TaxActivityResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  periodLabel: string;
  periodStartDate: string;
  periodEndDate: string;
  authorityColumns: TaxActivityAuthorityColumnDto[];
  returnLines: TaxActivityLineDto[];
  settlementLines: TaxActivityLineDto[];
  netTaxReturn: number;
  closingTaxPositionImpact: number;
  trialBalanceReconciled: boolean;
}
