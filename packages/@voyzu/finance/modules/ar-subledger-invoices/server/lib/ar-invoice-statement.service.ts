import { getDb } from "@voyzu/capability/db";
import type { ArInvoiceStatementResponseDto, ArSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/ar-subledger";
import type { CompanyResponseDto } from "@voyzu/erp-core/types/modules/companies";
import type { ArInvoiceDetailedInvoiceDto } from "@voyzu/finance/types/modules/financial-document-types";
import { listArSubledgerEntries } from "@voyzu/finance/ar-subledger-ledger-entries/server";

interface ArInvoiceDocumentLineRow {
  line_number: number;
  description: string;
  quantity: number | null;
  unit_amount: number | null;
  net_amount: number | null;
  tax_amount: number | null;
  gross_amount: number;
}

interface ArInvoiceAppliedTransactionRow {
  code: string;
  posting_date: string;
  document_date: string;
  document_type_label: string;
  document_id: string;
  amount: number;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function listInvoiceLineRows(entryId: number): Promise<ArInvoiceDocumentLineRow[]> {
  const { rows } = await getDb().query(
    `SELECT
       l.line_number::int AS line_number,
       l.description,
       l.quantity::float AS quantity,
       l.unit_amount::float AS unit_amount,
       l.net_amount::float AS net_amount,
       l.tax_amount::float AS tax_amount,
       l.gross_amount::float AS gross_amount
     FROM ar_subledger_entry_line l
     WHERE l.ar_subledger_entry_header_id = $1
       AND l.line_type = 'INVOICE_LINE'
     ORDER BY l.line_number ASC, l.id ASC`,
    [entryId],
  );
  return rows as unknown as ArInvoiceDocumentLineRow[];
}

async function listAppliedTransactions(entryId: number): Promise<ArInvoiceAppliedTransactionRow[]> {
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
  return (rows as unknown as ArInvoiceAppliedTransactionRow[])
    .sort((a, b) => a.posting_date.localeCompare(b.posting_date) || a.code.localeCompare(b.code));
}

async function buildInvoice(company: CompanyResponseDto, entry: ArSubledgerEntryResponseDto): Promise<ArInvoiceDetailedInvoiceDto> {
  const lines = await listInvoiceLineRows(entry.id);
  const net = roundMoney(lines.reduce((sum, line) => sum + (line.net_amount ?? 0), 0));
  const tax = roundMoney(lines.reduce((sum, line) => sum + (line.tax_amount ?? 0), 0));
  const gross = roundMoney(lines.reduce((sum, line) => sum + line.gross_amount, 0));

  return {
    company: {
      code: company.code,
      base_currency_code: company.baseCurrencyCode,
    },
    ar_counterparty: {
      code: entry.counterpartyCode,
      name: entry.counterpartyName,
      status: "ACTIVE",
      country_code: "",
      tax_region_or_province: null,
    },
    document_id: entry.documentId,
    document_memo: entry.memo,
    generated_description: entry.description,
    invoice_date: entry.documentDate,
    posting_date: entry.postingDate,
    lines: lines.map((line) => ({
      line_id: line.line_number,
      line_description: line.description,
      quantity: line.quantity,
      net_unit_price: line.unit_amount,
      revenue_posting_code: "",
      inventory_item_code: null,
      tax_rule: "",
      raw_net_line_total: line.net_amount ?? 0,
      net_line_total: line.net_amount ?? 0,
      tax_components: [],
      tax_amount: line.tax_amount ?? 0,
      gross_line_total: line.gross_amount,
      dimensions: {},
    })),
    net_amount: net,
    tax_amount: tax,
    gross_amount: gross,
  };
}

async function getArInvoiceStatementUnchecked(company: CompanyResponseDto, documentId: string): Promise<ArInvoiceStatementResponseDto | null> {
  const entries = await listArSubledgerEntries(company.id);
  const invoiceEntry = entries.find((entry) => entry.documentTypeCode === "AR_INVOICE" && entry.documentId === documentId && entry.entryType === "DEBIT");
  if (!invoiceEntry) return null;

  const appliedRows = await listAppliedTransactions(invoiceEntry.id);
  const transactions = appliedRows.map((row) => {
    const source = entries.find((candidate) => candidate.code === row.code);
    return {
      code: row.code,
      journalCode: source?.journalCode ?? row.code,
      postingDate: row.posting_date,
      documentDate: row.document_date,
      documentTypeCode: source?.documentTypeCode ?? "",
      documentTypeLabel: row.document_type_label,
      documentId: row.document_id,
      documentRef: row.document_id,
      memo: source?.memo ?? null,
      amount: row.amount,
    };
  });
  const invoiceAmount = invoiceEntry.baseCurrencyAmount;
  const appliedAmount = roundMoney(transactions.reduce((sum, transaction) => sum + transaction.amount, 0));

  return {
    company,
    invoiceEntryCode: invoiceEntry.code,
    invoice: await buildInvoice(company, invoiceEntry),
    counterpartyCode: invoiceEntry.counterpartyCode,
    counterpartyName: invoiceEntry.counterpartyName,
    invoiceAmount,
    appliedAmount,
    openBalance: roundMoney(invoiceAmount - appliedAmount),
    transactions,
  };
}

export const getArInvoiceStatement = getArInvoiceStatementUnchecked;
