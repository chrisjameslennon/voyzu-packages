import type {
  JournalLineDimensionResponseDto,
  JournalLineResponseDto,
  JournalResponseDto,
  JournalStatus,
} from "@voyzu-modules/core/types/modules/journals";
import type { DrCr } from "@voyzu/types/modules/core";

import type { JournalHeaderRow, JournalLineDimensionRow, JournalLineRow } from "../db/journal.row.types";

export function toLineDimensionDto(row: JournalLineDimensionRow): JournalLineDimensionResponseDto {
  return {
    id: row.id,
    journalLineId: row.journal_line_id,
    dimensionId: row.dimension_id,
    dimensionValueId: row.dimension_value_id,
    dimensionCode: row.dimension_code,
    dimensionName: row.dimension_name,
    dimensionValueName: row.dimension_value_name,
  };
}

export function toLineDto(row: JournalLineRow, dimensions?: JournalLineDimensionRow[]): JournalLineResponseDto {
  return {
    id: row.id,
    journalHeaderId: row.journal_header_id,
    lineNumber: row.line_number,
    glAccountId: row.gl_account_id,
    glAccountCode: row.gl_account_code,
    glAccountName: row.gl_account_name,
    sourceLedger: row.source_ledger,
    sourceControlAccount: row.source_control_account,
    description: row.description,
    memo: row.memo,
    drCr: row.dr_cr as DrCr,
    baseCurrencyAmount: row.base_currency_amount,
    ...(dimensions !== undefined && { dimensions: dimensions.map(toLineDimensionDto) }),
  };
}

export function toDto(
  row: JournalHeaderRow,
  lines?: JournalLineRow[],
  lineDimensionsMap?: Map<number, JournalLineDimensionRow[]>,
): JournalResponseDto {
  const lineDtos = lines?.map((line) => toLineDto(line, lineDimensionsMap?.get(line.id)));
  const totalDr = row.total_debit_base_amount
    ?? lineDtos?.filter((line) => line.drCr === "DR").reduce((sum, line) => sum + line.baseCurrencyAmount, 0)
    ?? 0;
  const totalCr = row.total_credit_base_amount
    ?? lineDtos?.filter((line) => line.drCr === "CR").reduce((sum, line) => sum + line.baseCurrencyAmount, 0)
    ?? 0;

  return {
    id: row.id,
    code: row.code,
    arSubledgerEntryCode: row.ar_subledger_entry_code,
    apSubledgerEntryCode: row.ap_subledger_entry_code,
    taxLedgerEntryCode: row.tax_ledger_entry_code,
    companyId: row.company_id,
    companyCode: row.company_code,
    companyName: row.company_name,
    documentTypeCode: row.document_type_code,
    documentTypeLabel: row.document_type_label,
    documentId: row.document_id,
    description: row.description,
    documentSnapshot: row.document_snapshot_json,
    detailedDocumentSnapshot: row.detailed_document_snapshot_json,
    postingEngineCode: row.posting_engine_code,
    documentDate: row.document_date,
    postingDate: row.posting_date,
    financialYearId: row.financial_year_id,
    financialYearCode: row.financial_year_code,
    financialPeriodId: row.financial_period_id,
    financialPeriodCode: row.financial_period_code,
    baseCurrencyCode: row.base_currency_code,
    numberLines: lines?.length ?? row.number_lines,
    totalDr,
    totalCr,
    memo: row.memo,
    status: row.status as JournalStatus,
    reversalOfJournalId: row.reversal_of_journal_id,
    reversalOfJournalCode: row.reversal_of_journal_code,
    reversedByJournalId: row.reversed_by_journal_id,
    reversedByJournalCode: row.reversed_by_journal_code,
    bankCashDetails: row.bank_cash_code ? {
      id: row.bank_cash_account_id,
      code: row.bank_cash_code,
      type: row.bank_cash_type,
      glAccountId: row.bank_cash_gl_account_id,
      glAccountCode: row.bank_cash_gl_account_code,
      glAccountName: row.bank_cash_gl_account_name,
      bankName: row.bank_cash_bank_name,
      bankBranchName: row.bank_cash_bank_branch_name,
      bankAccountIdentifier: row.bank_cash_account_identifier,
      cashAccountIdentifier: row.bank_cash_cash_account_identifier,
      txId: row.bank_cash_tx_id,
      txCode: row.bank_cash_tx_code,
      txRef: row.bank_cash_tx_ref,
      txDetails: row.bank_cash_tx_details,
      paymentRef: row.bank_cash_payment_ref,
    } : null,
    ...(lineDtos !== undefined && { lines: lineDtos }),
    audit: {
      created: {
        date: row.creation_date,
        actorType: row.creation_actor_type,
        userId: row.creation_user_id,
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: row.updated_date,
        actorType: row.updated_actor_type,
        userId: row.updated_user_id,
        mutationId: row.updated_mutation_id,
      },
    },
  };
}
