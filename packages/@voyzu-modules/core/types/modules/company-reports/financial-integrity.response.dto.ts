import type { AccountType } from "@voyzu-modules/core/types/modules/core";

export interface FinancialIntegrityDocumentTypeDto {
  code: string;
  name: string;
}

export interface FinancialIntegrityLedgerLineDto {
  glAccountId: number;
  glAccountCode: string;
  glAccountName: string;
  accountType: AccountType;
  openingBalance: number;
  periodDebits: number;
  periodCredits: number;
  netMovement: number;
  closingBalance: number;
}

export interface FinancialIntegrityJournalLineDto {
  id: number;
  lineNumber: number;
  glAccountId: number | null;
  glAccountCode: string | null;
  glAccountName: string | null;
  debit: number;
  credit: number;
  amount: number;
  dimensions: Record<string, string>;
  taxCode: string | null;
  taxAmount: number | null;
  counterparty: string | null;
  memo: string | null;
  description: string | null;
}

export interface FinancialIntegrityJournalHeaderDto {
  id: number;
  code: string;
  postingDate: string;
  sourceDocumentTypeCode: string;
  sourceDocumentId: string;
  financialPeriodCode: string;
  currencyCode: string;
  status: string;
  debitTotal: number;
  creditTotal: number;
  difference: number;
  balancesToZero: boolean;
  lines: FinancialIntegrityJournalLineDto[];
}

export interface FinancialIntegritySubledgerLineDto {
  lineNumber: number;
  fields: FinancialIntegritySourceFieldDto[];
}

export interface FinancialIntegritySubledgerEntryDto {
  id: number;
  code: string;
  ledger: "AR" | "AP" | "TAX";
  documentTypeCode: string;
  documentId: string;
  postingDate: string;
  currencyCode: string;
  memo: string | null;
  description: string | null;
  status: string;
  lines: FinancialIntegritySubledgerLineDto[];
}

export interface FinancialIntegrityInventoryLedgerLineDto {
  lineNumber: number;
  movement: string;
  itemCode: string;
  itemName: string;
  qtyDelta: number;
  unitValueSupplied: number | null;
  bookValueDelta: number;
  qtyBalance: number;
  avgUnitValue: number;
  bookValueBalance: number;
}

export interface FinancialIntegrityLinkedInventoryDocumentDto {
  id: number;
  code: string;
  documentTypeCode: string;
  documentId: string;
  postingDate: string;
  sourceDocumentTypeCode: string;
  sourceDocumentId: string | null;
  currencyCode: string;
  memo: string | null;
  description: string | null;
  status: string;
  sourceTotals: FinancialIntegritySourceFieldDto[];
  sourceLines: FinancialIntegritySourceLineDto[];
  lines: FinancialIntegrityInventoryLedgerLineDto[];
}

export interface FinancialIntegritySourceFieldDto {
  label: string;
  value: string;
}

export interface FinancialIntegritySourceLineDto {
  lineNumber: number;
  fields: FinancialIntegritySourceFieldDto[];
}

export interface FinancialIntegrityDocumentDto {
  key: string;
  documentTypeCode: string;
  documentTypeName: string;
  accountingFormula: string | null;
  documentId: string;
  postingDate: string;
  sourceDocumentTypeCode: string | null;
  sourceDocumentId: string | null;
  counterparty: string | null;
  currencyCode: string | null;
  memo: string | null;
  description: string | null;
  status: string | null;
  sourceDocumentJson: Record<string, unknown>;
  sourceTotals: FinancialIntegritySourceFieldDto[];
  sourceLines: FinancialIntegritySourceLineDto[];
  journalHeaders: FinancialIntegrityJournalHeaderDto[];
  subledgerEntries: FinancialIntegritySubledgerEntryDto[];
  linkedInventoryDocuments: FinancialIntegrityLinkedInventoryDocumentDto[];
  downstreamDocuments: FinancialIntegrityDocumentDto[];
}

export interface FinancialIntegrityIndicatorDto {
  code: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface FinancialIntegrityTotalsDto {
  totalReportJournalDebits: number;
  totalReportJournalCredits: number;
  difference: number;
}

export interface FinancialIntegrityLedgerReconciliationDto {
  ledgerSummaryPeriodDebits: number;
  journalLinePeriodDebits: number;
  debitDifference: number;
  ledgerSummaryPeriodCredits: number;
  journalLinePeriodCredits: number;
  creditDifference: number;
  ledgerSummaryNetMovement: number;
  journalLineNetMovement: number;
  netMovementDifference: number;
  passed: boolean;
}

export interface FinancialIntegrityTrialBalanceReconciliationDto {
  trialBalancePeriodDebits: number;
  ledgerSummaryPeriodDebits: number;
  debitDifference: number;
  trialBalancePeriodCredits: number;
  ledgerSummaryPeriodCredits: number;
  creditDifference: number;
  trialBalanceNetMovement: number;
  ledgerSummaryNetMovement: number;
  netMovementDifference: number;
  mismatchedAccountCount: number;
  passed: boolean;
}

export interface FinancialIntegrityResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  fromDate: string;
  toDate: string;
  documentTypeCode: string | null;
  ledgerLines: FinancialIntegrityLedgerLineDto[];
  documentTypes: FinancialIntegrityDocumentTypeDto[];
  documents: FinancialIntegrityDocumentDto[];
  totals: FinancialIntegrityTotalsDto;
  trialBalanceLines: FinancialIntegrityLedgerLineDto[];
  ledgerReconciliation: FinancialIntegrityLedgerReconciliationDto;
  trialBalanceReconciliation: FinancialIntegrityTrialBalanceReconciliationDto;
  indicators: FinancialIntegrityIndicatorDto[];
}
