import type { DrCr, EntryType } from "@voyzu/core/types/modules/core";
import type { BankCashJournalDetailsDto } from "@voyzu/core/types/modules/financial-document-processing-engine/bank-cash-details.dto";
import type {
  TaxAdjustmentEffect,
  TaxAdjustmentRequestDto,
  TaxMovementCode,
  TaxPaymentRequestDto,
  TaxProcessingDocumentType,
  TaxProcessingRequestDto,
  TaxRefundRequestDto,
} from "@voyzu/core/types/modules/financial-document-processing-engine/tax-processing.request.dto";
import type {
  TaxProcessingDetailedDocumentDto,
  TaxProcessingPostingResponseDto,
  TaxProcessingTaxLedgerDetailDto,
} from "@voyzu/core/types/modules/financial-document-processing-engine/tax-processing.response.dto";
import { getDb, type DbExecutor, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";

import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import { resolveBankCashDetails, toJournalBankCashFields } from "../../../common/bank-cash-accounts/server/lib/bank-cash-account.service";
import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { InsertJournalLineRow, JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import taxAdjustmentPosting from "../../tax_adjustment/journal-posting-components";
import taxPaymentPosting from "../../tax_payment/journal-posting-components";
import taxRefundPosting from "../../tax_refund/journal-posting-components";

const TAX_PAYMENT_TAX_CONTROL_CODE = taxPaymentPosting.components.dr_tax_control_account.code;
const TAX_PAYMENT_CASH_POSTING_CODE = taxPaymentPosting.components.cr_bank_cash.posting_code;
const TAX_PAYMENT_CASH_SLOT = "bank_cash_account_code";
const TAX_REFUND_TAX_CONTROL_CODE = taxRefundPosting.components.cr_tax_control_account.code;
const TAX_REFUND_CASH_POSTING_CODE = taxRefundPosting.components.dr_bank_cash.posting_code;
const TAX_REFUND_CASH_SLOT = "bank_cash_account_code";
const TAX_ADJUSTMENT_OFFSET_ACCOUNT_POSTING_CODE = taxAdjustmentPosting.components.tax_adjustment_offset.code;
const TAX_ADJUSTMENT_OFFSET_ACCOUNT_SLOT = "adjustment_gl_account_code";

const LABELS: Record<TaxProcessingDocumentType, string> = {
  TAX_PAYMENT: "Tax Payment",
  TAX_REFUND: "Tax Refund",
  TAX_ADJUSTMENT: "Tax Adjustment",
};

const PREFIXES: Record<TaxProcessingDocumentType, string> = {
  TAX_PAYMENT: "TAX-PAY",
  TAX_REFUND: "TAX-REF",
  TAX_ADJUSTMENT: "TAX-ADJ",
};

type Company = { id: number; code: string; name: string; country_code: string; base_currency_code: string; status: string };
type Period = { financial_year_id: number; financial_year_code: string; financial_period_id: number; financial_period_code: string };
type TaxAuthority = { id: number; code: string; name: string };
type Account = {
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  code?: string;
  bank_cash_control_account_code?: string;
  tax_control_account_code?: string;
};
type TaxRule = { id: number };
type DocumentProcessor = { code: string; status: string; supports_dimensions: boolean; cash_movement: boolean; supports_items: boolean };
type PendingJournalLine = Omit<InsertJournalLineRow, "journal_header_id">;
type ResolvedRequest = TaxProcessingRequestDto & { document_id: string };
type Context = {
  documentType: TaxProcessingDocumentType;
  request: ResolvedRequest;
  company: Company;
  period: Period;
  taxAuthority: TaxAuthority;
  detailed: TaxProcessingDetailedDocumentDto;
  journalLines: PendingJournalLine[];
  taxDetails: TaxProcessingTaxLedgerDetailDto[];
  bankCashDetails: BankCashJournalDetailsDto | null;
  reservedJournalHeaderId: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") throw new InputValidationError(`${path} is required`);
  return value.trim();
}

function optionalString(value: unknown, path: string): string | null {
  if (value == null) return null;
  if (typeof value !== "string" || value.trim() === "") throw new InputValidationError(`${path} must be a non-empty string`);
  return value.trim();
}

function date(value: unknown, path: string): string {
  const v = requiredString(value, path);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new InputValidationError(`${path} must be an ISO date (YYYY-MM-DD)`);
  return v;
}

function amount(value: unknown, path: string): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) throw new InputValidationError(`${path} must be greater than zero`);
  return round2(n);
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function documentDate(documentType: TaxProcessingDocumentType, request: TaxProcessingRequestDto): string {
  if (documentType === "TAX_PAYMENT") return date((request as TaxPaymentRequestDto).payment_date, "payment_date");
  if (documentType === "TAX_REFUND") return date((request as TaxRefundRequestDto).refund_date, "refund_date");
  return date((request as TaxAdjustmentRequestDto).adjustment_date, "adjustment_date");
}

function postingDate(request: TaxProcessingRequestDto, fallback: string): string {
  return request.posting_date ? date(request.posting_date, "posting_date") : fallback;
}

function validateInput(documentType: TaxProcessingDocumentType, input: unknown): asserts input is TaxProcessingRequestDto {
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");
  if (input.document_type !== undefined && input.document_type !== documentType) throw new InputValidationError(`document_type must be ${documentType}`);
  requiredString(input.company_code, "company_code");
  requiredString(input.tax_authority_code, "tax_authority_code");
  if (input.document_id !== undefined) requiredString(input.document_id, "document_id");
  if (input.memo !== undefined && input.memo !== null && typeof input.memo !== "string") throw new InputValidationError("memo must be a string");

  if (documentType === "TAX_PAYMENT") {
    date(input.payment_date, "payment_date");
    amount(input.payment_amount, "payment_amount");
    if ("tax_gl_account_code" in input) throw new BusinessRuleError("TAX_PAYMENT does not support tax_gl_account_code");
    optionalString(input[TAX_PAYMENT_CASH_SLOT], TAX_PAYMENT_CASH_SLOT);
    return;
  }

  if (documentType === "TAX_REFUND") {
    date(input.refund_date, "refund_date");
    amount(input.refund_amount, "refund_amount");
    if ("tax_gl_account_code" in input) throw new BusinessRuleError("TAX_REFUND does not support tax_gl_account_code");
    optionalString(input[TAX_REFUND_CASH_SLOT], TAX_REFUND_CASH_SLOT);
    return;
  }

  date(input.adjustment_date, "adjustment_date");
  amount(input.adjustment_amount, "adjustment_amount");
  if (input.tax_movement_code !== "TAX_ON_SALES" && input.tax_movement_code !== "TAX_ON_PURCHASES") {
    throw new InputValidationError("tax_movement_code must be TAX_ON_SALES or TAX_ON_PURCHASES");
  }
  validateAdjustmentEffect(input.tax_movement_code, input.adjustment_effect);
  optionalString(input[TAX_ADJUSTMENT_OFFSET_ACCOUNT_SLOT], TAX_ADJUSTMENT_OFFSET_ACCOUNT_SLOT);
}

function validateAdjustmentEffect(movementCode: unknown, effect: unknown): asserts effect is TaxAdjustmentEffect {
  if (movementCode === "TAX_ON_SALES" && (effect === "INCREASES_TAX_PAYABLE" || effect === "REDUCES_TAX_PAYABLE")) return;
  if (movementCode === "TAX_ON_PURCHASES" && (effect === "INCREASES_TAX_RECOVERABLE" || effect === "REDUCES_TAX_RECOVERABLE")) return;
  throw new InputValidationError("adjustment_effect is not valid for tax_movement_code");
}

async function reserveDocumentId(documentType: TaxProcessingDocumentType, request: TaxProcessingRequestDto): Promise<{ request: ResolvedRequest; reservedId: number | null }> {
  if (typeof request.document_id === "string" && request.document_id.trim()) return { request: request as ResolvedRequest, reservedId: null };
  const id = await new JournalRepo(getDb()).reserveHeaderId();
  return { request: { ...request, document_id: `${PREFIXES[documentType]}-${id}` } as ResolvedRequest, reservedId: id };
}

async function one<T>(db: DbExecutor, sql: string, params: unknown[], map: (row: Record<string, unknown>) => T): Promise<T | null> {
  const { rows } = await db.query(sql, params);
  return rows[0] ? map(rows[0] as Record<string, unknown>) : null;
}

function company(row: Record<string, unknown>): Company {
  return { id: Number(row.id), code: String(row.code), name: String(row.name), country_code: String(row.country_code), base_currency_code: String(row.base_currency_code), status: String(row.status) };
}

function period(row: Record<string, unknown>): Period {
  return { financial_year_id: Number(row.financial_year_id), financial_year_code: String(row.financial_year_code), financial_period_id: Number(row.financial_period_id), financial_period_code: String(row.financial_period_code) };
}

function taxAuthority(row: Record<string, unknown>): TaxAuthority {
  return { id: Number(row.id), code: String(row.code), name: String(row.name) };
}

function documentProcessor(row: Record<string, unknown>): DocumentProcessor {
  return { code: String(row.code), status: String(row.status), supports_dimensions: Boolean(row.supports_dimensions), cash_movement: Boolean(row.cash_movement), supports_items: Boolean(row.supports_items) };
}

function account(row: Record<string, unknown>): Account {
  return {
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    code: row.code == null ? undefined : String(row.code),
    bank_cash_control_account_code: row.bank_cash_control_account_code == null ? undefined : String(row.bank_cash_control_account_code),
    tax_control_account_code: row.tax_control_account_code == null ? undefined : String(row.tax_control_account_code),
  };
}

async function base(db: DbExecutor, request: TaxProcessingRequestDto, pd: string): Promise<{ company: Company; period: Period; taxAuthority: TaxAuthority }> {
  const companyCode = requiredString(request.company_code, "company_code");
  const c = await one(db, `SELECT fc.id, c.code, c.name, c.country_code, c.base_currency_code, c.status
    FROM finance_company fc JOIN company c ON c.id = fc.company_id
    WHERE c.code = $1 AND fc.is_template = false`, [companyCode], company);
  if (!c) throw new BusinessRuleError(`Company ${companyCode} was not found`);
  if (c.status !== "ACTIVE") throw new BusinessRuleError(`Company ${c.code} is not ACTIVE`);

  const authorityCode = requiredString(request.tax_authority_code, "tax_authority_code");
  const authority = await one(db, `SELECT id, code, name FROM tax_authority WHERE code = $1 AND country_code = $2 AND status = 'ACTIVE'`, [authorityCode, c.country_code], taxAuthority);
  if (!authority) throw new BusinessRuleError(`Tax authority ${authorityCode} was not found for ${c.country_code}`);

  const p = await one(db, `SELECT fy.id AS financial_year_id, fy.code AS financial_year_code, fp.id AS financial_period_id, fp.code AS financial_period_code
    FROM fiscal_period fp
    JOIN fiscal_year fy ON fy.id = fp.fiscal_year_id
    WHERE fp.finance_company_id = $1 AND $2::date BETWEEN fp.start_date AND fp.end_date AND fp.status = 'OPEN' AND fy.status = 'OPEN'
    LIMIT 1`, [c.id, pd], period);
  if (!p) throw new BusinessRuleError(`No OPEN fiscal period contains posting date ${pd}`);
  return { company: c, period: p, taxAuthority: authority };
}

async function taxControl(db: DbExecutor, companyId: number, code: TaxMovementCode): Promise<Account> {
  const acc = await one(db, `SELECT tca.code AS tax_control_account_code, ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
    FROM tax_control_account tca
    JOIN gl_account ga ON ga.finance_company_id = tca.finance_company_id AND ga.id = tca.gl_account_id
    WHERE tca.finance_company_id = $1 AND tca.code = $2 AND tca.status = 'ACTIVE' AND ga.status = 'ACTIVE'`, [companyId, code], account);
  if (!acc) throw new BusinessRuleError(`${code} tax control account is not configured`);
  return acc;
}

async function glAccount(db: DbExecutor, companyId: number, code: string, path: string, allowedAccountTypes?: string[]): Promise<Account> {
  const acc = await one(db, `SELECT id AS gl_account_id, code AS gl_account_code, name AS gl_account_name FROM gl_account WHERE finance_company_id = $1 AND code = $2 AND status = 'ACTIVE' AND ($3::text[] IS NULL OR account_type = ANY($3::text[]))`, [companyId, code, allowedAccountTypes ?? null], account);
  if (!acc) throw new BusinessRuleError(`${path} ${code} was not found or is inactive`);
  return acc;
}

async function postingCode(db: DbExecutor, companyId: number, documentType: TaxProcessingDocumentType, defaultCode: string, requested?: string | null): Promise<Account> {
  const defaultRow = await one(db, `SELECT target_type, allowed_account_types FROM financial_document_default WHERE finance_company_id = $1 AND document_code = $2 AND code = $3 AND status = 'ACTIVE' LIMIT 1`, [companyId, documentType, defaultCode], (row) => ({
    target_type: String(row.target_type),
    allowed_account_types: row.allowed_account_types as string[],
  }));
  if (!defaultRow) throw new BusinessRuleError(`Financial document default ${defaultCode} was not resolved for ${documentType}`);
  const row = requested
    ? defaultRow.target_type === "BANK_CASH_ACCOUNT"
      ? await one(db, `SELECT $3::text AS code, bca.code AS bank_cash_control_account_code,
             bca.gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
          FROM bank_cash_control_account bca
          JOIN gl_account ga ON ga.finance_company_id = bca.finance_company_id AND ga.id = bca.gl_account_id
          WHERE bca.finance_company_id = $1
            AND bca.code = $2
            AND bca.status = 'ACTIVE'
            AND ga.status = 'ACTIVE'
            AND ga.account_type = ANY($4::text[])
          LIMIT 1`, [companyId, requested, defaultCode, defaultRow.allowed_account_types], account)
      : await one(db, `SELECT $3::text AS code, ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
          FROM gl_account ga
          WHERE ga.finance_company_id = $1
            AND ga.code = $2
            AND ga.status = 'ACTIVE'
            AND ga.account_type = ANY($4::text[])
          LIMIT 1`, [companyId, requested, defaultCode, defaultRow.allowed_account_types], account)
    : await one(db, `SELECT pc.code, bca.code AS bank_cash_control_account_code,
             COALESCE(pc.gl_account_id, bca.gl_account_id) AS gl_account_id,
             ga.code AS gl_account_code, ga.name AS gl_account_name
      FROM financial_document_default pc
      LEFT JOIN bank_cash_control_account bca ON bca.finance_company_id = pc.finance_company_id AND bca.id = pc.bank_cash_control_account_id
      JOIN gl_account ga ON ga.finance_company_id = pc.finance_company_id AND ga.id = COALESCE(pc.gl_account_id, bca.gl_account_id)
      WHERE pc.finance_company_id = $1
        AND pc.document_code = $2
        AND pc.code = $3
        AND pc.status = 'ACTIVE'
        AND (bca.id IS NULL OR bca.status = 'ACTIVE')
        AND ga.status = 'ACTIVE'
      LIMIT 1`, [companyId, documentType, defaultCode], account);
  if (!row) throw new BusinessRuleError(`${requested ? "Override" : "Default"} account ${requested ?? defaultCode} was not resolved for ${documentType}`);
  return row;
}

function journalLine(lineNumber: number, acc: Account, drCr: DrCr, value: number, description: string, memo: string | null, sourceLedger: string | null, sourceControlAccount: string | null): PendingJournalLine {
  return {
    line_number: lineNumber,
    gl_account_id: acc.gl_account_id,
    gl_account_code: acc.gl_account_code,
    gl_account_name: acc.gl_account_name,
    source_ledger: sourceLedger,
    source_control_account: sourceControlAccount,
    dr_cr: drCr,
    base_currency_amount: value,
    description,
    memo,
  };
}

function taxLedgerEntryType(documentType: TaxProcessingDocumentType, movementCode: TaxMovementCode, effect?: TaxAdjustmentEffect): EntryType {
  if (documentType === "TAX_PAYMENT") return "DEBIT";
  if (documentType === "TAX_REFUND") return "CREDIT";
  if (movementCode === "TAX_ON_SALES") return effect === "INCREASES_TAX_PAYABLE" ? "CREDIT" : "DEBIT";
  return effect === "INCREASES_TAX_RECOVERABLE" ? "DEBIT" : "CREDIT";
}

function adjustmentSides(movementCode: TaxMovementCode, effect: TaxAdjustmentEffect): { taxSide: DrCr; offsetSide: DrCr } {
  const entryType = taxLedgerEntryType("TAX_ADJUSTMENT", movementCode, effect);
  return entryType === "DEBIT" ? { taxSide: "DR", offsetSide: "CR" } : { taxSide: "CR", offsetSide: "DR" };
}

function taxDetail(ctx: Pick<Context, "company" | "period" | "taxAuthority" | "detailed">, entryType: EntryType, value: number, description: string): TaxProcessingTaxLedgerDetailDto {
  return {
    id: null,
    code: null,
    tax_rule: "CALLER_SUPPLIED",
    tax_component_id: null,
    tax_authority_code: ctx.taxAuthority.code,
    tax_authority_name: ctx.taxAuthority.name,
    tax_movement_type_code: ctx.detailed.tax_movement_code,
    description,
    tax_rate: 0,
    taxable_amount: 0,
    posting_date: ctx.detailed.posting_date,
    financial_year_code: ctx.period.financial_year_code,
    financial_period_code: ctx.period.financial_period_code,
    base_currency_code: ctx.company.base_currency_code,
    entry_type: entryType,
    base_currency_amount: value,
    status: "EPHEMERAL",
  };
}

async function buildPayment(db: DbExecutor, request: TaxPaymentRequestDto & { document_id: string }, reservedId: number | null): Promise<Context> {
  const paymentDate = date(request.payment_date, "payment_date");
  const pd = postingDate(request, paymentDate);
  const b = await base(db, request, pd);
  const value = amount(request.payment_amount, "payment_amount");
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(b.company.id);
  const tax = await taxControl(db, settingsCompanyId, TAX_PAYMENT_TAX_CONTROL_CODE);
  const cash = await postingCode(db, settingsCompanyId, "TAX_PAYMENT", TAX_PAYMENT_CASH_POSTING_CODE, request[TAX_PAYMENT_CASH_SLOT]);
  if (!cash.bank_cash_control_account_code) throw new BusinessRuleError(`${TAX_PAYMENT_CASH_SLOT} ${cash.code ?? TAX_PAYMENT_CASH_POSTING_CODE} must resolve to a bank/cash account`);
  const bankCashDetails = await resolveBankCashDetails(b.company.id, b.company.base_currency_code, request.bank_cash_details);
  if (bankCashDetails && bankCashDetails.gl_account_id !== cash.gl_account_id) {
    throw new BusinessRuleError(`bank_cash_details.code ${bankCashDetails.code} GL account does not match ${TAX_PAYMENT_CASH_SLOT} ${cash.code}`);
  }
  const detailed: TaxProcessingDetailedDocumentDto = {
    document_type: "TAX_PAYMENT",
    company: { code: b.company.code, base_currency_code: b.company.base_currency_code },
    tax_authority: { code: b.taxAuthority.code, name: b.taxAuthority.name },
    document_id: request.document_id,
    memo: request.memo ?? null,
    generated_description: `Tax Payment ${request.document_id}`,
    payment_date: paymentDate,
    posting_date: pd,
    payment_amount: value,
    tax_movement_code: TAX_PAYMENT_TAX_CONTROL_CODE,
    [TAX_PAYMENT_CASH_SLOT]: cash.bank_cash_control_account_code,
    bank_cash_details: bankCashDetails,
  };
  const ctx: Context = { documentType: "TAX_PAYMENT", request, company: b.company, period: b.period, taxAuthority: b.taxAuthority, detailed, journalLines: [], taxDetails: [], bankCashDetails, reservedJournalHeaderId: reservedId };
  ctx.journalLines = [
    journalLine(1, tax, "DR", value, detailed.generated_description, detailed.memo, "TAX", TAX_PAYMENT_TAX_CONTROL_CODE),
    journalLine(2, cash, "CR", value, detailed.generated_description, detailed.memo, "BANK_CASH", cash.bank_cash_control_account_code ?? cash.code ?? null),
  ];
  ctx.taxDetails = [taxDetail(ctx, "DEBIT", value, "Tax payment")];
  return ctx;
}

async function buildRefund(db: DbExecutor, request: TaxRefundRequestDto & { document_id: string }, reservedId: number | null): Promise<Context> {
  const refundDate = date(request.refund_date, "refund_date");
  const pd = postingDate(request, refundDate);
  const b = await base(db, request, pd);
  const value = amount(request.refund_amount, "refund_amount");
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(b.company.id);
  const tax = await taxControl(db, settingsCompanyId, TAX_REFUND_TAX_CONTROL_CODE);
  const cash = await postingCode(db, settingsCompanyId, "TAX_REFUND", TAX_REFUND_CASH_POSTING_CODE, request[TAX_REFUND_CASH_SLOT]);
  if (!cash.bank_cash_control_account_code) throw new BusinessRuleError(`${TAX_REFUND_CASH_SLOT} ${cash.code ?? TAX_REFUND_CASH_POSTING_CODE} must resolve to a bank/cash account`);
  const bankCashDetails = await resolveBankCashDetails(b.company.id, b.company.base_currency_code, request.bank_cash_details);
  if (bankCashDetails && bankCashDetails.gl_account_id !== cash.gl_account_id) {
    throw new BusinessRuleError(`bank_cash_details.code ${bankCashDetails.code} GL account does not match ${TAX_REFUND_CASH_SLOT} ${cash.code}`);
  }
  const detailed: TaxProcessingDetailedDocumentDto = {
    document_type: "TAX_REFUND",
    company: { code: b.company.code, base_currency_code: b.company.base_currency_code },
    tax_authority: { code: b.taxAuthority.code, name: b.taxAuthority.name },
    document_id: request.document_id,
    memo: request.memo ?? null,
    generated_description: `Tax Refund ${request.document_id}`,
    refund_date: refundDate,
    posting_date: pd,
    refund_amount: value,
    tax_movement_code: TAX_REFUND_TAX_CONTROL_CODE,
    [TAX_REFUND_CASH_SLOT]: cash.bank_cash_control_account_code,
    bank_cash_details: bankCashDetails,
  };
  const ctx: Context = { documentType: "TAX_REFUND", request, company: b.company, period: b.period, taxAuthority: b.taxAuthority, detailed, journalLines: [], taxDetails: [], bankCashDetails, reservedJournalHeaderId: reservedId };
  ctx.journalLines = [
    journalLine(1, cash, "DR", value, detailed.generated_description, detailed.memo, "BANK_CASH", cash.bank_cash_control_account_code ?? cash.code ?? null),
    journalLine(2, tax, "CR", value, detailed.generated_description, detailed.memo, "TAX", TAX_REFUND_TAX_CONTROL_CODE),
  ];
  ctx.taxDetails = [taxDetail(ctx, "CREDIT", value, "Tax refund")];
  return ctx;
}

async function buildAdjustment(db: DbExecutor, request: TaxAdjustmentRequestDto & { document_id: string }, reservedId: number | null): Promise<Context> {
  const adjustmentDate = date(request.adjustment_date, "adjustment_date");
  const pd = postingDate(request, adjustmentDate);
  const b = await base(db, request, pd);
  const value = amount(request.adjustment_amount, "adjustment_amount");
  const movementCode = request.tax_movement_code;
  const effect = request.adjustment_effect;
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(b.company.id);
  const tax = await taxControl(db, settingsCompanyId, movementCode);
  const offsetOverride = request[TAX_ADJUSTMENT_OFFSET_ACCOUNT_SLOT];
  const offset = offsetOverride
    ? await glAccount(db, settingsCompanyId, offsetOverride, TAX_ADJUSTMENT_OFFSET_ACCOUNT_SLOT, ["EXPENSE"])
    : await postingCode(db, settingsCompanyId, "TAX_ADJUSTMENT", TAX_ADJUSTMENT_OFFSET_ACCOUNT_POSTING_CODE);
  const sides = adjustmentSides(movementCode, effect);
  const detailed: TaxProcessingDetailedDocumentDto = {
    document_type: "TAX_ADJUSTMENT",
    company: { code: b.company.code, base_currency_code: b.company.base_currency_code },
    tax_authority: { code: b.taxAuthority.code, name: b.taxAuthority.name },
    document_id: request.document_id,
    memo: request.memo ?? null,
    generated_description: `Tax Adjustment ${request.document_id}`,
    adjustment_date: adjustmentDate,
    posting_date: pd,
    adjustment_amount: value,
    adjustment_effect: effect,
    tax_movement_code: movementCode,
    [TAX_ADJUSTMENT_OFFSET_ACCOUNT_SLOT]: offset.gl_account_code,
  };
  const ctx: Context = { documentType: "TAX_ADJUSTMENT", request, company: b.company, period: b.period, taxAuthority: b.taxAuthority, detailed, journalLines: [], taxDetails: [], bankCashDetails: null, reservedJournalHeaderId: reservedId };
  ctx.journalLines = [
    journalLine(1, offset, sides.offsetSide, value, detailed.generated_description, detailed.memo, offsetOverride ? null : "POSTING_CODE", offsetOverride ? null : offset.code ?? TAX_ADJUSTMENT_OFFSET_ACCOUNT_POSTING_CODE),
    journalLine(2, tax, sides.taxSide, value, detailed.generated_description, detailed.memo, "TAX", movementCode),
  ];
  ctx.taxDetails = [taxDetail(ctx, taxLedgerEntryType("TAX_ADJUSTMENT", movementCode, effect), value, "Tax adjustment")];
  return ctx;
}

async function buildContext(db: DbExecutor, documentType: TaxProcessingDocumentType, request: ResolvedRequest, reservedId: number | null): Promise<Context> {
  if (documentType === "TAX_PAYMENT") return buildPayment(db, request as TaxPaymentRequestDto & { document_id: string }, reservedId);
  if (documentType === "TAX_REFUND") return buildRefund(db, request as TaxRefundRequestDto & { document_id: string }, reservedId);
  return buildAdjustment(db, request as TaxAdjustmentRequestDto & { document_id: string }, reservedId);
}

function totals(lines: PendingJournalLine[]): { debit: number; credit: number } {
  return {
    debit: round2(lines.filter((line) => line.dr_cr === "DR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
    credit: round2(lines.filter((line) => line.dr_cr === "CR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
  };
}

function response(ctx: Context, header: JournalHeaderRow | null = null, rows: JournalLineRow[] | null = null): TaxProcessingPostingResponseDto {
  const total = totals(ctx.journalLines);
  return {
    detailed_document: ctx.detailed,
    tax_ledger_details: ctx.taxDetails,
    posting_details: {
      journal_header: {
        id: header?.id ?? null,
        code: header?.code ?? null,
        document_type_code: ctx.documentType,
        document_id: ctx.detailed.document_id,
        generated_description: ctx.detailed.generated_description,
        posting_engine_code: ctx.documentType,
        company_code: ctx.company.code,
        document_date: documentDate(ctx.documentType, ctx.request),
        posting_date: ctx.detailed.posting_date,
        financial_year_code: ctx.period.financial_year_code,
        financial_period_code: ctx.period.financial_period_code,
        base_currency_code: ctx.company.base_currency_code,
        total_debit_base_amount: header?.total_debit_base_amount ?? total.debit,
        total_credit_base_amount: header?.total_credit_base_amount ?? total.credit,
        memo: ctx.detailed.memo,
        status: header ? "POSTED" : "EPHEMERAL",
      },
      journal_lines: (rows ?? ctx.journalLines.map((line) => ({ id: null, journal_header_id: null, ...line }))).map((line) => ({
        id: line.id ?? null,
        journal_header_id: line.journal_header_id ?? null,
        line_number: line.line_number,
        gl_account_code: line.gl_account_code,
        gl_account_name: line.gl_account_name,
        source_ledger: line.source_ledger ?? null,
        source_control_account: line.source_control_account ?? null,
        dr_cr: line.dr_cr === "DR" ? "DR" : "CR",
        base_currency_amount: line.base_currency_amount,
        description: line.description,
        memo: line.memo ?? null,
      })),
    },
  };
}

async function taxRule(db: DbExecutor, countryCode: string): Promise<TaxRule> {
  const rule = await one(db, `SELECT id FROM tax_rule WHERE country_code = $1 AND code = 'CALLER_SUPPLIED' AND status = 'ACTIVE' LIMIT 1`, [countryCode], (row) => ({ id: Number(row.id) }));
  if (!rule) throw new BusinessRuleError(`CALLER_SUPPLIED tax setup was not resolved for ${countryCode}`);
  return rule;
}

async function insertTaxLedger(db: DbExecutor, ctx: Context, journalHeaderId: number): Promise<TaxProcessingTaxLedgerDetailDto[]> {
  const rule = await taxRule(db, ctx.company.country_code);
  const headerCode = `TAX-${ctx.documentType.replace("TAX_", "").replaceAll("_", "-")}-${journalHeaderId}`;
  const header = await db.query(`INSERT INTO tax_ledger_entry_header
    (code, finance_company_id, journal_header_id, document_type_code, document_id, description, document_date, posting_date, financial_year_id, financial_period_id, base_currency_code, status, creation_date, creation_actor_type)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'POSTED',now(),'SYSTEM') RETURNING id`,
    [headerCode, ctx.company.id, journalHeaderId, ctx.documentType, ctx.detailed.document_id, ctx.detailed.generated_description, documentDate(ctx.documentType, ctx.request), ctx.detailed.posting_date, ctx.period.financial_year_id, ctx.period.financial_period_id, ctx.company.base_currency_code]);

  const rows: TaxProcessingTaxLedgerDetailDto[] = [];
  for (const [index, detail] of ctx.taxDetails.entries()) {
    const lineNumber = index + 1;
    const inserted = await db.query(`INSERT INTO tax_ledger_entry_line
      (tax_ledger_entry_header_id, line_number, tax_rule_id, tax_component_id, tax_authority_id, tax_movement_type_code, scheme_code, invoice_label, report_label, tax_rate, taxable_base_currency_amount, dr_cr, base_currency_amount, creation_date, creation_actor_type)
      VALUES ($1,$2,$3,NULL,$4,$5,NULL,$6,$6,$7,$8,$9,$10,now(),'SYSTEM') RETURNING id`,
      [Number(header.rows[0].id), lineNumber, rule.id, ctx.taxAuthority.id, detail.tax_movement_type_code, detail.description, detail.tax_rate, detail.taxable_amount, detail.entry_type === "CREDIT" ? "CR" : "DR", detail.base_currency_amount]);
    rows.push({ ...detail, id: Number(inserted.rows[0].id), code: `${headerCode}-${lineNumber}`, status: "POSTED" });
  }
  return rows;
}

async function persist(client: DbExecutor, ctx: Context): Promise<TaxProcessingPostingResponseDto> {
  const journalRepo = new JournalRepo(client);
  const header = await journalRepo.insert({
    id: ctx.reservedJournalHeaderId ?? undefined,
    finance_company_id: ctx.company.id,
    company_code: ctx.company.code,
    company_name: ctx.company.name,
    document_type_code: ctx.documentType,
    document_type_label: LABELS[ctx.documentType],
    document_id: ctx.detailed.document_id,
    description: ctx.detailed.generated_description,
    document_snapshot_json: ctx.request,
    detailed_document_snapshot_json: ctx.detailed,
    posting_engine_code: ctx.documentType,
    document_date: documentDate(ctx.documentType, ctx.request),
    posting_date: ctx.detailed.posting_date,
    financial_year_id: ctx.period.financial_year_id,
    financial_year_code: ctx.period.financial_year_code,
    financial_period_id: ctx.period.financial_period_id,
    financial_period_code: ctx.period.financial_period_code,
    base_currency_code: ctx.company.base_currency_code,
    memo: ctx.detailed.memo,
    ...toJournalBankCashFields(ctx.bankCashDetails),
  });
  const insertedLines: JournalLineRow[] = [];
  for (const line of ctx.journalLines) insertedLines.push(await journalRepo.insertLine({ journal_header_id: header.id, ...line }));
  const total = totals(ctx.journalLines);
  const posted = await journalRepo.setPosted(header.id, total.debit, total.credit);
  const taxRows = await insertTaxLedger(client, ctx, header.id);
  return response({ ...ctx, taxDetails: taxRows }, posted, insertedLines);
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function hasDimensions(input: unknown): boolean {
  return isRecord(input) && hasValue(input.dimensions);
}

function hasItems(input: unknown): boolean {
  return isRecord(input) && Array.isArray(input.items) && input.items.length > 0;
}

async function assertDocumentCapabilities(db: DbExecutor, documentType: TaxProcessingDocumentType, request: TaxProcessingRequestDto): Promise<void> {
  requiredString(request.company_code, "company_code");
  const processor = await one(db,
    `SELECT d.code, d.status, d.supports_dimensions, d.cash_movement, d.supports_items
       FROM financial_document_type d
      WHERE d.code = $1`,
    [documentType],
    documentProcessor,
  );
  if (!processor || processor.status !== "ACTIVE") throw new BusinessRuleError(`${documentType} document processor is not active`);
  if (isRecord(request) && hasValue(request.bank_cash_details) && !processor.cash_movement) {
    throw new BusinessRuleError(`${documentType} does not support bank_cash_details`);
  }
  if (hasDimensions(request) && !processor.supports_dimensions) {
    throw new BusinessRuleError(`${documentType} does not support dimensions`);
  }
  if (hasItems(request) && !processor.supports_items) {
    throw new BusinessRuleError(`${documentType} does not support items`);
  }
}

async function processTaxDocumentUnchecked(documentType: TaxProcessingDocumentType, input: TaxProcessingRequestDto, options: { preview?: boolean } = {}): Promise<TaxProcessingPostingResponseDto> {
  validateInput(documentType, input);
  await assertDocumentCapabilities(getDb(), documentType, input);
  const { request, reservedId } = await reserveDocumentId(documentType, input);
  const ctx = await buildContext(getDb(), documentType, request, reservedId);
  const total = totals(ctx.journalLines);
  if (total.debit !== total.credit) throw new BusinessRuleError(`${documentType} generated unbalanced journal lines`);
  if (options.preview) return response(ctx);
  return withTransaction(async (client) => persist(client, ctx));
}

export const processTaxDocument = processTaxDocumentUnchecked;
