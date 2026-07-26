import type { AuditMetadataDto } from "@voyzu/types/modules/core";
import type { JournalLineResponseDto } from "./journal-line.response.dto";

export type JournalStatus = "DRAFT" | "POSTED";

export interface JournalResponseDto {
  id: number;
  code: string;
  arSubledgerEntryCode: string | null;
  apSubledgerEntryCode: string | null;
  taxLedgerEntryCode: string | null;
  companyId: number;
  companyCode: string;
  companyName: string;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  description: string;
  documentSnapshot: Record<string, unknown>;
  detailedDocumentSnapshot: Record<string, unknown>;
  postingEngineCode: string;
  documentDate: string;
  postingDate: string;
  financialYearId: number;
  financialYearCode: string;
  financialPeriodId: number;
  financialPeriodCode: string;
  baseCurrencyCode: string;
  numberLines: number;
  totalDr: number;
  totalCr: number;
  memo?: string | null;
  status: JournalStatus;
  reversalOfJournalId?: number | null;
  reversalOfJournalCode?: string | null;
  reversedByJournalId?: number | null;
  reversedByJournalCode?: string | null;
  bankCashDetails?: {
    id: number | null;
    code: string | null;
    type: string | null;
    glAccountId: number | null;
    glAccountCode: string | null;
    glAccountName: string | null;
    bankName: string | null;
    bankBranchName: string | null;
    bankAccountIdentifier: string | null;
    cashAccountIdentifier: string | null;
    txId: string | null;
    txCode: string | null;
    txRef: string | null;
    txDetails: string | null;
    paymentRef: string | null;
  } | null;
  lines?: JournalLineResponseDto[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
