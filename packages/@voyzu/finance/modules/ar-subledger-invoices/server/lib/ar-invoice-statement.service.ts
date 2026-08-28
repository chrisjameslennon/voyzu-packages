import { getDb } from "@voyzu/capability/db";
import type { ArInvoiceStatementResponseDto, ArSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/ar-subledger";
import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import type { ArInvoiceDetailedInvoiceDto } from "@voyzu/finance/types/modules/financial-document-types";
import { listArSubledgerEntries } from "@voyzu/finance/ar-subledger-ledger-entries/server";
import { ArInvoiceStatementRepo } from "../db/ar-invoice-statement.repo";

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function buildInvoice(company: OrganizationResponseDto, entry: ArSubledgerEntryResponseDto): Promise<ArInvoiceDetailedInvoiceDto> {
  const lines = await new ArInvoiceStatementRepo(getDb()).listInvoiceLines(entry.id);
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

async function getArInvoiceStatementUnchecked(company: OrganizationResponseDto, documentId: string): Promise<ArInvoiceStatementResponseDto | null> {
  const entries = await listArSubledgerEntries(company.id);
  const invoiceEntry = entries.find((entry) => entry.documentTypeCode === "AR_INVOICE" && entry.documentId === documentId && entry.entryType === "DEBIT");
  if (!invoiceEntry) return null;

  const appliedRows = await new ArInvoiceStatementRepo(getDb()).listAppliedTransactions(invoiceEntry.id);
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
