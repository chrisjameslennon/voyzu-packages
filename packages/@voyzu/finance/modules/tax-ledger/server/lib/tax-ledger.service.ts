import type { TaxSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/tax-ledger";
import { getDb } from "@voyzu/capability/db";
import { TaxLedgerRepo } from "../db/tax-ledger.repo";

function toEntryDto(row: Awaited<ReturnType<TaxLedgerRepo["listEntries"]>>[number]): TaxSubledgerEntryResponseDto {
  const dto: TaxSubledgerEntryResponseDto = {
    id: row.id,
    code: row.code,
    journalHeaderId: row.journal_header_id,
    journalCode: row.journal_code,
    hasBankCashDetails: row.has_bank_cash_details,
    arSubledgerEntryCode: row.ar_subledger_entry_code,
    apSubledgerEntryCode: row.ap_subledger_entry_code,
    postingDate: row.posting_date,
    documentDate: row.document_date,
    baseCurrencyCode: row.base_currency_code,
    entryType: row.entry_type,
    baseCurrencyAmount: row.base_currency_amount,
    status: row.status,
    documentTypeCode: row.document_type_code,
    documentTypeLabel: row.document_type_label,
    documentId: row.document_id,
    description: row.description,
    taxRuleCode: row.tax_rule_code,
    taxControlAccountCode: row.tax_movement_type_code,
    taxControlAccountName: row.tax_movement_type_name,
    taxAuthorityCode: row.tax_authority_code,
    taxAuthorityName: row.tax_authority_name,
    schemeLabel: row.scheme_label,
    taxRate: row.tax_rate,
    taxLines: row.tax_lines_json,
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

export async function getTaxSubledgerEntry(companyId: number, code: string): Promise<TaxSubledgerEntryResponseDto | null> {
  const row = await new TaxLedgerRepo(getDb()).getEntry(companyId, code);
  return row ? toEntryDto(row) : null;
}

export async function listTaxSubledgerEntries(companyId: number): Promise<TaxSubledgerEntryResponseDto[]> {
  const rows = await new TaxLedgerRepo(getDb()).listEntries(companyId);
  return rows.map(toEntryDto);
}
