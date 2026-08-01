import type { EntryType } from "@voyzu/core/types/modules/core";
import type { CompanyResponseDto } from "../companies/company.response.dto";

export interface ApCounterpartyStatementApplicationDto {
  code: string;
  postingDate: string;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  documentRef: string;
  appliedToDocumentId: string | null;
  memo: string | null;
  description: string;
  entryType: EntryType;
  debit: number;
  credit: number;
}

export interface ApCounterpartyStatementGroupDto {
  code: string;
  postingDate: string;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  documentRef: string;
  appliedToDocumentId: string | null;
  memo: string | null;
  description: string;
  entryType: EntryType;
  debit: number;
  credit: number;
  /** Net of the root document amount and all applications. Negative when overpaid. */
  openBalance: number;
  applications: ApCounterpartyStatementApplicationDto[];
}

export interface ApCounterpartyStatementResponseDto {
  company: CompanyResponseDto;
  counterpartyCode: string;
  counterpartyName: string;
  baseCurrencyCode: string;
  /** ISO date (YYYY-MM-DD) the statement was generated. */
  asAtDate: string;
  totalDebit: number;
  totalCredit: number;
  /** totalDebit − totalCredit (positive = owed by counterparty). */
  totalOwing: number;
  groups: ApCounterpartyStatementGroupDto[];
}

