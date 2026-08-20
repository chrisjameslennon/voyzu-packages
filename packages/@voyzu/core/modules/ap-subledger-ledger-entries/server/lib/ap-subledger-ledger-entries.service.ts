import type { ApSubledgerEntryResponseDto } from "@voyzu/core/types/modules/ap-subledger";
import { getDb } from "@voyzu/capability/db";

import { ApSubledgerRepo } from "../db/ap-subledger-ledger-entries.repo";

function repo(): ApSubledgerRepo {
  return new ApSubledgerRepo(getDb());
}

function toEntryDto(row: Awaited<ReturnType<ApSubledgerRepo["listEntries"]>>[number]): ApSubledgerEntryResponseDto {
  const dto: ApSubledgerEntryResponseDto = {
    id: row.id,
    code: row.code,
    journalHeaderId: row.journal_header_id,
    journalCode: row.journal_code,
    hasBankCashDetails: row.has_bank_cash_details,
    bankCashCode: row.bank_cash_code,
    taxLedgerEntryCode: row.tax_ledger_entry_code,
    postingDate: row.posting_date,
    documentDate: row.document_date,
    baseCurrencyCode: row.base_currency_code,
    entryType: row.entry_type,
    baseCurrencyAmount: row.base_currency_amount,
    memo: row.memo,
    status: row.status,
    documentTypeCode: row.document_type_code,
    documentTypeLabel: row.document_type_label,
    documentId: row.document_id,
    description: row.description,
    appliedToDocumentId: row.applied_to_document_id,
    counterpartyCode: row.counterparty_code,
    counterpartyName: row.counterparty_name,
    controlAccountCode: row.control_account_code,
    controlAccountName: row.control_account_name,
    glAccountCode: row.gl_account_code,
    glAccountName: row.gl_account_name,
    paymentStatus: row.payment_status,
    appliedAmount: row.applied_amount,
    paymentAppliedAmount: row.payment_applied_amount,
    otherCreditAppliedAmount: row.other_credit_applied_amount,
    openBalance: row.open_balance,
    controlAccountBalances: row.control_account_balances_json,
    audit: {
      created: {
        date: row.creation_date,
      },
      updated: {
        date: row.updated_date,
      },
    },
    documentSnapshot: row.document_snapshot_json,
    detailedDocumentSnapshot: row.detailed_document_snapshot_json,
  };
  return dto;
}

export async function listApSubledgerEntries(companyId: number): Promise<ApSubledgerEntryResponseDto[]> {
  const rows = await repo().listEntries(companyId);
  return rows.map(toEntryDto);
}

export async function getApSubledgerEntry(companyId: number, code: string): Promise<ApSubledgerEntryResponseDto | null> {
  const row = await repo().getEntry(companyId, code);
  return row ? toEntryDto(row) : null;
}
