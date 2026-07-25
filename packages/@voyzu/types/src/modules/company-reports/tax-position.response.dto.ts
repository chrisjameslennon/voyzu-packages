export interface TaxPositionAuthorityColumnDto {
  taxAuthorityCode: string;
  taxAuthorityName: string;
}

export interface TaxPositionLineDto {
  key: "OUTPUT_TAX_PAYABLE" | "INPUT_TAX_RECEIVABLE";
  label: string;
  amountsByAuthority: Record<string, number>;
  total: number;
}

export interface TaxPositionResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  asAtDate: string;
  authorityColumns: TaxPositionAuthorityColumnDto[];
  lines: TaxPositionLineDto[];
  netTaxPosition: number;
  trialBalanceReconciled: boolean;
}
