import type { AuditMetadataDto } from "@voyzu/core/types/modules/core";
import type { EntryType } from "@voyzu/core/types/modules/core";
export interface ArSubledgerControlAccountBalanceDto {
  controlAccountCode: string;
  controlAccountName: string;
  glAccountCode: string;
  glAccountName: string;
  balance: number;
}

export interface ArSubledgerEntryResponseDto {
  id: number;
  code: string;
  journalHeaderId: number;
  journalCode: string;
  hasBankCashDetails: boolean;
  taxLedgerEntryCode: string | null;
  postingDate: string;
  documentDate: string;
  baseCurrencyCode: string;
  entryType: EntryType;
  baseCurrencyAmount: number;
  memo: string | null;
  status: string;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  description: string;
  appliedToDocumentId: string | null;
  counterpartyCode: string;
  counterpartyName: string;
  controlAccountCode: string;
  controlAccountName: string;
  glAccountCode: string;
  glAccountName: string;
  /** Derived per-invoice payment state. Only populated for AR invoice rows
   * (document_type_code='AR_INVOICE', entry_type='DEBIT'); null otherwise. */
  paymentStatus: "UNPAID" | "PART_PAID" | "SETTLED" | null;
  /** Sum of CREDIT applications posted against this invoice. Populated for AR invoice rows; null otherwise. */
  appliedAmount: number | null;
  /** Sum of AR receipt/application amounts applied to this invoice. Populated for AR invoice rows; null otherwise. */
  paymentAppliedAmount: number | null;
  /** Sum of non-payment AR credits/write-offs/cancellations applied to this invoice. Populated for AR invoice rows; null otherwise. */
  otherCreditAppliedAmount: number | null;
  /** Remaining open invoice balance. Populated for AR invoice rows; null otherwise. */
  openBalance: number | null;
  /** Derived from AR subledger lines; not stored on the header. */
  controlAccountBalances?: ArSubledgerControlAccountBalanceDto[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
  documentSnapshot?: Record<string, unknown>;
  detailedDocumentSnapshot?: Record<string, unknown>;
}
