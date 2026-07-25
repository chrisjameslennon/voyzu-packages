export interface TaxActivityReconciliationLineDto {
  sectionKey: "TAX_RETURN" | "SETTLEMENT";
  sectionLabel: string;
  lineKey: "OUTPUT_TAX_PAYABLE" | "INPUT_TAX_RECEIVABLE" | "TAX_ADJUSTMENTS" | "TAX_PAYMENTS" | "TAX_REFUNDS";
  lineLabel: string;
  postingDate: string;
  documentTypeCode: string;
  documentCode: string;
  documentRef: string | null;
  sourceDocumentRef: string | null;
  taxAuthorityCode: string;
  taxAuthorityName: string;
  amount: number;
}

export interface TaxActivityReconciliationAuthorityOptionDto {
  taxAuthorityCode: string;
  taxAuthorityName: string;
}

export interface TaxActivityReconciliationResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  taxAuthorityCode: string;
  taxAuthorityName: string;
  taxAuthorityOptions: TaxActivityReconciliationAuthorityOptionDto[];
  periodLabel: string;
  periodStartDate: string;
  periodEndDate: string;
  lines: TaxActivityReconciliationLineDto[];
  total: number;
  trialBalanceReconciled: boolean;
}
