import { getDb } from "@voyzu/capability/db";
import type {
  ApLedgerEntryDocumentReportApplicationDto,
  ApLedgerEntryDocumentReportLineDto,
  ApLedgerEntryDocumentReportResponseDto,
  ApLedgerEntryDocumentReportTaxSummaryDto,
  ApLedgerEntryDocumentReportTotalDto,
  ApSubledgerEntryResponseDto,
} from "@voyzu/finance/types/modules/ap-subledger";
import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";

import { ApBillReportRepo, type ApDocumentLineRow } from "../db/ap-bill-report.repo";

function repo(): ApBillReportRepo {
  return new ApBillReportRepo(getDb());
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toDocumentLines(rows: ApDocumentLineRow[]): ApLedgerEntryDocumentReportLineDto[] {
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

function toTaxSummary(rows: Awaited<ReturnType<ApBillReportRepo["listDocumentTaxSummary"]>>): ApLedgerEntryDocumentReportTaxSummaryDto[] {
  return rows.map((row) => ({
    taxAuthorityCode: row.tax_authority_code,
    taxAuthorityName: row.tax_authority_name,
    invoiceLabel: row.invoice_label,
    taxRate: row.tax_rate,
    taxableAmount: row.taxable_amount,
    taxAmount: row.tax_amount,
  }));
}

function documentTotals(documentTypeCode: string, rows: ApDocumentLineRow[], taxSummary: ApLedgerEntryDocumentReportTaxSummaryDto[]): ApLedgerEntryDocumentReportTotalDto[] {
  const total = (selector: (line: ApDocumentLineRow) => number | null) =>
    roundMoney(rows.reduce((sum, line) => sum + (selector(line) ?? 0), 0));

  if (documentTypeCode === "AP_BILL") {
    const taxTotal = taxSummary.length > 0
      ? roundMoney(taxSummary.reduce((sum, item) => sum + item.taxAmount, 0))
      : total((line) => line.tax_amount);
    return [
      { label: "Net", amount: total((line) => line.net_amount) },
      { label: "Tax", amount: taxTotal },
      { label: "Gross", amount: total((line) => line.gross_amount) },
    ];
  }
  return [{ label: "Amount", amount: total((line) => line.gross_amount) }];
}

async function getApLedgerEntryDocumentReportUnchecked(
  company: OrganizationResponseDto,
  entry: ApSubledgerEntryResponseDto,
): Promise<ApLedgerEntryDocumentReportResponseDto | null> {
  const [lineRows, taxSummaryRows, appliedTransactions, applicationRows] = await Promise.all([
    repo().listDocumentLines(entry.id),
    repo().listDocumentTaxSummary(entry.journalHeaderId),
    repo().listAppliedTransactions(entry.id),
    repo().listDocumentApplications(entry.id),
  ]);
  const taxSummary = toTaxSummary(taxSummaryRows);
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

  const applications: ApLedgerEntryDocumentReportApplicationDto[] = applicationRows.map((row) => ({
    sourceDocumentId: null,
    targetDocumentId: row.target_document_id,
    targetDocumentType: row.target_document_type_label,
    amount: row.amount,
  }));

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
    lines: toDocumentLines(reportLineRows),
    taxSummary,
    totals: documentTotals(entry.documentTypeCode, reportLineRows, taxSummary),
    appliedTransactions: appliedTransactions.map((row) => ({
      code: row.code,
      postingDate: row.posting_date,
      documentDate: row.document_date,
      documentTypeLabel: row.document_type_label,
      documentId: row.document_id,
      amount: row.amount,
    })),
    applications,
  };
}

export const getApLedgerEntryDocumentReport = getApLedgerEntryDocumentReportUnchecked;
