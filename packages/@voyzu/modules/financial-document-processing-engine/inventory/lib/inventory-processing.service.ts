import type { DrCr } from "@voyzu/types/modules/core";
import type { InventoryAdjustmentRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/inventory-adjustment.request.dto";
import type { InventoryIssueRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/inventory-issue.request.dto";
import type {
  InventoryLedgerDetailsDto,
  InventoryLedgerLineDetailDto,
  InventoryProcessingDetailedDocumentDto,
  InventoryProcessingDetailedLineDto,
  InventoryProcessingJournalLineDto,
  InventoryProcessingPostingDetailsDto,
  InventoryProcessingPostingResponseDto,
} from "@voyzu/types/modules/financial-document-processing-engine/inventory-processing.response.dto";
import type { InventoryReceiptRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/inventory-receipt.request.dto";
import { getDb, type DbExecutor, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";

import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import {
  INVENTORY_ADJUSTMENT_CONTROL_COMPONENT,
  INVENTORY_ADJUSTMENT_GAIN_COMPONENT,
  INVENTORY_ADJUSTMENT_LOSS_COMPONENT,
} from "../../inventory_adjustment/journal-posting-components";
import {
  INVENTORY_ISSUE_COGS_COMPONENT,
  INVENTORY_ISSUE_CONSUMPTION_COMPONENT,
  INVENTORY_ISSUE_CONTROL_COMPONENT,
} from "../../inventory_issue/journal-posting-components";
import {
  INVENTORY_RECEIPT_ADJUSTMENT_GAIN_COMPONENT,
  INVENTORY_RECEIPT_CONTROL_COMPONENT,
} from "../../inventory_receipt/journal-posting-components";
import { InventoryProcessingRepo } from "../db/inventory-processing.repo";
import type {
  DimensionValueLookupRow,
  GlAccountPostingRow,
  InventoryBalanceRow,
  InventoryItemPostingRow,
  InventoryLedgerHeaderRow,
  InventoryLedgerLineRow,
} from "../db/inventory-processing.row.types";
import {
  documentDateFor,
  type InventoryDataValidationContext,
  type InventoryDocumentType,
  type InventoryProcessingRequestDto,
  postingDateFor,
  requestedDimensionPairs,
  requestedItemCodes,
  validateInventoryData,
  validateInventoryRequest,
} from "./inventory-processing.validator";

export interface ProcessInventoryOptions {
  preview?: boolean;
  db?: DbExecutor;
  sourceJournalHeaderId?: number;
  suppressJournalPosting?: boolean;
}

type ResolvedInventoryRequestDto = InventoryProcessingRequestDto & { document_id: string };
type ItemPostingProfileFieldCode = "cogs_code" | "consumption_code" | "adjustment_gain_code" | "adjustment_loss_code";

interface InventoryLineDimension {
  dimension_id: number;
  dimension_value_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
}

interface InventoryPostingLine {
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: string | null;
  source_control_account: string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  memo: string | null;
  dimensions?: InventoryLineDimension[];
}

interface ResolvedContext {
  request: ResolvedInventoryRequestDto;
  data: InventoryDataValidationContext;
  detailedDocument: InventoryProcessingDetailedDocumentDto;
  generated: {
    journalLines: InventoryPostingLine[];
    totalDebitBaseAmount: number;
    totalCreditBaseAmount: number;
  };
  reservedJournalHeaderId: number | null;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function round6(value: number): number {
  return Math.round((value + Number.EPSILON) * 1_000_000) / 1_000_000;
}

function amount(value: number | string | null | undefined): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function hasDocumentId(request: InventoryProcessingRequestDto): request is ResolvedInventoryRequestDto {
  return typeof request.document_id === "string" && request.document_id.trim().length > 0;
}

function documentPrefix(documentType: InventoryDocumentType): string {
  if (documentType === "INVENTORY_RECEIPT") return "INV-REC";
  if (documentType === "INVENTORY_ISSUE") return "INV-ISS";
  return "INV-ADJ";
}

function documentLabel(documentType: InventoryDocumentType): string {
  if (documentType === "INVENTORY_RECEIPT") return "Inventory Receipt";
  if (documentType === "INVENTORY_ISSUE") return "Inventory Issue";
  return "Inventory Adjustment";
}

function ledgerSourceDocumentType(request: ResolvedInventoryRequestDto): string {
  const source = request.source.source_document;
  if (["AR_INVOICE", "AP_BILL", "INVENTORY_RECEIPT", "INVENTORY_ISSUE", "INVENTORY_ADJUSTMENT"].includes(source)) return source;
  return request.document_type;
}

function withDocumentId(request: InventoryProcessingRequestDto, journalHeaderId: number): ResolvedInventoryRequestDto {
  if (hasDocumentId(request)) return request;
  return { ...request, document_id: `${documentPrefix(request.document_type)}-${journalHeaderId}` } as ResolvedInventoryRequestDto;
}

function mapByCode<T extends { code: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.code, row]));
}

function mapBalances(rows: InventoryBalanceRow[]): Map<number, InventoryBalanceRow> {
  return new Map(rows.map((row) => [row.item_id, row]));
}

function mapDimensionValues(rows: DimensionValueLookupRow[]): Map<string, DimensionValueLookupRow> {
  return new Map(rows.map((row) => [`${row.dimension_code}\u0000${row.dimension_value_name}`, row]));
}

function requireAccount(account: GlAccountPostingRow | null, label: string, expectedType: GlAccountPostingRow["account_type"]): GlAccountPostingRow {
  if (!account) throw new BusinessRuleError(`${label} is not configured on the item posting profile`);
  if (account.status !== "ACTIVE") throw new BusinessRuleError(`${label} resolves to an inactive GL account`);
  if (account.account_type !== expectedType) throw new BusinessRuleError(`${label} must resolve to a ${expectedType} GL account`);
  return account;
}

function itemPostingProfileAccount(
  item: InventoryItemPostingRow,
  fieldCode: ItemPostingProfileFieldCode,
  expectedType: GlAccountPostingRow["account_type"],
): GlAccountPostingRow {
  const accountByField: Record<ItemPostingProfileFieldCode, GlAccountPostingRow | null> = {
    cogs_code: item.cogs_gl_account,
    consumption_code: item.consumption_gl_account,
    adjustment_gain_code: item.adjustment_gain_gl_account,
    adjustment_loss_code: item.adjustment_loss_gl_account,
  };
  return requireAccount(accountByField[fieldCode], `Item posting profile ${item.posting_profile_code}.${fieldCode}`, expectedType);
}

function requireCurrentAverage(item: InventoryItemPostingRow, balance: InventoryBalanceRow | undefined, label: string): number {
  if (!balance || balance.qty_balance === 0) {
    throw new BusinessRuleError(`${label} requires a current average unit book value for item ${item.code}`);
  }
  return balance.avg_unit_value;
}

function nextAverage(qtyBalance: number, bookValueBalance: number): number {
  if (qtyBalance === 0) return 0;
  return round2(bookValueBalance / qtyBalance);
}

function dimensionsForLine(data: InventoryDataValidationContext, dimensions: Record<string, string> | null | undefined): InventoryLineDimension[] {
  return Object.entries(dimensions ?? {}).map(([dimensionCode, valueName]) => {
    const row = data.dimensionValuesByDimensionCodeAndName.get(`${dimensionCode}\u0000${valueName}`);
    if (!row) throw new BusinessRuleError(`Dimension ${dimensionCode} value ${valueName} was not resolved`);
    return {
      dimension_id: row.dimension_id,
      dimension_value_id: row.dimension_value_id,
      dimension_code: row.dimension_code,
      dimension_name: row.dimension_name,
      dimension_value_name: row.dimension_value_name,
    };
  });
}

function buildDetailedLine(
  request: ResolvedInventoryRequestDto,
  line: ResolvedInventoryRequestDto["lines"][number],
  index: number,
  item: InventoryItemPostingRow,
  balances: Map<number, InventoryBalanceRow>,
): InventoryProcessingDetailedLineDto {
  const previous = balances.get(item.id);
  const previousQty = previous?.qty_balance ?? 0;
  const previousBookValue = previous?.book_value_balance ?? 0;
  let quantityDelta: number;
  let bookValueDelta: number;
  let unitSupplied: number | null = null;
  let unitUsed: number | null = null;
  let movement: InventoryProcessingDetailedLineDto["movement"];
  let valuationMethod: string | null = null;
  let issuePurpose: "SOLD" | "CONSUMED" | null = null;
  let adjustmentType: "QUANTITY_ADJUSTMENT" | "VALUE_ADJUSTMENT" | null = null;

  if (request.document_type === "INVENTORY_RECEIPT") {
    const receiptLine = line as InventoryReceiptRequestDto["lines"][number];
    movement = "INVENTORY_RECEIPT";
    valuationMethod = receiptLine.valuation_method;
    quantityDelta = amount(receiptLine.quantity_delta);
    if (receiptLine.valuation_method === "SUPPLIED_UNIT_BOOK_VALUE") {
      unitSupplied = amount(receiptLine.unit_book_value);
      unitUsed = unitSupplied;
    } else {
      unitUsed = requireCurrentAverage(item, previous, "CURRENT_AVERAGE_BOOK_VALUE");
    }
    bookValueDelta = round2(quantityDelta * unitUsed);
  } else if (request.document_type === "INVENTORY_ISSUE") {
    const issueLine = line as InventoryIssueRequestDto["lines"][number];
    movement = "INVENTORY_ISSUE";
    issuePurpose = issueLine.issue_purpose;
    quantityDelta = amount(issueLine.quantity_delta);
    unitUsed = requireCurrentAverage(item, previous, "INVENTORY_ISSUE");
    bookValueDelta = round2(quantityDelta * unitUsed);
  } else {
    const adjustmentLine = line as InventoryAdjustmentRequestDto["lines"][number];
    adjustmentType = adjustmentLine.adjustment_type;
    if (adjustmentLine.adjustment_type === "QUANTITY_ADJUSTMENT") {
      movement = "INVENTORY_QUANTITY_ADJUSTMENT";
      quantityDelta = amount(adjustmentLine.quantity_delta);
      if (quantityDelta > 0 && adjustmentLine.unit_book_value != null) {
        unitSupplied = amount(adjustmentLine.unit_book_value);
        unitUsed = unitSupplied;
      } else {
        unitUsed = requireCurrentAverage(item, previous, "QUANTITY_ADJUSTMENT");
      }
      bookValueDelta = round2(quantityDelta * unitUsed);
    } else {
      movement = "INVENTORY_VALUE_ADJUSTMENT";
      quantityDelta = 0;
      if (!previous) throw new BusinessRuleError(`VALUE_ADJUSTMENT requires an existing inventory balance for item ${item.code}`);
      bookValueDelta = round2(amount(adjustmentLine.book_value_delta));
    }
  }

  const qtyBalance = round6(previousQty + quantityDelta);
  const bookValueBalance = round2(previousBookValue + bookValueDelta);
  const avgUnitValue = nextAverage(qtyBalance, bookValueBalance);
  balances.set(item.id, {
    item_id: item.id,
    qty_balance: qtyBalance,
    avg_unit_value: avgUnitValue,
    book_value_balance: bookValueBalance,
  });

  return {
    line_id: line.line_id ?? index + 1,
    inventory_item_code: item.code,
    inventory_item_name: item.name,
    item_posting_profile_code: item.posting_profile_code,
    description: line.description?.trim() || item.name,
    movement,
    quantity_delta: quantityDelta,
    valuation_method: valuationMethod,
    issue_purpose: issuePurpose,
    adjustment_type: adjustmentType,
    unit_book_value_supplied: unitSupplied,
    unit_book_value_used: unitUsed,
    book_value_delta: bookValueDelta,
    qty_balance: qtyBalance,
    avg_unit_value: avgUnitValue,
    book_value_balance: bookValueBalance,
    dimensions: line.dimensions ?? {},
  };
}

function accountForLine(request: ResolvedInventoryRequestDto, detail: InventoryProcessingDetailedLineDto, item: InventoryItemPostingRow): GlAccountPostingRow {
  if (request.document_type === "INVENTORY_RECEIPT") {
    return itemPostingProfileAccount(item, INVENTORY_RECEIPT_ADJUSTMENT_GAIN_COMPONENT.code, "REVENUE");
  }
  if (request.document_type === "INVENTORY_ISSUE") {
    if (detail.issue_purpose === "SOLD") return itemPostingProfileAccount(item, INVENTORY_ISSUE_COGS_COMPONENT.code, "EXPENSE");
    return itemPostingProfileAccount(item, INVENTORY_ISSUE_CONSUMPTION_COMPONENT.code, "EXPENSE");
  }
  if (detail.book_value_delta > 0) return itemPostingProfileAccount(item, INVENTORY_ADJUSTMENT_GAIN_COMPONENT.code, "REVENUE");
  return itemPostingProfileAccount(item, INVENTORY_ADJUSTMENT_LOSS_COMPONENT.code, "EXPENSE");
}

function inventoryControlCodeForDocument(documentType: InventoryDocumentType): "INVENTORY_CONTROL" {
  if (documentType === "INVENTORY_RECEIPT") return INVENTORY_RECEIPT_CONTROL_COMPONENT.code;
  if (documentType === "INVENTORY_ISSUE") return INVENTORY_ISSUE_CONTROL_COMPONENT.code;
  return INVENTORY_ADJUSTMENT_CONTROL_COMPONENT.code;
}

function buildGeneratedPosting(
  context: Omit<ResolvedContext, "detailedDocument" | "generated">,
  detailedDocument: InventoryProcessingDetailedDocumentDto,
): ResolvedContext["generated"] {
  const controlAccount = context.data.inventoryControlAccount!;
  const inventoryControlCode = inventoryControlCodeForDocument(context.request.document_type);
  const lines: InventoryPostingLine[] = [];

  for (const detail of detailedDocument.lines) {
    if (detail.book_value_delta === 0) continue;
    const item = context.data.itemsByCode.get(detail.inventory_item_code)!;
    const offsetAccount = accountForLine(context.request, detail, item);
    const absAmount = Math.abs(detail.book_value_delta);
    const dimensions = dimensionsForLine(context.data, detail.dimensions);
    if (detail.book_value_delta > 0) {
      lines.push({
        line_number: lines.length + 1,
        gl_account_id: controlAccount.gl_account.id,
        gl_account_code: controlAccount.gl_account.code,
        gl_account_name: controlAccount.gl_account.name,
        source_ledger: "INVENTORY",
        source_control_account: inventoryControlCode,
        dr_cr: "DR",
        base_currency_amount: absAmount,
        description: detail.description,
        memo: detailedDocument.memo,
      });
      lines.push({
        line_number: lines.length + 1,
        gl_account_id: offsetAccount.id,
        gl_account_code: offsetAccount.code,
        gl_account_name: offsetAccount.name,
        source_ledger: "ITEM_POSTING_PROFILE",
        source_control_account: item.posting_profile_code,
        dr_cr: "CR",
        base_currency_amount: absAmount,
        description: detail.description,
        memo: detailedDocument.memo,
        dimensions,
      });
    } else {
      lines.push({
        line_number: lines.length + 1,
        gl_account_id: offsetAccount.id,
        gl_account_code: offsetAccount.code,
        gl_account_name: offsetAccount.name,
        source_ledger: "ITEM_POSTING_PROFILE",
        source_control_account: item.posting_profile_code,
        dr_cr: "DR",
        base_currency_amount: absAmount,
        description: detail.description,
        memo: detailedDocument.memo,
        dimensions,
      });
      lines.push({
        line_number: lines.length + 1,
        gl_account_id: controlAccount.gl_account.id,
        gl_account_code: controlAccount.gl_account.code,
        gl_account_name: controlAccount.gl_account.name,
        source_ledger: "INVENTORY",
        source_control_account: inventoryControlCode,
        dr_cr: "CR",
        base_currency_amount: absAmount,
        description: detail.description,
        memo: detailedDocument.memo,
      });
    }
  }

  return {
    journalLines: lines,
    totalDebitBaseAmount: round2(lines.filter((line) => line.dr_cr === "DR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
    totalCreditBaseAmount: round2(lines.filter((line) => line.dr_cr === "CR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
  };
}

async function resolveContext(repo: InventoryProcessingRepo, request: ResolvedInventoryRequestDto, reservedJournalHeaderId: number | null): Promise<ResolvedContext> {
  const company = await repo.getCompanyByCode(request.company_code);
  if (company && company.status !== "ACTIVE") throw new BusinessRuleError(`Company ${company.code} is not ACTIVE`);
  const settingsCompanyId = company ? await resolveEffectiveSettingsCompanyId(company.id) : null;
  const [documentProcessor, fiscalPeriod, controlAccount, items, dimensionValues] = await Promise.all([
    company ? repo.getDocumentProcessor(request.document_type) : Promise.resolve(null),
    company ? repo.getOpenFiscalPeriod(company.id, postingDateFor(request)) : Promise.resolve(null),
    settingsCompanyId ? repo.getInventoryControlAccount(settingsCompanyId) : Promise.resolve(null),
    company ? repo.listInventoryItems(company.id, requestedItemCodes(request)) : Promise.resolve([]),
    settingsCompanyId ? repo.listDimensionValues(settingsCompanyId, requestedDimensionPairs(request)) : Promise.resolve([]),
  ]);
  const balances = mapBalances(await repo.listCurrentBalances(items.map((item) => item.id)));
  const data: InventoryDataValidationContext = {
    company,
    documentProcessor,
    fiscalPeriod,
    inventoryControlAccount: controlAccount,
    itemsByCode: mapByCode(items),
    dimensionValuesByDimensionCodeAndName: mapDimensionValues(dimensionValues),
  };
  validateInventoryData(request, data);

  const workingBalances = new Map(balances);
  const detailedLines = request.lines.map((line, index) => {
    const item = data.itemsByCode.get(line.inventory_item_code);
    if (!item) throw new BusinessRuleError(`Inventory item ${line.inventory_item_code} was not resolved`);
    return buildDetailedLine(request, line, index, item, workingBalances);
  });
  const detailedDocument: InventoryProcessingDetailedDocumentDto = {
    company: { code: data.company!.code, base_currency_code: data.company!.base_currency_code },
    document_type: request.document_type,
    document_id: request.document_id,
    memo: request.memo ?? null,
    source: {
      source_document: request.source.source_document,
      source_document_id: request.source.source_document_id ?? null,
      source_type: request.source.source_type ?? null,
      source_line_id: request.source.source_line_id ?? null,
    },
    generated_description: `${documentLabel(request.document_type)} ${request.document_id}`,
    document_date: documentDateFor(request),
    posting_date: postingDateFor(request),
    lines: detailedLines,
    total_book_value_increase: round2(detailedLines.filter((line) => line.book_value_delta > 0).reduce((sum, line) => sum + line.book_value_delta, 0)),
    total_book_value_decrease: round2(Math.abs(detailedLines.filter((line) => line.book_value_delta < 0).reduce((sum, line) => sum + line.book_value_delta, 0))),
  };
  const generated = buildGeneratedPosting({ request, data, reservedJournalHeaderId }, detailedDocument);
  if (generated.totalDebitBaseAmount !== generated.totalCreditBaseAmount) {
    throw new BusinessRuleError(`${request.document_type} generated unbalanced journal lines`);
  }
  return { request, data, detailedDocument, generated, reservedJournalHeaderId };
}

function postingDetails(context: ResolvedContext, header?: JournalHeaderRow, rows: JournalLineRow[] = []): InventoryProcessingPostingDetailsDto {
  return {
    journal_header: {
      id: header?.id ?? null,
      code: header?.code ?? null,
      document_type_code: context.request.document_type,
      document_id: context.detailedDocument.document_id,
      generated_description: context.detailedDocument.generated_description,
      posting_engine_code: context.request.document_type,
      company_code: context.data.company!.code,
      document_date: context.detailedDocument.document_date,
      posting_date: context.detailedDocument.posting_date,
      financial_year_code: context.data.fiscalPeriod!.financial_year_code,
      financial_period_code: context.data.fiscalPeriod!.financial_period_code,
      base_currency_code: context.data.company!.base_currency_code,
      total_debit_base_amount: header?.total_debit_base_amount ?? context.generated.totalDebitBaseAmount,
      total_credit_base_amount: header?.total_credit_base_amount ?? context.generated.totalCreditBaseAmount,
      memo: context.detailedDocument.memo,
      status: header ? "POSTED" : "EPHEMERAL",
    },
    journal_lines: context.generated.journalLines.map((line, index): InventoryProcessingJournalLineDto => ({
      id: rows[index]?.id ?? null,
      journal_header_id: rows[index]?.journal_header_id ?? null,
      line_number: line.line_number,
      gl_account_code: line.gl_account_code,
      gl_account_name: line.gl_account_name,
      source_ledger: rows[index]?.source_ledger ?? line.source_ledger,
      source_control_account: rows[index]?.source_control_account ?? line.source_control_account,
      dr_cr: line.dr_cr,
      base_currency_amount: line.base_currency_amount,
      description: line.description,
      memo: line.memo,
      dimensions: line.dimensions?.map((dimension) => ({
        dimension_code: dimension.dimension_code,
        dimension_name: dimension.dimension_name,
        dimension_value_name: dimension.dimension_value_name,
      })),
    })),
  };
}

function inventoryLedgerDetails(context: ResolvedContext, journalHeaderId: number | null, header?: InventoryLedgerHeaderRow, rows: InventoryLedgerLineRow[] = []): InventoryLedgerDetailsDto {
  const inventoryControlCode = inventoryControlCodeForDocument(context.request.document_type);
  return {
    inventory_ledger_entry_header: {
      id: header?.id ?? null,
      code: header?.code ?? null,
      company_code: context.data.company!.code,
      journal_header_id: journalHeaderId,
      source_document_type_code: ledgerSourceDocumentType(context.request),
      document_id: context.detailedDocument.document_id,
      generated_description: context.detailedDocument.generated_description,
      document_date: context.detailedDocument.document_date,
      posting_date: context.detailedDocument.posting_date,
      financial_year_code: context.data.fiscalPeriod!.financial_year_code,
      financial_period_code: context.data.fiscalPeriod!.financial_period_code,
      base_currency_code: context.data.company!.base_currency_code,
      status: header ? "POSTED" : "EPHEMERAL",
    },
    inventory_ledger_lines: context.detailedDocument.lines.map((line, index): InventoryLedgerLineDetailDto => ({
      id: rows[index]?.id ?? null,
      inventory_ledger_entry_header_id: rows[index]?.inventory_ledger_entry_header_id ?? null,
      line_number: index + 1,
      movement: line.movement,
      inventory_item_code: line.inventory_item_code,
      inventory_item_name: line.inventory_item_name,
      inventory_control_account_code: inventoryControlCode,
      qty_delta: line.quantity_delta,
      unit_value_supplied: line.unit_book_value_supplied,
      book_value_delta: line.book_value_delta,
      qty_balance: line.qty_balance,
      avg_unit_value: line.avg_unit_value,
      book_value_balance: line.book_value_balance,
      memo: context.detailedDocument.memo,
    })),
  };
}

async function persistInventoryDocument(context: ResolvedContext, db: DbExecutor, options: ProcessInventoryOptions): Promise<InventoryProcessingPostingResponseDto> {
  const txRepo = new InventoryProcessingRepo(db);
  const journalRepo = new JournalRepo(db);

  let journalHeader: JournalHeaderRow | undefined;
  let postedJournal: JournalHeaderRow | undefined;
  const journalLines: JournalLineRow[] = [];
  if (!options.suppressJournalPosting) {
    journalHeader = await journalRepo.insert({
      id: context.reservedJournalHeaderId ?? undefined,
      company_id: context.data.company!.id,
      company_code: context.data.company!.code,
      company_name: context.data.company!.name,
      document_type_code: context.request.document_type,
      document_type_label: documentLabel(context.request.document_type),
      document_id: context.detailedDocument.document_id,
      description: context.detailedDocument.generated_description,
      document_snapshot_json: context.request,
      detailed_document_snapshot_json: context.detailedDocument,
      posting_engine_code: context.request.document_type,
      document_date: context.detailedDocument.document_date,
      posting_date: context.detailedDocument.posting_date,
      financial_year_id: context.data.fiscalPeriod!.financial_year_id,
      financial_year_code: context.data.fiscalPeriod!.financial_year_code,
      financial_period_id: context.data.fiscalPeriod!.financial_period_id,
      financial_period_code: context.data.fiscalPeriod!.financial_period_code,
      base_currency_code: context.data.company!.base_currency_code,
      memo: context.detailedDocument.memo,
    });
    for (const line of context.generated.journalLines) {
      const insertedLine = await journalRepo.insertLine({ journal_header_id: journalHeader.id, ...line });
      journalLines.push(insertedLine);
      for (const dimension of line.dimensions ?? []) {
        await journalRepo.insertLineDimension({ journal_line_id: insertedLine.id, ...dimension });
      }
    }
    postedJournal = await journalRepo.setPosted(journalHeader.id, context.generated.totalDebitBaseAmount, context.generated.totalCreditBaseAmount);
  } else if (!options.sourceJournalHeaderId) {
    throw new InputValidationError("sourceJournalHeaderId is required when suppressJournalPosting is true");
  }

  const journalHeaderId = journalHeader?.id ?? options.sourceJournalHeaderId!;
    const ledgerHeader = await txRepo.insertInventoryLedgerHeader({
      code: `${documentPrefix(context.request.document_type)}-${journalHeaderId}`,
      company_id: context.data.company!.id,
      journal_header_id: journalHeaderId,
      source_document_type_code: ledgerSourceDocumentType(context.request),
      document_id: context.detailedDocument.document_id,
      description: context.detailedDocument.generated_description,
      memo: context.detailedDocument.memo,
      document_date: context.detailedDocument.document_date,
      posting_date: context.detailedDocument.posting_date,
      financial_year_id: context.data.fiscalPeriod!.financial_year_id,
      financial_period_id: context.data.fiscalPeriod!.financial_period_id,
      base_currency_code: context.data.company!.base_currency_code,
    });
    const ledgerLines: InventoryLedgerLineRow[] = [];
    for (const [index, line] of context.detailedDocument.lines.entries()) {
      const item = context.data.itemsByCode.get(line.inventory_item_code);
      if (!item) throw new BusinessRuleError(`Inventory item ${line.inventory_item_code} was not resolved`);
      ledgerLines.push(await txRepo.insertInventoryLedgerLine({
        inventory_ledger_entry_header_id: ledgerHeader.id,
        line_number: index + 1,
        movement_type_code: line.movement,
        item_id: item.id,
        description: line.description,
        inventory_control_account_code: inventoryControlCodeForDocument(context.request.document_type),
        qty_delta: line.quantity_delta,
        unit_value_supplied: line.unit_book_value_supplied,
        book_value_delta: line.book_value_delta,
        qty_balance: line.qty_balance,
        avg_unit_value: line.avg_unit_value,
        book_value_balance: line.book_value_balance,
        memo: context.detailedDocument.memo,
      }));
      await txRepo.updateItemDerivedBalance(item.id, {
        qty_balance: line.qty_balance,
        avg_unit_value: line.avg_unit_value,
        book_value_balance: line.book_value_balance,
      });
    }
    return {
      detailed_document: context.detailedDocument,
      inventory_ledger_details: inventoryLedgerDetails(context, journalHeaderId, ledgerHeader, ledgerLines),
      posting_details: postingDetails(context, postedJournal, journalLines),
    };
}

async function processInventoryDocument(input: InventoryProcessingRequestDto, documentType: InventoryDocumentType, options: ProcessInventoryOptions = {}): Promise<InventoryProcessingPostingResponseDto> {
  validateInventoryRequest(input, documentType);
  const rawRequest: InventoryProcessingRequestDto = input;
  const repo = new InventoryProcessingRepo(options.db ?? getDb());
  const hasCallerDocumentId = hasDocumentId(rawRequest);
  let reservedJournalHeaderId: number | null = null;
  let request: ResolvedInventoryRequestDto;
  if (hasCallerDocumentId) {
    request = rawRequest;
  } else {
    reservedJournalHeaderId = await repo.reserveJournalHeaderId();
    request = withDocumentId(rawRequest, reservedJournalHeaderId);
  }
  const context = await resolveContext(repo, request, reservedJournalHeaderId);

  if (options.preview) {
    return {
      detailed_document: context.detailedDocument,
      inventory_ledger_details: inventoryLedgerDetails(context, null),
      posting_details: postingDetails(context),
    };
  }

  if (options.db) return persistInventoryDocument(context, options.db, options);

  return withTransaction((client) => persistInventoryDocument(context, client, options));
}

export async function processInventoryReceipt(input: InventoryReceiptRequestDto, options: ProcessInventoryOptions = {}): Promise<InventoryProcessingPostingResponseDto> {
  return processInventoryDocument(input, "INVENTORY_RECEIPT", options);
}

export async function processInventoryIssue(input: InventoryIssueRequestDto, options: ProcessInventoryOptions = {}): Promise<InventoryProcessingPostingResponseDto> {
  return processInventoryDocument(input, "INVENTORY_ISSUE", options);
}

export async function processInventoryAdjustment(input: InventoryAdjustmentRequestDto, options: ProcessInventoryOptions = {}): Promise<InventoryProcessingPostingResponseDto> {
  return processInventoryDocument(input, "INVENTORY_ADJUSTMENT", options);
}

