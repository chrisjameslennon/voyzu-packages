import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "@voyzu/finance/types/modules/core";
import { BusinessCode, CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const FinancialIntegrityDocumentTypeDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
});
export type FinancialIntegrityDocumentTypeDto = Type.Static<typeof FinancialIntegrityDocumentTypeDto>;

export const FinancialIntegrityLedgerLineDto = StrictObject({
  glAccountId: PositiveId,
  glAccountCode: BusinessCode,
  glAccountName: NonBlankText,
  accountType: AccountType,
  openingBalance: Type.Number(),
  periodDebits: Type.Number(),
  periodCredits: Type.Number(),
  netMovement: Type.Number(),
  closingBalance: Type.Number(),
});
export type FinancialIntegrityLedgerLineDto = Type.Static<typeof FinancialIntegrityLedgerLineDto>;

export const FinancialIntegrityJournalLineDto = StrictObject({
  id: PositiveId,
  lineNumber: PositiveId,
  glAccountId: Type.Union([PositiveId, Type.Null()]),
  glAccountCode: Type.Union([BusinessCode, Type.Null()]),
  glAccountName: Type.Union([NonBlankText, Type.Null()]),
  debit: Type.Number(),
  credit: Type.Number(),
  amount: Type.Number(),
  dimensions: Type.Record(Type.String(), Type.String()),
  taxCode: Type.Union([BusinessCode, Type.Null()]),
  taxAmount: Type.Union([Type.Number(), Type.Null()]),
  counterparty: Type.Union([Type.String(), Type.Null()]),
  memo: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
});
export type FinancialIntegrityJournalLineDto = Type.Static<typeof FinancialIntegrityJournalLineDto>;

export const FinancialIntegrityJournalHeaderDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  postingDate: IsoDate,
  sourceDocumentTypeCode: BusinessCode,
  sourceDocumentId: Type.String(),
  financialPeriodCode: BusinessCode,
  currencyCode: CurrencyCode,
  status: Type.String(),
  debitTotal: Type.Number(),
  creditTotal: Type.Number(),
  difference: Type.Number(),
  balancesToZero: Type.Boolean(),
  lines: Type.Array(FinancialIntegrityJournalLineDto),
});
export type FinancialIntegrityJournalHeaderDto = Type.Static<typeof FinancialIntegrityJournalHeaderDto>;

export const FinancialIntegritySourceFieldDto = StrictObject({
  label: Type.String(),
  value: Type.String(),
});
export type FinancialIntegritySourceFieldDto = Type.Static<typeof FinancialIntegritySourceFieldDto>;

export const FinancialIntegritySourceLineDto = StrictObject({
  lineNumber: PositiveId,
  fields: Type.Array(FinancialIntegritySourceFieldDto),
});
export type FinancialIntegritySourceLineDto = Type.Static<typeof FinancialIntegritySourceLineDto>;

export const FinancialIntegritySubledgerLineDto = StrictObject({
  lineNumber: PositiveId,
  fields: Type.Array(FinancialIntegritySourceFieldDto),
});
export type FinancialIntegritySubledgerLineDto = Type.Static<typeof FinancialIntegritySubledgerLineDto>;

export const FinancialIntegritySubledgerEntryDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  ledger: Type.Union([Type.Literal("AR"), Type.Literal("AP"), Type.Literal("TAX")]),
  documentTypeCode: BusinessCode,
  documentId: Type.String(),
  postingDate: IsoDate,
  currencyCode: CurrencyCode,
  memo: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  status: Type.String(),
  lines: Type.Array(FinancialIntegritySubledgerLineDto),
});
export type FinancialIntegritySubledgerEntryDto = Type.Static<typeof FinancialIntegritySubledgerEntryDto>;

export const FinancialIntegrityInventoryLedgerLineDto = StrictObject({
  lineNumber: PositiveId,
  movement: Type.String(),
  itemCode: BusinessCode,
  itemName: NonBlankText,
  qtyDelta: Type.Number(),
  unitValueSupplied: Type.Union([Type.Number(), Type.Null()]),
  bookValueDelta: Type.Number(),
  qtyBalance: Type.Number(),
  avgUnitValue: Type.Number(),
  bookValueBalance: Type.Number(),
});
export type FinancialIntegrityInventoryLedgerLineDto = Type.Static<typeof FinancialIntegrityInventoryLedgerLineDto>;

export const FinancialIntegrityLinkedInventoryDocumentDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  documentTypeCode: BusinessCode,
  documentId: Type.String(),
  postingDate: IsoDate,
  sourceDocumentTypeCode: BusinessCode,
  sourceDocumentId: Type.Union([Type.String(), Type.Null()]),
  currencyCode: CurrencyCode,
  memo: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  status: Type.String(),
  sourceTotals: Type.Array(FinancialIntegritySourceFieldDto),
  sourceLines: Type.Array(FinancialIntegritySourceLineDto),
  lines: Type.Array(FinancialIntegrityInventoryLedgerLineDto),
});
export type FinancialIntegrityLinkedInventoryDocumentDto = Type.Static<typeof FinancialIntegrityLinkedInventoryDocumentDto>;

export const FinancialIntegrityDocumentDto = Type.Cyclic({
  FinancialIntegrityDocument: StrictObject({
  key: Type.String(),
  documentTypeCode: BusinessCode,
  documentTypeName: NonBlankText,
  accountingFormula: Type.Union([Type.String(), Type.Null()]),
  documentId: Type.String(),
  postingDate: IsoDate,
  sourceDocumentTypeCode: Type.Union([BusinessCode, Type.Null()]),
  sourceDocumentId: Type.Union([Type.String(), Type.Null()]),
  counterparty: Type.Union([Type.String(), Type.Null()]),
  currencyCode: Type.Union([CurrencyCode, Type.Null()]),
  memo: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  status: Type.Union([Type.String(), Type.Null()]),
  sourceDocumentJson: Type.Record(Type.String(), Type.Unknown()),
  sourceTotals: Type.Array(FinancialIntegritySourceFieldDto),
  sourceLines: Type.Array(FinancialIntegritySourceLineDto),
  journalHeaders: Type.Array(FinancialIntegrityJournalHeaderDto),
  subledgerEntries: Type.Array(FinancialIntegritySubledgerEntryDto),
  linkedInventoryDocuments: Type.Array(FinancialIntegrityLinkedInventoryDocumentDto),
    downstreamDocuments: Type.Array(Type.Ref("FinancialIntegrityDocument")),
  }),
}, "FinancialIntegrityDocument");
export type FinancialIntegrityDocumentDto = Type.Static<typeof FinancialIntegrityDocumentDto>;

export const FinancialIntegrityIndicatorDto = StrictObject({
  code: BusinessCode,
  label: Type.String(),
  passed: Type.Boolean(),
  detail: Type.String(),
});
export type FinancialIntegrityIndicatorDto = Type.Static<typeof FinancialIntegrityIndicatorDto>;

export const FinancialIntegrityTotalsDto = StrictObject({
  totalReportJournalDebits: Type.Number(),
  totalReportJournalCredits: Type.Number(),
  difference: Type.Number(),
});
export type FinancialIntegrityTotalsDto = Type.Static<typeof FinancialIntegrityTotalsDto>;

export const FinancialIntegrityLedgerReconciliationDto = StrictObject({
  ledgerSummaryPeriodDebits: Type.Number(),
  journalLinePeriodDebits: Type.Number(),
  debitDifference: Type.Number(),
  ledgerSummaryPeriodCredits: Type.Number(),
  journalLinePeriodCredits: Type.Number(),
  creditDifference: Type.Number(),
  ledgerSummaryNetMovement: Type.Number(),
  journalLineNetMovement: Type.Number(),
  netMovementDifference: Type.Number(),
  passed: Type.Boolean(),
});
export type FinancialIntegrityLedgerReconciliationDto = Type.Static<typeof FinancialIntegrityLedgerReconciliationDto>;

export const FinancialIntegrityTrialBalanceReconciliationDto = StrictObject({
  trialBalancePeriodDebits: Type.Number(),
  ledgerSummaryPeriodDebits: Type.Number(),
  debitDifference: Type.Number(),
  trialBalancePeriodCredits: Type.Number(),
  ledgerSummaryPeriodCredits: Type.Number(),
  creditDifference: Type.Number(),
  trialBalanceNetMovement: Type.Number(),
  ledgerSummaryNetMovement: Type.Number(),
  netMovementDifference: Type.Number(),
  mismatchedAccountCount: Type.Number(),
  passed: Type.Boolean(),
});
export type FinancialIntegrityTrialBalanceReconciliationDto = Type.Static<typeof FinancialIntegrityTrialBalanceReconciliationDto>;

export const FinancialIntegrityResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  fromDate: IsoDate,
  toDate: IsoDate,
  documentTypeCode: Type.Union([BusinessCode, Type.Null()]),
  ledgerLines: Type.Array(FinancialIntegrityLedgerLineDto),
  documentTypes: Type.Array(FinancialIntegrityDocumentTypeDto),
  documents: Type.Array(FinancialIntegrityDocumentDto),
  totals: FinancialIntegrityTotalsDto,
  trialBalanceLines: Type.Array(FinancialIntegrityLedgerLineDto),
  ledgerReconciliation: FinancialIntegrityLedgerReconciliationDto,
  trialBalanceReconciliation: FinancialIntegrityTrialBalanceReconciliationDto,
  indicators: Type.Array(FinancialIntegrityIndicatorDto),
});
export type FinancialIntegrityResponseDto = Type.Static<typeof FinancialIntegrityResponseDto>;
