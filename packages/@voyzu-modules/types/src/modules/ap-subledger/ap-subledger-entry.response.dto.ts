import type { AuditMetadataDto } from "@voyzu/types/modules/core";
import type { EntryType } from "@voyzu/types/modules/core";
export interface ApSubledgerControlAccountBalanceDto {
  controlAccountCode: string;
  controlAccountName: string;
  glAccountCode: string;
  glAccountName: string;
  balance: number;
}

export interface ApSubledgerEntryResponseDto {
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
  /** Derived per-bill payment state. Only populated for AP bill rows; null otherwise. */
  paymentStatus: "UNPAID" | "PART_PAID" | "SETTLED" | null;
  /** Sum of payment applications posted against this bill. Populated for AP bill rows; null otherwise. */
  appliedAmount: number | null;
  /** Sum of AP payment/application amounts applied to this bill. Populated for AP bill rows; null otherwise. */
  paymentAppliedAmount: number | null;
  /** Sum of non-payment AP credits/write-offs/cancellations applied to this bill. Populated for AP bill rows; null otherwise. */
  otherCreditAppliedAmount: number | null;
  /** Remaining open bill balance. Populated for AP bill rows; null otherwise. */
  openBalance: number | null;
  /** Derived from AP subledger lines; not stored on the header. */
  controlAccountBalances?: ApSubledgerControlAccountBalanceDto[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
  documentSnapshot?: Record<string, unknown>;
  detailedDocumentSnapshot?: Record<string, unknown>;
}

