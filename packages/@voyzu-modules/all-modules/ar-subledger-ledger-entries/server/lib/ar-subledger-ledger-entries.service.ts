import type { ArSubledgerEntryResponseDto } from "@voyzu-modules/types/modules/ar-subledger";
import type {
  ArLedgerEntryDocumentReportApplicationDto,
  ArLedgerEntryDocumentReportLineDto,
  ArLedgerEntryDocumentReportResponseDto,
  ArLedgerEntryDocumentReportTotalDto,
} from "@voyzu-modules/types/modules/ar-subledger";
import type { CompanyResponseDto } from "@voyzu-modules/types/modules/companies";
import { getDb } from "@voyzu/capability/db";
import { getAuditActors } from "@voyzu-modules/all-modules/common/server";

import { ArSubledgerRepo } from "../db/ar-subledger-ledger-entries.repo";

export async function getArSubledgerEntry(companyId: number, code: string): Promise<ArSubledgerEntryResponseDto | null> {
  const row = await new ArSubledgerRepo(getDb()).getEntry(companyId, code);
  if (!row) return null;
  const auditActors = await getAuditActors(row);
  return {
    id: row.id,
    code: row.code,
    journalHeaderId: row.journal_header_id,
    journalCode: row.journal_code,
    hasBankCashDetails: row.has_bank_cash_details,
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
        actorType: row.creation_actor_type,
        userId: row.creation_user_id,
        user: auditActors.creationUser,
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: row.updated_date,
        actorType: row.updated_actor_type,
        userId: row.updated_user_id,
        user: auditActors.updatedUser,
        mutationId: row.updated_mutation_id,
      },
    },
    documentSnapshot: row.document_snapshot_json,
    detailedDocumentSnapshot: row.detailed_document_snapshot_json,
  };
}

export async function listArSubledgerEntries(companyId: number): Promise<ArSubledgerEntryResponseDto[]> {
  const rows = await new ArSubledgerRepo(getDb()).listEntries(companyId);
  return Promise.all(rows.map(async (r) => {
    const auditActors = await getAuditActors(r);
    return {
      id: r.id,
      code: r.code,
      journalHeaderId: r.journal_header_id,
      journalCode: r.journal_code,
      hasBankCashDetails: r.has_bank_cash_details,
      taxLedgerEntryCode: r.tax_ledger_entry_code,
      postingDate: r.posting_date,
      documentDate: r.document_date,
      baseCurrencyCode: r.base_currency_code,
      entryType: r.entry_type,
      baseCurrencyAmount: r.base_currency_amount,
      memo: r.memo,
      status: r.status,
      documentTypeCode: r.document_type_code,
      documentTypeLabel: r.document_type_label,
      documentId: r.document_id,
      description: r.description,
      appliedToDocumentId: r.applied_to_document_id,
      counterpartyCode: r.counterparty_code,
      counterpartyName: r.counterparty_name,
      controlAccountCode: r.control_account_code,
      controlAccountName: r.control_account_name,
      glAccountCode: r.gl_account_code,
      glAccountName: r.gl_account_name,
      paymentStatus: r.payment_status,
      appliedAmount: r.applied_amount,
      paymentAppliedAmount: r.payment_applied_amount,
      otherCreditAppliedAmount: r.other_credit_applied_amount,
      openBalance: r.open_balance,
      controlAccountBalances: r.control_account_balances_json,
      audit: {
        created: {
          date: r.creation_date,
          actorType: r.creation_actor_type,
          userId: r.creation_user_id,
          user: auditActors.creationUser,
          mutationId: r.creation_mutation_id,
        },
        updated: {
          date: r.updated_date,
          actorType: r.updated_actor_type,
          userId: r.updated_user_id,
          user: auditActors.updatedUser,
          mutationId: r.updated_mutation_id,
        },
      },
    };
  }));
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

interface ArDocumentLineRow {
  line_number: number;
  line_type: string;
  description: string;
  quantity: number | null;
  unit_amount: number | null;
  net_amount: number | null;
  tax_amount: number | null;
  gross_amount: number;
}

interface ArDocumentApplicationRow {
  target_document_id: string;
  target_document_type_label: string;
  amount: number;
}

interface ArDocumentAppliedTransactionRow {
  code: string;
  posting_date: string;
  document_date: string;
  document_type_label: string;
  document_id: string;
  amount: number;
}

async function listArDocumentLineRows(entryId: number): Promise<ArDocumentLineRow[]> {
  const { rows } = await getDb().query(
    `SELECT
       l.line_number::int AS line_number,
       l.line_type,
       l.description,
       l.quantity::float AS quantity,
       l.unit_amount::float AS unit_amount,
       l.net_amount::float AS net_amount,
       l.tax_amount::float AS tax_amount,
       l.gross_amount::float AS gross_amount
     FROM ar_subledger_entry_line l
     WHERE l.ar_subledger_entry_header_id = $1
       AND (
         l.line_type IN (
           'INVOICE_LINE',
           'INVOICE_CANCELLATION_LINE',
           'RECEIPT_ALLOCATION',
           'RECEIPT_UNAPPLIED',
           'CREDIT_NOTE_LINE',
           'OPENING_BALANCE_ITEM',
           'REFUND_APPLICATION',
           'WRITE_OFF_APPLICATION'
         )
         OR (l.line_type = 'RECEIPT_APPLICATION' AND l.control_account_code = 'AR_TRADE_RECEIVABLES')
       )
     ORDER BY l.line_number ASC, l.id ASC`,
    [entryId],
  );
  return rows as unknown as ArDocumentLineRow[];
}

function toArDocumentLines(rows: ArDocumentLineRow[]): ArLedgerEntryDocumentReportLineDto[] {
  return rows.map((line) => ({
    line: String(line.line_number),
    description: line.description,
    quantity: line.quantity,
    unitAmount: line.unit_amount,
    netAmount: line.net_amount,
    taxAmount: line.tax_amount,
    grossAmount: line.gross_amount,
  }));
}

async function listArDocumentApplications(entryId: number): Promise<ArLedgerEntryDocumentReportApplicationDto[]> {
  const { rows } = await getDb().query(
    `SELECT
       target_h.document_id AS target_document_id,
       target_jh.document_type_label AS target_document_type_label,
       SUM(l.base_currency_amount)::float AS amount
     FROM ar_subledger_entry_line l
     JOIN ar_subledger_entry_header target_h ON target_h.id = l.target_entry_header_id
     JOIN journal_header target_jh ON target_jh.id = target_h.journal_header_id
     WHERE l.ar_subledger_entry_header_id = $1
       AND l.target_entry_header_id IS NOT NULL
     GROUP BY target_h.id, target_h.document_id, target_jh.document_type_label
     ORDER BY MIN(l.line_number) ASC, MIN(l.id) ASC`,
    [entryId],
  );
  return (rows as unknown as ArDocumentApplicationRow[]).map((row) => ({
    sourceDocumentId: null,
    targetDocumentId: row.target_document_id,
    targetDocumentType: row.target_document_type_label,
    amount: row.amount,
  }));
}

async function listAppliedTransactions(entryId: number): Promise<ArLedgerEntryDocumentReportResponseDto["appliedTransactions"]> {
  const { rows } = await getDb().query(
    `SELECT DISTINCT ON (source.id, l.id)
       source.code,
       source.posting_date::text AS posting_date,
       source.document_date::text AS document_date,
       source_jh.document_type_label,
       source.document_id,
       l.base_currency_amount::float AS amount
     FROM ar_subledger_entry_line l
     JOIN ar_subledger_entry_header source ON source.id = l.ar_subledger_entry_header_id
     JOIN journal_header source_jh ON source_jh.id = source.journal_header_id
     WHERE source.id <> $1
       AND (l.target_entry_header_id = $1 OR l.source_entry_header_id = $1)
     ORDER BY source.id, l.id, source.posting_date ASC, source.code ASC`,
    [entryId],
  );
  return (rows as unknown as ArDocumentAppliedTransactionRow[]).map((row) => ({
    code: row.code,
    postingDate: row.posting_date,
    documentDate: row.document_date,
    documentTypeLabel: row.document_type_label,
    documentId: row.document_id,
    amount: row.amount,
  })).sort((a, b) => a.postingDate.localeCompare(b.postingDate) || a.code.localeCompare(b.code));
}

function documentTotals(documentTypeCode: string, lineRows: ArDocumentLineRow[]): ArLedgerEntryDocumentReportTotalDto[] {
  const lines = lineRows;
  const total = (selector: (line: ArDocumentLineRow) => number | null) =>
    roundMoney(lines.reduce((sum, line) => sum + (selector(line) ?? 0), 0));
  if (documentTypeCode === "AR_INVOICE" || documentTypeCode === "AR_INVOICE_CANCELLATION") {
    return [
      { label: "Net", amount: total((line) => line.net_amount) },
      { label: "Tax", amount: total((line) => line.tax_amount) },
      { label: "Gross", amount: total((line) => line.gross_amount) },
    ];
  }
  if (documentTypeCode === "AR_RECEIPT") {
    const receipt = total((line) => line.gross_amount);
    const applied = roundMoney(lineRows
      .filter((line) => line.line_type !== "RECEIPT_UNAPPLIED")
      .reduce((sum, line) => sum + line.gross_amount, 0));
    const unapplied = roundMoney(receipt - applied);
    const totals: ArLedgerEntryDocumentReportTotalDto[] = [
      { label: "Receipt Amount", amount: receipt },
      { label: "Applied Amount", amount: applied },
    ];
    if (Math.abs(unapplied) >= 0.005) totals.push({ label: "Unapplied Amount", amount: unapplied });
    return totals;
  }
  if (documentTypeCode === "AR_RECEIPT_APPLICATION") {
    return [
      { label: "Application Amount", amount: total((line) => line.gross_amount) },
    ];
  }
  if (documentTypeCode === "AR_OPENING_BALANCE") {
    return [
      { label: "Opening Balance", amount: total((line) => line.gross_amount) },
    ];
  }
  if (documentTypeCode === "AR_CREDIT_NOTE") {
    return [
      { label: "Credit Amount", amount: total((line) => line.gross_amount) },
    ];
  }
  if (documentTypeCode === "AR_REFUND") {
    return [
      { label: "Refund Amount", amount: total((line) => line.gross_amount) },
    ];
  }
  if (documentTypeCode === "AR_WRITE_OFF") {
    return [
      { label: "Write-off Amount", amount: total((line) => line.gross_amount) },
    ];
  }
  return [];
}

export async function getArLedgerEntryDocumentReport(
  company: CompanyResponseDto,
  entry: ArSubledgerEntryResponseDto,
): Promise<ArLedgerEntryDocumentReportResponseDto | null> {
  const [lineRows, appliedTransactions, applications] = await Promise.all([
    listArDocumentLineRows(entry.id),
    listAppliedTransactions(entry.id),
    listArDocumentApplications(entry.id),
  ]);
  const reportLineRows = lineRows.length > 0
    ? lineRows
    : [{
      line_number: 1,
      line_type: entry.documentTypeCode,
      description: entry.description,
      quantity: null,
      unit_amount: null,
      net_amount: null,
      tax_amount: null,
      gross_amount: entry.baseCurrencyAmount,
    }];
  const lines = toArDocumentLines(reportLineRows);

  return {
    company,
    documentTypeCode: entry.documentTypeCode,
    documentTypeLabel: entry.documentTypeLabel,
    documentId: entry.documentId,
    documentDate: entry.documentDate,
    postingDate: entry.postingDate,
    memo: entry.memo,
    description: entry.description,
    counterpartyCode: entry.counterpartyCode,
    counterpartyName: entry.counterpartyName,
    counterpartyCountryCode: null,
    lines,
    totals: documentTotals(entry.documentTypeCode, reportLineRows),
    appliedTransactions,
    applications,
  };
}
