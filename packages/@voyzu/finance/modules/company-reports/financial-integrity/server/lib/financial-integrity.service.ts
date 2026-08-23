import { getDb } from "@voyzu/capability/db";
import { NotFoundError } from "@voyzu/capability/errors";
import type {
  FinancialIntegrityDocumentDto,
  FinancialIntegrityJournalHeaderDto,
  FinancialIntegrityJournalLineDto,
  FinancialIntegrityLedgerReconciliationDto,
  FinancialIntegrityLedgerLineDto,
  FinancialIntegrityTrialBalanceReconciliationDto,
  FinancialIntegrityLinkedInventoryDocumentDto,
  FinancialIntegrityResponseDto,
  FinancialIntegritySourceFieldDto,
  FinancialIntegritySourceLineDto,
  FinancialIntegritySubledgerEntryDto,
} from "@voyzu/finance/types/modules/company-reports";

import { FinancialIntegrityRepo, type FinancialIntegrityJournalRow, type FinancialIntegritySubledgerEntryRow } from "../db/financial-integrity.repo";
import { getTrialBalance } from "../../../trial-balance/server/lib/trial-balance.service";
import { previousDateString, TrialBalanceSnapshotRepo } from "../../../common/server/db/trial-balance-snapshot.repo";
import { postingFormulaForDocument } from "./document-posting-formulas";

async function fetchCompany(companyId: number): Promise<{
  name: string;
  reportLine1: string | null;
  reportLine2: string | null;
  reportFooter: string | null;
  baseCurrencyCode: string;
}> {
  const { rows } = await getDb().query(
    `SELECT c.name, fc.report_line_1, fc.report_line_2, fc.report_footer, c.base_currency_code
     FROM company c JOIN finance_company fc ON fc.company_id = c.id WHERE fc.id = $1`,
    [companyId],
  );
  if (!rows[0]) throw new NotFoundError(`Company id ${companyId} not found`);
  const row = rows[0] as Record<string, unknown>;
  return {
    name: String(row.name),
    reportLine1: row.report_line_1 == null ? null : String(row.report_line_1),
    reportLine2: row.report_line_2 == null ? null : String(row.report_line_2),
    reportFooter: row.report_footer == null ? null : String(row.report_footer),
    baseCurrencyCode: String(row.base_currency_code),
  };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function objectValue(input: Record<string, unknown>, key: string): unknown {
  return input[key];
}

function nestedObject(input: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const value = objectValue(input, key);
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return null;
}

function sourceInfo(detailed: Record<string, unknown>): { sourceDocumentTypeCode: string | null; sourceDocumentId: string | null } {
  const source = nestedObject(detailed, "source");
  return {
    sourceDocumentTypeCode: firstString(source?.source_document),
    sourceDocumentId: firstString(source?.source_document_id),
  };
}

function counterparty(detailed: Record<string, unknown>, snapshot: Record<string, unknown>): string | null {
  const ar = nestedObject(detailed, "ar_counterparty") ?? nestedObject(snapshot, "ar_counterparty");
  const ap = nestedObject(detailed, "ap_counterparty") ?? nestedObject(snapshot, "ap_counterparty");
  return firstString(
    ar?.name,
    ar?.code,
    ap?.name,
    ap?.code,
    objectValue(detailed, "counterparty_name"),
    objectValue(snapshot, "counterparty_name"),
  );
}

function documentCurrency(detailed: Record<string, unknown>, fallback: string): string {
  const company = nestedObject(detailed, "company");
  return firstString(objectValue(detailed, "currency_code"), company?.base_currency_code) ?? fallback;
}

const SOURCE_TOTAL_KEYS = [
  "gross_amount",
  "net_amount",
  "tax_amount",
  "receivable_amount",
  "payable_amount",
  "purchase_amount",
  "recoverable_tax_amount",
  "non_recoverable_tax_amount",
  "applied_amount",
  "unapplied_amount",
  "total_book_value_increase",
  "total_book_value_decrease",
  "total_debit_base_amount",
  "total_credit_base_amount",
] as const;

const SOURCE_LINE_KEYS = [
  "line_id",
  "description",
  "line_description",
  "quantity",
  "unit_amount",
  "net_amount",
  "tax_amount",
  "gross_amount",
  "purchase_amount",
  "revenue_posting_code",
  "purchase_posting_code",
  "inventory_item_code",
  "inventory_item_name",
  "movement",
  "quantity_delta",
  "valuation_method",
  "unit_book_value_supplied",
  "unit_book_value_used",
  "book_value_delta",
  "qty_balance",
  "avg_unit_value",
  "book_value_balance",
] as const;

const SUBLEDGER_LINE_KEYS = [
  "line_type",
  "description",
  "control_account_code",
  "dr_cr",
  "quantity",
  "unit_amount",
  "net_amount",
  "tax_amount",
  "gross_amount",
  "revenue_posting_code",
  "purchase_posting_code",
  "tax_rule_code",
  "tax_authority_code",
  "tax_movement_type_code",
  "scheme_code",
  "invoice_label",
  "report_label",
  "tax_rate",
  "taxable_base_currency_amount",
  "base_currency_amount",
  "memo",
] as const;

function sourceLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bGl\b/g, "GL")
    .replace(/\bId\b/g, "ID");
}

function sourceValue(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "number") {
    return value.toLocaleString("en-NZ", {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 6,
    });
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value.trim() || null;
  return null;
}

function sourceField(row: Record<string, unknown>, key: string): FinancialIntegritySourceFieldDto | null {
  const value = sourceValue(row[key]);
  if (value == null) return null;
  return { label: sourceLabel(key), value };
}

function sourceTotals(detailed: Record<string, unknown>): FinancialIntegritySourceFieldDto[] {
  return SOURCE_TOTAL_KEYS
    .map((key) => sourceField(detailed, key))
    .filter((field): field is FinancialIntegritySourceFieldDto => field != null);
}

function sourceLineDescription(line: Record<string, unknown>): string | null {
  return firstString(line.line_description) ?? firstString(line.description);
}

function financialDocumentDefaultWasUsed(line: Record<string, unknown>, journalRows: FinancialIntegrityJournalRow[], key: "purchase_posting_code" | "revenue_posting_code"): boolean {
  const code = firstString(line[key]);
  if (!code) return false;

  const description = sourceLineDescription(line);
  return journalRows.some((row) => {
    if (row.source_ledger !== "POSTING_CODE" || row.source_control_account !== code) return false;
    if (!description) return true;
    return row.line_description === description;
  });
}

function sourceLineField(line: Record<string, unknown>, journalRows: FinancialIntegrityJournalRow[], key: string): FinancialIntegritySourceFieldDto | null {
  if ((key === "purchase_posting_code" || key === "revenue_posting_code") && !financialDocumentDefaultWasUsed(line, journalRows, key)) {
    return null;
  }
  return sourceField(line, key);
}

function sourceLines(detailed: Record<string, unknown>, journalRows: FinancialIntegrityJournalRow[]): FinancialIntegritySourceLineDto[] {
  const rawLines = detailed.lines;
  if (!Array.isArray(rawLines)) return [];

  return rawLines
    .filter((line): line is Record<string, unknown> => Boolean(line) && typeof line === "object" && !Array.isArray(line))
    .map((line, index) => {
      const knownFields = SOURCE_LINE_KEYS
        .map((key) => sourceLineField(line, journalRows, key))
        .filter((field): field is FinancialIntegritySourceFieldDto => field != null);
      const fields = knownFields.length > 0
        ? knownFields
        : Object.keys(line)
          .map((key) => sourceLineField(line, journalRows, key))
          .filter((field): field is FinancialIntegritySourceFieldDto => field != null);
      return {
        lineNumber: Number(line.line_id ?? line.line_number ?? index + 1),
        fields,
      };
    });
}

function makeSourceField(label: string, value: unknown): FinancialIntegritySourceFieldDto | null {
  const formatted = sourceValue(value);
  return formatted == null ? null : { label, value: formatted };
}

function inventorySourceTotals(lines: Awaited<ReturnType<FinancialIntegrityRepo["getLinkedInventoryDocuments"]>>[number]["lines"]): FinancialIntegritySourceFieldDto[] {
  const totalQtyDelta = round2(lines.reduce((sum, line) => sum + line.qtyDelta, 0));
  const totalBookIncrease = round2(lines.filter((line) => line.bookValueDelta > 0).reduce((sum, line) => sum + line.bookValueDelta, 0));
  const totalBookDecrease = round2(Math.abs(lines.filter((line) => line.bookValueDelta < 0).reduce((sum, line) => sum + line.bookValueDelta, 0)));
  return [
    makeSourceField("Line Count", lines.length),
    makeSourceField("Total Qty Delta", totalQtyDelta),
    makeSourceField("Total Book Value Increase", totalBookIncrease),
    makeSourceField("Total Book Value Decrease", totalBookDecrease),
  ].filter((field): field is FinancialIntegritySourceFieldDto => field != null);
}

function inventorySourceLines(lines: Awaited<ReturnType<FinancialIntegrityRepo["getLinkedInventoryDocuments"]>>[number]["lines"]): FinancialIntegritySourceLineDto[] {
  return lines.map((line) => ({
    lineNumber: line.lineNumber,
    fields: [
      makeSourceField("Movement", line.movement),
      makeSourceField("Item", `${line.itemName} (${line.itemCode})`),
      makeSourceField("Qty Delta", line.qtyDelta),
      makeSourceField("Unit Value Supplied", line.unitValueSupplied),
      makeSourceField("Book Value Delta", line.bookValueDelta),
    ].filter((field): field is FinancialIntegritySourceFieldDto => field != null),
  }));
}

function subledgerLineField(line: Record<string, unknown>, journalRows: FinancialIntegrityJournalRow[], key: string): FinancialIntegritySourceFieldDto | null {
  if ((key === "purchase_posting_code" || key === "revenue_posting_code") && !financialDocumentDefaultWasUsed(line, journalRows, key)) {
    return null;
  }
  return sourceField(line, key);
}

function toSubledgerEntry(row: FinancialIntegritySubledgerEntryRow, journalRows: FinancialIntegrityJournalRow[]): FinancialIntegritySubledgerEntryDto {
  return {
    id: row.id,
    code: row.code,
    ledger: row.ledger,
    documentTypeCode: row.document_type_code,
    documentId: row.document_id,
    postingDate: row.posting_date,
    currencyCode: row.base_currency_code,
    memo: row.memo,
    description: row.description,
    status: row.status,
    lines: row.lines.map((line, index) => ({
      lineNumber: Number(line.line_number ?? index + 1),
      fields: SUBLEDGER_LINE_KEYS
        .map((key) => subledgerLineField(line, journalRows, key))
        .filter((field): field is FinancialIntegritySourceFieldDto => field != null),
    })),
  };
}

function toJournalLine(row: FinancialIntegrityJournalRow): FinancialIntegrityJournalLineDto | null {
  if (row.line_id == null || row.line_number == null) return null;
  const amount = row.base_currency_amount ?? 0;
  return {
    id: row.line_id,
    lineNumber: row.line_number,
    glAccountId: row.gl_account_id,
    glAccountCode: row.gl_account_code,
    glAccountName: row.gl_account_name,
    debit: row.dr_cr === "DR" ? amount : 0,
    credit: row.dr_cr === "CR" ? amount : 0,
    amount: row.dr_cr === "DR" ? amount : -amount,
    dimensions: row.dimensions,
    taxCode: null,
    taxAmount: null,
    counterparty: counterparty(row.detailed_document_snapshot_json, row.document_snapshot_json),
    memo: row.line_memo,
    description: row.line_description,
  };
}

function journalFromRows(rows: FinancialIntegrityJournalRow[]): FinancialIntegrityJournalHeaderDto {
  const first = rows[0];
  const lines = rows.map(toJournalLine).filter((line): line is FinancialIntegrityJournalLineDto => line != null);
  const debitTotal = round2(lines.reduce((sum, line) => sum + line.debit, 0));
  const creditTotal = round2(lines.reduce((sum, line) => sum + line.credit, 0));
  const difference = round2(debitTotal - creditTotal);

  return {
    id: first.journal_id,
    code: first.journal_code,
    postingDate: first.posting_date,
    sourceDocumentTypeCode: first.document_type_code,
    sourceDocumentId: first.document_id,
    financialPeriodCode: first.financial_period_code,
    currencyCode: first.base_currency_code,
    status: first.status,
    debitTotal,
    creditTotal,
    difference,
    balancesToZero: difference === 0,
    lines,
  };
}

function toDocument(rows: FinancialIntegrityJournalRow[]): FinancialIntegrityDocumentDto {
  const first = rows[0];
  const detailed = first.detailed_document_snapshot_json;
  const snapshot = first.document_snapshot_json;
  const source = sourceInfo(detailed);
  return {
    key: `${first.document_type_code}:${first.document_id}`,
    documentTypeCode: first.document_type_code,
    documentTypeName: first.document_type_label,
    accountingFormula: postingFormulaForDocument(first.document_type_code),
    documentId: first.document_id,
    postingDate: first.posting_date,
    sourceDocumentTypeCode: source.sourceDocumentTypeCode,
    sourceDocumentId: source.sourceDocumentId,
    counterparty: counterparty(detailed, snapshot),
    currencyCode: documentCurrency(detailed, first.base_currency_code),
    memo: first.memo ?? firstString(objectValue(detailed, "memo")),
    description: first.description ?? firstString(objectValue(detailed, "generated_description")),
    status: first.status,
    sourceDocumentJson: snapshot,
    sourceTotals: sourceTotals(detailed),
    sourceLines: sourceLines(detailed, rows),
    journalHeaders: [journalFromRows(rows)],
    subledgerEntries: [],
    linkedInventoryDocuments: [],
    downstreamDocuments: [],
  };
}

function buildDocuments(journalRows: FinancialIntegrityJournalRow[]): FinancialIntegrityDocumentDto[] {
  const rowsByDocument = new Map<string, FinancialIntegrityJournalRow[]>();
  for (const row of journalRows) {
    const key = `${row.document_type_code}:${row.document_id}`;
    rowsByDocument.set(key, [...(rowsByDocument.get(key) ?? []), row]);
  }

  const documents = [...rowsByDocument.values()].map(toDocument);
  const byKey = new Map(documents.map((document) => [document.key, document]));
  const roots: FinancialIntegrityDocumentDto[] = [];

  for (const document of documents) {
    const parentKey = document.sourceDocumentTypeCode && document.sourceDocumentId
      ? `${document.sourceDocumentTypeCode}:${document.sourceDocumentId}`
      : null;
    const parent = parentKey ? byKey.get(parentKey) : null;
    if (parent && parent.key !== document.key) parent.downstreamDocuments.push(document);
    else roots.push(document);
  }

  return roots;
}

function attachInventoryDocuments(
  documents: FinancialIntegrityDocumentDto[],
  inventoryRows: Awaited<ReturnType<FinancialIntegrityRepo["getLinkedInventoryDocuments"]>>,
): void {
  const byJournalId = new Map<number, FinancialIntegrityDocumentDto>();
  const visit = (document: FinancialIntegrityDocumentDto) => {
    for (const journal of document.journalHeaders) byJournalId.set(journal.id, document);
    for (const child of document.downstreamDocuments) visit(child);
  };
  documents.forEach(visit);

  for (const row of inventoryRows) {
    const parent = byJournalId.get(row.journal_header_id);
    if (!parent) continue;
    const controlAccounts = [...new Set(row.lines.map((line) => line.movement))];
    const linked: FinancialIntegrityLinkedInventoryDocumentDto = {
      id: row.id,
      code: row.code,
      documentTypeCode: controlAccounts.length === 1 ? controlAccounts[0] : "INVENTORY_LEDGER",
      documentId: row.document_id,
      postingDate: row.posting_date,
      sourceDocumentTypeCode: row.source_document_type_code,
      sourceDocumentId: row.source_document_id ?? row.parent_document_id,
      currencyCode: row.base_currency_code,
      memo: row.memo,
      description: row.description,
      status: row.status,
      sourceTotals: inventorySourceTotals(row.lines),
      sourceLines: inventorySourceLines(row.lines),
      lines: row.lines,
    };

    if (row.document_id === parent.documentId) parent.linkedInventoryDocuments.push(linked);
    else parent.linkedInventoryDocuments.push(linked);
  }
}

function attachSubledgerEntries(
  documents: FinancialIntegrityDocumentDto[],
  subledgerRows: FinancialIntegritySubledgerEntryRow[],
  journalRows: FinancialIntegrityJournalRow[],
): void {
  const byJournalId = new Map<number, FinancialIntegrityDocumentDto>();
  const journalRowsByJournalId = new Map<number, FinancialIntegrityJournalRow[]>();
  for (const row of journalRows) {
    journalRowsByJournalId.set(row.journal_id, [...(journalRowsByJournalId.get(row.journal_id) ?? []), row]);
  }

  const visit = (document: FinancialIntegrityDocumentDto) => {
    for (const journal of document.journalHeaders) byJournalId.set(journal.id, document);
    for (const child of document.downstreamDocuments) visit(child);
  };
  documents.forEach(visit);

  for (const row of subledgerRows) {
    const parent = byJournalId.get(row.journal_header_id);
    if (!parent) continue;
    parent.subledgerEntries.push(toSubledgerEntry(row, journalRowsByJournalId.get(row.journal_header_id) ?? []));
  }
}

function mergeWithTrialBalanceClosing(
  periodLines: FinancialIntegrityLedgerLineDto[],
  trialBalance: Awaited<ReturnType<typeof getTrialBalance>>,
): FinancialIntegrityLedgerLineDto[] {
  const linesByAccount = new Map(periodLines.map((line) => [line.glAccountId, { ...line }]));

  for (const trialLine of trialBalance.lines) {
    const closingBalance = round2(trialLine.debitTotal - trialLine.creditTotal);
    const existing = linesByAccount.get(trialLine.glAccountId);
    if (existing) {
      existing.closingBalance = closingBalance;
      existing.openingBalance = round2(closingBalance - existing.netMovement);
    } else if (closingBalance !== 0) {
      linesByAccount.set(trialLine.glAccountId, {
        glAccountId: trialLine.glAccountId,
        glAccountCode: trialLine.glAccountCode,
        glAccountName: trialLine.glAccountName,
        accountType: trialLine.accountType,
        openingBalance: closingBalance,
        periodDebits: 0,
        periodCredits: 0,
        netMovement: 0,
        closingBalance,
      });
    }
  }

  return [...linesByAccount.values()].sort((a, b) => {
    const typeOrder: Record<string, number> = { ASSET: 1, LIABILITY: 2, EQUITY: 3, REVENUE: 4, EXPENSE: 5 };
    return (typeOrder[a.accountType] ?? 6) - (typeOrder[b.accountType] ?? 6) || a.glAccountCode.localeCompare(b.glAccountCode);
  });
}

function buildLedgerReconciliation(
  ledgerLines: FinancialIntegrityLedgerLineDto[],
  journals: FinancialIntegrityJournalHeaderDto[],
): FinancialIntegrityLedgerReconciliationDto {
  const reportJournalLines = journals.flatMap((journal) => journal.lines);
  const ledgerSummaryPeriodDebits = round2(ledgerLines.reduce((sum, line) => sum + line.periodDebits, 0));
  const ledgerSummaryPeriodCredits = round2(ledgerLines.reduce((sum, line) => sum + line.periodCredits, 0));
  const ledgerSummaryNetMovement = round2(ledgerLines.reduce((sum, line) => sum + line.netMovement, 0));
  const journalLinePeriodDebits = round2(reportJournalLines.reduce((sum, line) => sum + line.debit, 0));
  const journalLinePeriodCredits = round2(reportJournalLines.reduce((sum, line) => sum + line.credit, 0));
  const journalLineNetMovement = round2(reportJournalLines.reduce((sum, line) => sum + line.amount, 0));
  const debitDifference = round2(ledgerSummaryPeriodDebits - journalLinePeriodDebits);
  const creditDifference = round2(ledgerSummaryPeriodCredits - journalLinePeriodCredits);
  const netMovementDifference = round2(ledgerSummaryNetMovement - journalLineNetMovement);

  return {
    ledgerSummaryPeriodDebits,
    journalLinePeriodDebits,
    debitDifference,
    ledgerSummaryPeriodCredits,
    journalLinePeriodCredits,
    creditDifference,
    ledgerSummaryNetMovement,
    journalLineNetMovement,
    netMovementDifference,
    passed: debitDifference === 0 && creditDifference === 0 && netMovementDifference === 0,
  };
}

async function buildTrialBalancePeriodLines(
  repo: TrialBalanceSnapshotRepo,
  companyId: number,
  fromDate: string,
  toDate: string,
): Promise<FinancialIntegrityLedgerLineDto[]> {
  const openingDate = previousDateString(fromDate);
  const [openingLines, closingLines, periodLines] = await Promise.all([
    repo.getLines(companyId, openingDate),
    repo.getLines(companyId, toDate),
    repo.getPeriodLines(companyId, fromDate, toDate, ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]),
  ]);
  const linesByAccount = new Map<number, FinancialIntegrityLedgerLineDto>();

  for (const line of openingLines) {
    linesByAccount.set(line.glAccountId, {
      glAccountId: line.glAccountId,
      glAccountCode: line.glAccountCode,
      glAccountName: line.glAccountName,
      accountType: line.accountType,
      openingBalance: round2(line.balanceAmount),
      periodDebits: 0,
      periodCredits: 0,
      netMovement: 0,
      closingBalance: round2(line.balanceAmount),
    });
  }

  for (const line of periodLines) {
    const existing = linesByAccount.get(line.glAccountId) ?? {
      glAccountId: line.glAccountId,
      glAccountCode: line.glAccountCode,
      glAccountName: line.glAccountName,
      accountType: line.accountType,
      openingBalance: 0,
      periodDebits: 0,
      periodCredits: 0,
      netMovement: 0,
      closingBalance: 0,
    };
    existing.periodDebits = round2(line.debitAmount);
    existing.periodCredits = round2(line.creditAmount);
    existing.netMovement = round2(line.balanceAmount);
    existing.closingBalance = round2(existing.openingBalance + existing.netMovement);
    linesByAccount.set(line.glAccountId, existing);
  }

  for (const line of closingLines) {
    const existing = linesByAccount.get(line.glAccountId) ?? {
      glAccountId: line.glAccountId,
      glAccountCode: line.glAccountCode,
      glAccountName: line.glAccountName,
      accountType: line.accountType,
      openingBalance: 0,
      periodDebits: 0,
      periodCredits: 0,
      netMovement: 0,
      closingBalance: 0,
    };
    existing.closingBalance = round2(line.balanceAmount);
    existing.openingBalance = round2(existing.closingBalance - existing.netMovement);
    linesByAccount.set(line.glAccountId, existing);
  }

  return [...linesByAccount.values()]
    .filter((line) => line.openingBalance !== 0 || line.periodDebits !== 0 || line.periodCredits !== 0 || line.closingBalance !== 0)
    .sort((a, b) => {
      const typeOrder: Record<string, number> = { ASSET: 1, LIABILITY: 2, EQUITY: 3, REVENUE: 4, EXPENSE: 5 };
      return (typeOrder[a.accountType] ?? 6) - (typeOrder[b.accountType] ?? 6) || a.glAccountCode.localeCompare(b.glAccountCode);
    });
}

function buildTrialBalanceReconciliation(
  trialBalanceLines: FinancialIntegrityLedgerLineDto[],
  ledgerLines: FinancialIntegrityLedgerLineDto[],
): FinancialIntegrityTrialBalanceReconciliationDto {
  const trialBalancePeriodDebits = round2(trialBalanceLines.reduce((sum, line) => sum + line.periodDebits, 0));
  const trialBalancePeriodCredits = round2(trialBalanceLines.reduce((sum, line) => sum + line.periodCredits, 0));
  const trialBalanceNetMovement = round2(trialBalanceLines.reduce((sum, line) => sum + line.netMovement, 0));
  const ledgerSummaryPeriodDebits = round2(ledgerLines.reduce((sum, line) => sum + line.periodDebits, 0));
  const ledgerSummaryPeriodCredits = round2(ledgerLines.reduce((sum, line) => sum + line.periodCredits, 0));
  const ledgerSummaryNetMovement = round2(ledgerLines.reduce((sum, line) => sum + line.netMovement, 0));
  const debitDifference = round2(trialBalancePeriodDebits - ledgerSummaryPeriodDebits);
  const creditDifference = round2(trialBalancePeriodCredits - ledgerSummaryPeriodCredits);
  const netMovementDifference = round2(trialBalanceNetMovement - ledgerSummaryNetMovement);
  const ledgerByAccount = new Map(ledgerLines.map((line) => [line.glAccountId, line]));
  const accountIds = new Set([...trialBalanceLines.map((line) => line.glAccountId), ...ledgerLines.map((line) => line.glAccountId)]);
  let mismatchedAccountCount = 0;

  for (const accountId of accountIds) {
    const tb = trialBalanceLines.find((line) => line.glAccountId === accountId);
    const ledger = ledgerByAccount.get(accountId);
    if (!tb || !ledger) {
      mismatchedAccountCount += 1;
      continue;
    }
    const differs =
      round2(tb.openingBalance - ledger.openingBalance) !== 0 ||
      round2(tb.periodDebits - ledger.periodDebits) !== 0 ||
      round2(tb.periodCredits - ledger.periodCredits) !== 0 ||
      round2(tb.netMovement - ledger.netMovement) !== 0 ||
      round2(tb.closingBalance - ledger.closingBalance) !== 0;
    if (differs) mismatchedAccountCount += 1;
  }

  return {
    trialBalancePeriodDebits,
    ledgerSummaryPeriodDebits,
    debitDifference,
    trialBalancePeriodCredits,
    ledgerSummaryPeriodCredits,
    creditDifference,
    trialBalanceNetMovement,
    ledgerSummaryNetMovement,
    netMovementDifference,
    mismatchedAccountCount,
    passed: debitDifference === 0 && creditDifference === 0 && netMovementDifference === 0 && mismatchedAccountCount === 0,
  };
}

async function getFinancialIntegrityUnchecked(
  companyId: number,
  fromDate: string,
  toDate: string,
  documentTypeCode?: string | null,
): Promise<FinancialIntegrityResponseDto> {
  const db = getDb();
  const repo = new FinancialIntegrityRepo(db);
  const trialBalanceSnapshotRepo = new TrialBalanceSnapshotRepo(db);
  const [company, periodLedgerLines, trialBalance, journalRows, inventoryRows, subledgerRows, documentTypes, dbChecks] = await Promise.all([
    fetchCompany(companyId),
    repo.getLedgerLines(companyId, fromDate, toDate),
    getTrialBalance(companyId, toDate),
    repo.getJournalRows(companyId, fromDate, toDate, documentTypeCode),
    repo.getLinkedInventoryDocuments(companyId, fromDate, toDate, documentTypeCode),
    repo.getSubledgerEntries(companyId, fromDate, toDate, documentTypeCode),
    repo.getDocumentTypes(),
    repo.getDbChecks(companyId, fromDate, toDate),
  ]);
  const ledgerLines = mergeWithTrialBalanceClosing(periodLedgerLines, trialBalance);
  const trialBalanceLines = await buildTrialBalancePeriodLines(trialBalanceSnapshotRepo, companyId, fromDate, toDate);

  const documents = buildDocuments(journalRows);
  attachSubledgerEntries(documents, subledgerRows, journalRows);
  attachInventoryDocuments(documents, inventoryRows);

  const allJournals: FinancialIntegrityJournalHeaderDto[] = [];
  const collectJournals = (document: FinancialIntegrityDocumentDto) => {
    allJournals.push(...document.journalHeaders);
    document.downstreamDocuments.forEach(collectJournals);
  };
  documents.forEach(collectJournals);

  const totalReportJournalDebits = round2(allJournals.flatMap((journal) => journal.lines).reduce((sum, line) => sum + line.debit, 0));
  const totalReportJournalCredits = round2(allJournals.flatMap((journal) => journal.lines).reduce((sum, line) => sum + line.credit, 0));
  const difference = round2(totalReportJournalDebits - totalReportJournalCredits);
  const ledgerReconciliation = buildLedgerReconciliation(ledgerLines, allJournals);
  const trialBalanceReconciliation = buildTrialBalanceReconciliation(trialBalanceLines, ledgerLines);
  const unbalancedHeaderCount = allJournals.filter((journal) => !journal.balancesToZero).length;

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    fromDate,
    toDate,
    documentTypeCode: documentTypeCode ?? null,
    ledgerLines,
    documentTypes,
    documents,
    totals: {
      totalReportJournalDebits,
      totalReportJournalCredits,
      difference,
    },
    trialBalanceLines,
    ledgerReconciliation,
    trialBalanceReconciliation,
    indicators: [
      {
        code: "TRIAL_BALANCE_MATCHES_LEDGER_SUMMARY",
        label: "Trial balance agrees to ledger integrity summary",
        passed: trialBalanceReconciliation.passed,
        detail: trialBalanceReconciliation.passed
          ? "Period trial balance rows agree to the ledger integrity summary."
          : `Debit difference ${trialBalanceReconciliation.debitDifference.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}; credit difference ${trialBalanceReconciliation.creditDifference.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}; net movement difference ${trialBalanceReconciliation.netMovementDifference.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}; ${trialBalanceReconciliation.mismatchedAccountCount} account row(s) differ.`,
      },
      {
        code: "LEDGER_SUMMARY_MATCHES_JOURNAL_LINES",
        label: "Ledger summary agrees to listed journal lines",
        passed: ledgerReconciliation.passed,
        detail: ledgerReconciliation.passed
          ? "Displayed ledger summary period totals agree to the displayed journal lines."
          : `Debit difference ${ledgerReconciliation.debitDifference.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}; credit difference ${ledgerReconciliation.creditDifference.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}; net movement difference ${ledgerReconciliation.netMovementDifference.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
      },
      {
        code: "JOURNAL_HEADERS_BALANCE",
        label: "Every listed journal header balances to zero",
        passed: unbalancedHeaderCount === 0,
        detail: unbalancedHeaderCount === 0 ? "All listed journal headers balance." : `${unbalancedHeaderCount} listed journal header(s) are unbalanced.`,
      },
      {
        code: "REPORT_DEBITS_EQUAL_CREDITS",
        label: "Total report journal debits equal total report journal credits",
        passed: difference === 0,
        detail: `Difference ${difference.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
      },
      {
        code: "NO_ORPHAN_JOURNAL_LINES",
        label: "No orphan journal lines",
        passed: dbChecks.orphanJournalLineCount === 0,
        detail: dbChecks.orphanJournalLineCount === 0 ? "No orphan journal lines found." : `${dbChecks.orphanJournalLineCount} orphan journal line(s) found.`,
      },
      {
        code: "NO_MISSING_GL_REFERENCES",
        label: "No missing GL account references",
        passed: dbChecks.missingGlAccountReferenceCount === 0,
        detail: dbChecks.missingGlAccountReferenceCount === 0 ? "All listed journal lines have GL account references." : `${dbChecks.missingGlAccountReferenceCount} journal line(s) have missing GL account references.`,
      },
      {
        code: "NO_MISSING_HEADERS_FOR_LINES",
        label: "No missing journal headers for listed journal lines",
        passed: dbChecks.missingJournalHeaderForListedLineCount === 0,
        detail: dbChecks.missingJournalHeaderForListedLineCount === 0 ? "All listed journal lines have journal headers." : `${dbChecks.missingJournalHeaderForListedLineCount} journal line(s) are missing headers.`,
      },
    ],
  };
}

export const getFinancialIntegrity = getFinancialIntegrityUnchecked;
