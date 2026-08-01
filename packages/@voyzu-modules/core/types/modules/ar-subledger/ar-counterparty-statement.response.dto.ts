import type { EntryType } from "@voyzu-modules/core/types/modules/core";
import type { CompanyResponseDto } from "../companies/company.response.dto";

export interface ArCounterpartyStatementApplicationDto {
  code: string;
  postingDate: string;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  documentRef: string;
  memo: string | null;
  description: string;
  entryType: EntryType;
  debit: number;
  credit: number;
}

export interface ArCounterpartyStatementGroupDto {
  code: string;
  postingDate: string;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  documentRef: string;
  memo: string | null;
  description: string;
  entryType: EntryType;
  debit: number;
  credit: number;
  /** Net of the root document amount and all applications. Negative when overpaid. */
  openBalance: number;
  applications: ArCounterpartyStatementApplicationDto[];
}

export interface ArCounterpartyStatementResponseDto {
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
  groups: ArCounterpartyStatementGroupDto[];
}
