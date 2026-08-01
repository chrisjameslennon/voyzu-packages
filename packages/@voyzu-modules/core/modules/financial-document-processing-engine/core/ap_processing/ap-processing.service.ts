import type { DrCr, EntryType } from "@voyzu-modules/core/types/modules/core";
import type { ApBillDetailedDocumentDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ap-bill.response.dto";
import type {
  ApAdjustmentRequestDto,
  ApCreditNoteRequestDto,
  ApOpeningBalanceRequestDto,
  ApRefundRequestDto,
  ApWriteOffRequestDto,
} from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import type { ApBillCancellationRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ap-bill-cancellation.request.dto";
import type { ApPaymentApplicationRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ap-payment-application.request.dto";
import type { ApPaymentRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ap-payment.request.dto";
import type {
  ApProcessingDocumentType,
  ApProcessingPostingResponseDto,
  ApProcessingSubledgerDetailDto,
  ApProcessingTaxLedgerDetailDto,
} from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ap-processing.response.dto";
import type { BankCashJournalDetailsDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/bank-cash-details.dto";
import { getDb, type DbExecutor, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { InsertJournalLineRow, JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import { resolveBankCashDetails, toJournalBankCashFields } from "../../../common/bank-cash-accounts/server/lib/bank-cash-account.service";
import {
  AP_BILL_PURCHASE_POSTING_CODE,
  AP_CREDIT_NOTE_PURCHASE_POSTING_CODE,
  AP_OPENING_BALANCE_EQUITY_ACCOUNT_POSTING_CODE,
  AP_PAYMENT_CASH_POSTING_CODE,
  AP_REFUND_CASH_POSTING_CODE,
  AP_TAX_ON_PURCHASES_CONTROL_CODE,
  AP_TRADE_CONTROL_CODE,
  AP_UNAPPLIED_CONTROL_CODE,
  AP_WRITE_OFF_INCOME_POSTING_CODE,
} from "./journal-posting-component-constants";

const AP_TRADE = AP_TRADE_CONTROL_CODE;
const AP_UNAPPLIED = AP_UNAPPLIED_CONTROL_CODE;
const TAX_ON_PURCHASES = AP_TAX_ON_PURCHASES_CONTROL_CODE;

const LABELS: Record<ApProcessingDocumentType, string> = {
  AP_CREDIT_NOTE: "Supplier Credit Note",
  AP_OPENING_BALANCE: "AP Opening Balance",
  AP_PAYMENT: "Supplier Payment",
  AP_PAYMENT_APPLICATION: "Supplier Payment Application",
  AP_REFUND: "Supplier Refund",
  AP_WRITE_OFF: "Payable Write-off",
  AP_BILL_CANCELLATION: "Bill Withdrawal",
};

type RequestDto = ApAdjustmentRequestDto | ApPaymentRequestDto | ApPaymentApplicationRequestDto | ApBillCancellationRequestDto;
type PendingJournalLine = Omit<InsertJournalLineRow, "journal_header_id">;
type Account = {
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  code?: string;
  bank_cash_control_account_code?: string;
  control_account_code?: string;
  control_account_name?: string;
};
type Company = { id: number; code: string; name: string; country_code: string; base_currency_code: string; status: string };
type Counterparty = { id: number; company_id: number; code: string; name: string; status: "ACTIVE" | "INACTIVE"; country_code: string; tax_region_or_province: string | null };
type Period = { financial_year_id: number; financial_year_code: string; financial_period_id: number; financial_period_code: string };
type OpenItem = { id: number; code: string; document_type_code: string; document_id: string; journal_code: string; open_amount: number; original_bill?: ApBillDetailedDocumentDto | null };
type DocumentProcessor = { code: string; status: string; supports_dimensions: boolean; cash_movement: boolean; supports_items: boolean };
type TaxRule = {
  id: number;
  code: string;
  country_code: string;
  invoice_label: string;
  report_label: string;
  calculation_method: "NO_TAX" | "CONFIGURED_COMPONENTS" | "CALLER_SUPPLIED";
  component_count: number;
  status: "ACTIVE" | "INACTIVE";
};
type TaxAuthority = { id: number; code: string; name: string; country_code: string; status: "ACTIVE" | "INACTIVE" };
type TaxComponent = {
  id: number;
  code: string;
  tax_rule_country_code: string;
  tax_rule_code: string;
  tax_authority_id: number;
  tax_authority_code: string;
  tax_authority_name: string;
  scheme_code: string;
  invoice_label: string;
  report_label: string;
  rate: number;
  status: "ACTIVE" | "INACTIVE";
};
type Context = {
  documentType: ApProcessingDocumentType;
  request: RequestDto & { document_id: string };
  company: Company;
  counterparty: Counterparty;
  period: Period;
  detailed: Record<string, unknown> & { document_id: string; memo: string | null; generated_description: string; posting_date: string };
  journalLines: PendingJournalLine[];
  apDetails: ApProcessingSubledgerDetailDto[];
  taxDetails: ApProcessingTaxLedgerDetailDto[];
  bankCashDetails: BankCashJournalDetailsDto | null;
  reservedJournalHeaderId: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function amount(value: number | string | null | undefined): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new InputValidationError("amount must be numeric");
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function requiredString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") throw new InputValidationError(`${path} is required`);
  return value;
}

function documentId(value: unknown, path: string): string {
  const v = requiredString(value, path);
  if (!/^[A-Za-z0-9_-]{1,20}$/.test(v)) throw new InputValidationError(`${path} must use alphanumeric characters, underscore, or dash, with 20 characters maximum`);
  return v;
}

function date(value: unknown, path: string): string {
  const v = requiredString(value, path);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new InputValidationError(`${path} must be an ISO date (YYYY-MM-DD)`);
  return v;
}

function postingDate(request: { posting_date?: string | null }, fallback: string): string {
  return request.posting_date ? date(request.posting_date, "posting_date") : fallback;
}

async function reserveDocumentId(documentType: ApProcessingDocumentType, request: RequestDto): Promise<{ request: RequestDto & { document_id: string }; reservedId: number | null }> {
  if (typeof request.document_id === "string" && request.document_id.trim()) return { request: request as RequestDto & { document_id: string }, reservedId: null };
  const id = await new JournalRepo(getDb()).reserveHeaderId();
  const prefixes: Record<ApProcessingDocumentType, string> = {
    AP_CREDIT_NOTE: "CN",
    AP_OPENING_BALANCE: "AP-OB",
    AP_PAYMENT: "PAY",
    AP_PAYMENT_APPLICATION: "APP",
    AP_REFUND: "REF",
    AP_WRITE_OFF: "WO",
    AP_BILL_CANCELLATION: "BILL-WD",
  };
  return { request: { ...request, document_id: `${prefixes[documentType]}-${id}` }, reservedId: id };
}

async function one<T>(db: DbExecutor, sql: string, params: unknown[], map: (row: Record<string, unknown>) => T): Promise<T | null> {
  const { rows } = await db.query(sql, params);
  return rows[0] ? map(rows[0] as Record<string, unknown>) : null;
}

function company(row: Record<string, unknown>): Company {
  return { id: Number(row.id), code: String(row.code), name: String(row.name), country_code: String(row.country_code), base_currency_code: String(row.base_currency_code), status: String(row.status) };
}

function counterparty(row: Record<string, unknown>): Counterparty {
  return { id: Number(row.id), company_id: Number(row.company_id), code: String(row.code), name: String(row.name), status: row.status as "ACTIVE" | "INACTIVE", country_code: String(row.country_code), tax_region_or_province: row.tax_region_or_province == null ? null : String(row.tax_region_or_province) };
}

function period(row: Record<string, unknown>): Period {
  return { financial_year_id: Number(row.financial_year_id), financial_year_code: String(row.financial_year_code), financial_period_id: Number(row.financial_period_id), financial_period_code: String(row.financial_period_code) };
}

function documentProcessor(row: Record<string, unknown>): DocumentProcessor {
  return { code: String(row.code), status: String(row.status), supports_dimensions: Boolean(row.supports_dimensions), cash_movement: Boolean(row.cash_movement), supports_items: Boolean(row.supports_items) };
}

function taxRule(row: Record<string, unknown>): TaxRule {
  return {
    id: Number(row.id),
    code: String(row.code),
    country_code: String(row.country_code),
    invoice_label: String(row.invoice_label),
    report_label: String(row.report_label),
    calculation_method: row.calculation_method as TaxRule["calculation_method"],
    component_count: Number(row.component_count),
    status: row.status as "ACTIVE" | "INACTIVE",
  };
}

function taxAuthority(row: Record<string, unknown>): TaxAuthority {
  return { id: Number(row.id), code: String(row.code), name: String(row.name), country_code: String(row.country_code), status: row.status as "ACTIVE" | "INACTIVE" };
}

function taxComponent(row: Record<string, unknown>): TaxComponent {
  return {
    id: Number(row.id),
    code: String(row.code),
    tax_rule_country_code: String(row.tax_rule_country_code),
    tax_rule_code: String(row.tax_rule_code),
    tax_authority_id: Number(row.tax_authority_id),
    tax_authority_code: String(row.tax_authority_code),
    tax_authority_name: String(row.tax_authority_name),
    scheme_code: String(row.scheme_code),
    invoice_label: String(row.invoice_label),
    report_label: String(row.report_label),
    rate: Number(row.rate),
    status: row.status as "ACTIVE" | "INACTIVE",
  };
}

function account(row: Record<string, unknown>): Account {
  return {
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    code: row.code == null ? undefined : String(row.code),
    bank_cash_control_account_code: row.bank_cash_control_account_code == null ? undefined : String(row.bank_cash_control_account_code),
    control_account_code: row.control_account_code == null ? undefined : String(row.control_account_code),
    control_account_name: row.control_account_name == null ? undefined : String(row.control_account_name),
  };
}

function openItem(row: Record<string, unknown>): OpenItem {
  return { id: Number(row.id), code: String(row.code), document_type_code: String(row.document_type_code), document_id: String(row.document_id), journal_code: String(row.journal_code), open_amount: Number(row.open_amount), original_bill: row.original_bill == null ? null : row.original_bill as ApBillDetailedDocumentDto };
}

async function base(db: DbExecutor, request: RequestDto, postingDateValue: string, documentType: ApProcessingDocumentType): Promise<{ company: Company; counterparty: Counterparty; period: Period; documentProcessor: DocumentProcessor }> {
  const companyCode = requiredString(request.company_code, "company_code");
  const c = await one(db, `SELECT id, code, name, country_code, base_currency_code, status FROM company WHERE code = $1`, [companyCode], company);
  if (!c) throw new BusinessRuleError(`Company ${companyCode} was not found`);
  if (c.status !== "ACTIVE") throw new BusinessRuleError(`Company ${c.code} is not ACTIVE`);
  const processor = await one(db, `SELECT code, status, supports_dimensions, cash_movement, supports_items FROM financial_document_type WHERE code = $1`, [documentType], documentProcessor);
  if (!processor || processor.status !== "ACTIVE") throw new BusinessRuleError(`${documentType} document processor is not active`);
  const cpCode = requiredString(request.ap_counterparty_code, "ap_counterparty_code");
  const cp = await one(db, `SELECT * FROM ap_counterparty WHERE company_id = $1 AND code = $2`, [c.id, cpCode], counterparty);
  if (!cp) throw new BusinessRuleError(`AP counterparty ${cpCode} was not found`);
  if (cp.status !== "ACTIVE") throw new BusinessRuleError(`AP counterparty ${cp.code} is not ACTIVE`);
  const p = await one(db, `SELECT fy.id AS financial_year_id, fy.code AS financial_year_code, fp.id AS financial_period_id, fp.code AS financial_period_code
    FROM fiscal_period fp JOIN fiscal_year fy ON fy.id = fp.fiscal_year_id
    WHERE fp.company_id = $1 AND $2::date BETWEEN fp.start_date AND fp.end_date AND fp.status = 'OPEN' AND fy.status = 'OPEN'
    LIMIT 1`, [c.id, postingDateValue], period);
  if (!p) throw new BusinessRuleError(`No OPEN fiscal period contains posting date ${postingDateValue}`);
  return { company: c, counterparty: cp, period: p, documentProcessor: processor };
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function hasDimensions(input: unknown): boolean {
  return isRecord(input) && hasValue(input.dimensions);
}

function hasItems(input: unknown): boolean {
  if (!isRecord(input)) return false;
  if (Array.isArray(input.items) && input.items.length > 0) return true;
  if (Array.isArray(input.lines) && input.lines.length > 0) return true;
  return false;
}

function assertDocumentCapabilities(documentType: ApProcessingDocumentType, input: unknown, processor: DocumentProcessor): void {
  if (isRecord(input) && hasValue(input.bank_cash_details) && !processor.cash_movement) {
    throw new BusinessRuleError(`${documentType} does not support bank_cash_details`);
  }
  if (hasDimensions(input) && !processor.supports_dimensions) {
    throw new BusinessRuleError(`${documentType} does not support dimensions`);
  }
  if (hasItems(input) && !processor.supports_items) {
    throw new BusinessRuleError(`${documentType} does not support items`);
  }
}

async function control(db: DbExecutor, companyId: number, code: typeof AP_TRADE | typeof AP_UNAPPLIED): Promise<Account> {
  const acc = await one(db, `SELECT ca.code AS control_account_code, ca.name AS control_account_name, ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
    FROM ap_control_account ca JOIN gl_account ga ON ga.company_id = ca.company_id AND ga.id = ca.gl_account_id
    WHERE ca.company_id = $1 AND ca.code = $2 AND ca.status = 'ACTIVE' AND ga.status = 'ACTIVE'`, [companyId, code], account);
  if (!acc) throw new BusinessRuleError(`${code} control account is not configured`);
  return acc;
}

async function postingCode(db: DbExecutor, companyId: number, doc: ApProcessingDocumentType | "AP_BILL", defaultCode: string, requested?: string | null): Promise<Account> {
  const defaultRow = await one(db, `SELECT target_type, allowed_account_types FROM financial_document_default WHERE company_id = $1 AND document_code = $2 AND code = $3 AND status = 'ACTIVE' LIMIT 1`, [companyId, doc, defaultCode], (row) => ({
    target_type: String(row.target_type),
    allowed_account_types: row.allowed_account_types as string[],
  }));
  if (!defaultRow) throw new BusinessRuleError(`Financial document default ${defaultCode} was not resolved for ${doc}`);

  const row = requested
    ? defaultRow.target_type === "BANK_CASH_ACCOUNT"
      ? await one(db, `SELECT $3::text AS code, bca.code AS bank_cash_control_account_code,
             bca.gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
          FROM bank_cash_control_account bca
          JOIN gl_account ga ON ga.company_id = bca.company_id AND ga.id = bca.gl_account_id
          WHERE bca.company_id = $1
            AND bca.code = $2
            AND bca.status = 'ACTIVE'
            AND ga.status = 'ACTIVE'
            AND ga.account_type = ANY($4::text[])
          LIMIT 1`, [companyId, requested, defaultCode, defaultRow.allowed_account_types], account)
      : await one(db, `SELECT $3::text AS code, ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
          FROM gl_account ga
          WHERE ga.company_id = $1
            AND ga.code = $2
            AND ga.status = 'ACTIVE'
            AND ga.account_type = ANY($4::text[])
          LIMIT 1`, [companyId, requested, defaultCode, defaultRow.allowed_account_types], account)
    : await one(db, `SELECT pc.code, bca.code AS bank_cash_control_account_code,
             COALESCE(pc.gl_account_id, bca.gl_account_id) AS gl_account_id,
             ga.code AS gl_account_code, ga.name AS gl_account_name
      FROM financial_document_default pc
      LEFT JOIN bank_cash_control_account bca ON bca.company_id = pc.company_id AND bca.id = pc.bank_cash_control_account_id
      JOIN gl_account ga ON ga.company_id = pc.company_id AND ga.id = COALESCE(pc.gl_account_id, bca.gl_account_id)
      WHERE pc.company_id = $1
        AND pc.document_code = $2
        AND pc.code = $3
        AND pc.status = 'ACTIVE'
        AND (bca.id IS NULL OR bca.status = 'ACTIVE')
        AND ga.status = 'ACTIVE'
      LIMIT 1`, [companyId, doc, defaultCode], account);
  if (!row) throw new BusinessRuleError(`${requested ? "Override" : "Default"} account ${requested ?? defaultCode} was not resolved for ${doc}`);
  return row;
}

async function listTaxRules(db: DbExecutor, countryCode: string, codes: string[]): Promise<TaxRule[]> {
  if (codes.length === 0) return [];
  const { rows } = await db.query(
    `SELECT *
     FROM tax_rule
     WHERE country_code = $1
       AND code = ANY($2::text[])`,
    [countryCode, codes],
  );
  return rows.map((row: Record<string, unknown>) => taxRule(row));
}

async function listTaxComponents(db: DbExecutor, countryCode: string, taxRuleCodes: string[]): Promise<TaxComponent[]> {
  if (taxRuleCodes.length === 0) return [];
  const { rows } = await db.query(
    `SELECT
       tc.*,
       ta.id AS tax_authority_id,
       ta.name AS tax_authority_name
     FROM tax_component tc
     JOIN tax_authority ta ON ta.code = tc.tax_authority_code
     WHERE tc.tax_rule_country_code = $1
       AND tc.tax_rule_code = ANY($2::text[])
     ORDER BY tc.tax_rule_code ASC, tc.calculation_order ASC`,
    [countryCode, taxRuleCodes],
  );
  return rows.map((row: Record<string, unknown>) => taxComponent(row));
}

async function listTaxAuthorities(db: DbExecutor, countryCode: string, codes: string[]): Promise<TaxAuthority[]> {
  if (codes.length === 0) return [];
  const { rows } = await db.query(
    `SELECT id, code, name, country_code, status
     FROM tax_authority
     WHERE country_code = $1
       AND code = ANY($2::text[])`,
    [countryCode, codes],
  );
  return rows.map((row: Record<string, unknown>) => taxAuthority(row));
}

function mapByCode<T extends { code: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.code, row]));
}

function mapTaxComponentsByRule(rows: TaxComponent[]): Map<string, TaxComponent[]> {
  const map = new Map<string, TaxComponent[]>();
  for (const row of rows) {
    const existing = map.get(row.tax_rule_code) ?? [];
    existing.push(row);
    map.set(row.tax_rule_code, existing);
  }
  return map;
}

async function openBill(db: DbExecutor, companyId: number, counterpartyId: number, docId: string): Promise<OpenItem | null> {
  return one(db, `SELECT e.id, e.code, h.document_type_code, h.document_id, h.code AS journal_code, h.detailed_document_snapshot_json AS original_bill,
      GREATEST(COALESCE(bill.amount, 0) - COALESCE(applied.amount, 0), 0)::float AS open_amount
    FROM ap_subledger_entry_header e
    JOIN journal_header h ON h.id = e.journal_header_id
    LEFT JOIN LATERAL (SELECT SUM(base_currency_amount) AS amount FROM ap_subledger_entry_line l WHERE l.ap_subledger_entry_header_id = e.id AND l.control_account_code = $4 AND l.dr_cr = 'CR') bill ON true
    LEFT JOIN LATERAL (SELECT SUM(base_currency_amount) AS amount FROM ap_subledger_entry_line l WHERE l.target_entry_header_id = e.id AND l.control_account_code = $4 AND l.dr_cr = 'DR') applied ON true
    WHERE e.company_id = $1 AND e.ap_counterparty_id = $2 AND h.document_type_code IN ('AP_BILL', 'AP_OPENING_BALANCE') AND h.document_id = $3
    LIMIT 1`, [companyId, counterpartyId, docId, AP_TRADE], openItem);
}

async function openPayment(db: DbExecutor, companyId: number, counterpartyId: number, docId: string): Promise<OpenItem | null> {
  return one(db, `SELECT e.id, e.code, h.document_type_code, h.document_id, h.code AS journal_code,
      GREATEST(COALESCE(pay.amount, 0) - COALESCE(used.amount, 0), 0)::float AS open_amount
    FROM ap_subledger_entry_header e
    JOIN journal_header h ON h.id = e.journal_header_id
    LEFT JOIN LATERAL (SELECT SUM(base_currency_amount) AS amount FROM ap_subledger_entry_line l WHERE l.ap_subledger_entry_header_id = e.id AND l.control_account_code = $4 AND l.dr_cr = 'DR') pay ON true
    LEFT JOIN LATERAL (SELECT SUM(base_currency_amount) AS amount FROM ap_subledger_entry_line l WHERE l.source_entry_header_id = e.id AND l.control_account_code = $4 AND l.dr_cr = 'CR') used ON true
    WHERE e.company_id = $1 AND e.ap_counterparty_id = $2 AND h.document_type_code IN ('AP_PAYMENT', 'AP_CREDIT_NOTE') AND h.document_id = $3
    LIMIT 1`, [companyId, counterpartyId, docId, AP_UNAPPLIED], openItem);
}

async function unappliedBalance(db: DbExecutor, companyId: number, counterpartyId: number): Promise<number> {
  const { rows } = await db.query(`SELECT GREATEST(COALESCE(SUM(CASE
    WHEN l.control_account_code = $3 AND l.dr_cr = 'DR' THEN l.base_currency_amount
    WHEN l.control_account_code = $3 AND l.dr_cr = 'CR' THEN -l.base_currency_amount
    ELSE 0 END), 0), 0)::float AS amount
    FROM ap_subledger_entry_header e JOIN ap_subledger_entry_line l ON l.ap_subledger_entry_header_id = e.id
    WHERE e.company_id = $1 AND e.ap_counterparty_id = $2`, [companyId, counterpartyId, AP_UNAPPLIED]);
  return Number(rows[0]?.amount ?? 0);
}

function postingCodeSource(acc: Account): { sourceLedger: string | null; sourceControlAccount: string | null } {
  if (acc.bank_cash_control_account_code) return { sourceLedger: "BANK_CASH", sourceControlAccount: acc.bank_cash_control_account_code };
  if (acc.code) return { sourceLedger: "POSTING_CODE", sourceControlAccount: acc.code };
  return { sourceLedger: null, sourceControlAccount: null };
}

function creditNoteTaxComponents(
  line: ApCreditNoteRequestDto["lines"][number],
  taxableAmount: number,
  rule: TaxRule,
  configuredComponents: TaxComponent[],
  authoritiesByCode: Map<string, TaxAuthority>,
  taxRecoverable: boolean,
): ApProcessingTaxLedgerDetailDto[] {
  if (rule.calculation_method === "NO_TAX") return [];

  if (line.tax_rule === "CALLER_SUPPLIED") {
    return (line.tax_components ?? []).map((component) => {
      const authority = authoritiesByCode.get(component.tax_authority_code);
      if (!authority) throw new BusinessRuleError(`Tax authority ${component.tax_authority_code} was not resolved`);
      const taxAmount = round(taxableAmount * component.tax_rate);
      return {
        id: null,
        code: null,
        tax_rule: rule.code,
        tax_component_id: null,
        tax_authority_code: authority.code,
        tax_authority_name: authority.name,
        tax_movement_type_code: TAX_ON_PURCHASES,
        description: component.invoice_label ?? rule.invoice_label,
        scheme_code: null,
        invoice_label: component.invoice_label ?? rule.invoice_label,
        report_label: rule.report_label,
        tax_rate: component.tax_rate,
        taxable_amount: taxableAmount,
        posting_date: "",
        financial_year_code: "",
        financial_period_code: "",
        base_currency_code: "",
        entry_type: "CREDIT" as const,
        base_currency_amount: taxRecoverable ? taxAmount : 0,
        status: "EPHEMERAL" as const,
      };
    }).filter((component) => component.base_currency_amount > 0);
  }

  return configuredComponents.map((component) => {
    const taxAmount = round(taxableAmount * component.rate);
    return {
      id: null,
      code: null,
      tax_rule: rule.code,
      tax_component_id: component.id,
      tax_authority_code: component.tax_authority_code,
      tax_authority_name: component.tax_authority_name,
      tax_movement_type_code: TAX_ON_PURCHASES,
      description: component.invoice_label,
      scheme_code: component.scheme_code,
      invoice_label: component.invoice_label,
      report_label: component.report_label,
      tax_rate: component.rate,
      taxable_amount: taxableAmount,
      posting_date: "",
      financial_year_code: "",
      financial_period_code: "",
      base_currency_code: "",
      entry_type: "CREDIT" as const,
      base_currency_amount: taxRecoverable ? taxAmount : 0,
      status: "EPHEMERAL" as const,
    };
  }).filter((component) => component.base_currency_amount > 0);
}

function gl(line_number: number, acc: Account, dr_cr: DrCr, value: number, description: string, memo: string | null, sourceLedger: string | null = null, sourceControlAccount: string | null = null): PendingJournalLine {
  const inferredSource = sourceLedger == null && sourceControlAccount == null ? postingCodeSource(acc) : { sourceLedger, sourceControlAccount };
  return {
    line_number,
    gl_account_id: acc.gl_account_id,
    gl_account_code: acc.gl_account_code,
    gl_account_name: acc.gl_account_name,
    source_ledger: inferredSource.sourceLedger,
    source_control_account: inferredSource.sourceControlAccount,
    dr_cr,
    base_currency_amount: value,
    description,
    memo,
  };
}

function apGl(line_number: number, acc: Account, dr_cr: DrCr, value: number, description: string, memo: string | null, controlCode: typeof AP_TRADE | typeof AP_UNAPPLIED): PendingJournalLine {
  return gl(line_number, acc, dr_cr, value, description, memo, "ACCOUNTS_PAYABLE", controlCode);
}

function bankGl(line_number: number, acc: Account, dr_cr: DrCr, value: number, description: string, memo: string | null): PendingJournalLine {
  return gl(line_number, acc, dr_cr, value, description, memo, "BANK_CASH", acc.bank_cash_control_account_code ?? acc.code ?? null);
}

function taxGl(line_number: number, acc: Account, dr_cr: DrCr, value: number, description: string, memo: string | null): PendingJournalLine {
  return gl(line_number, acc, dr_cr, value, description, memo, "TAX", TAX_ON_PURCHASES);
}

function apDetail(ctx: Context, controlCode: typeof AP_TRADE | typeof AP_UNAPPLIED, entryType: EntryType, value: number, target: number | null = null, source: number | null = null): ApProcessingSubledgerDetailDto {
  return { id: null, code: null, company_code: ctx.company.code, journal_header_id: null, ap_counterparty_code: ctx.counterparty.code, control_account_code: controlCode, source_entry_header_id: source, applied_to_ap_subledger_entry_id: target, posting_date: ctx.detailed.posting_date, financial_year_code: ctx.period.financial_year_code, financial_period_code: ctx.period.financial_period_code, base_currency_code: ctx.company.base_currency_code, entry_type: entryType, base_currency_amount: value, memo: ctx.detailed.memo, status: "EPHEMERAL" };
}

function response(ctx: Context, header: JournalHeaderRow | null = null, lines: JournalLineRow[] | null = null): ApProcessingPostingResponseDto {
  const debit = round(ctx.journalLines.filter((l) => l.dr_cr === "DR").reduce((s, l) => s + l.base_currency_amount, 0));
  const credit = round(ctx.journalLines.filter((l) => l.dr_cr === "CR").reduce((s, l) => s + l.base_currency_amount, 0));
  return {
    detailed_document: ctx.detailed,
    ap_subledger_details: ctx.apDetails,
    tax_ledger_details: ctx.taxDetails,
    posting_details: {
      journal_header: { id: header?.id ?? null, code: header?.code ?? null, document_type_code: ctx.documentType, document_id: ctx.detailed.document_id, generated_description: ctx.detailed.generated_description, posting_engine_code: ctx.documentType, company_code: ctx.company.code, document_date: documentDate(ctx), posting_date: ctx.detailed.posting_date, financial_year_code: ctx.period.financial_year_code, financial_period_code: ctx.period.financial_period_code, base_currency_code: ctx.company.base_currency_code, total_debit_base_amount: debit, total_credit_base_amount: credit, memo: ctx.detailed.memo, status: header ? "POSTED" : "EPHEMERAL" },
      journal_lines: (lines ?? ctx.journalLines.map((l) => ({ id: null, journal_header_id: null, ...l }))).map((l) => ({ id: l.id ?? null, journal_header_id: l.journal_header_id ?? null, line_number: l.line_number, gl_account_code: l.gl_account_code, gl_account_name: l.gl_account_name, source_ledger: l.source_ledger ?? null, source_control_account: l.source_control_account ?? null, dr_cr: l.dr_cr as DrCr, base_currency_amount: l.base_currency_amount, description: l.description, memo: l.memo ?? null })),
    },
  };
}

function documentDate(ctx: Context): string {
  const d = ctx.detailed as Record<string, unknown>;
  return String(d.credit_note_date ?? d.opening_balance_date ?? d.payment_date ?? d.application_date ?? d.refund_date ?? d.write_off_date ?? d.cancellation_date);
}

async function buildPayment(db: DbExecutor, request: ApPaymentRequestDto & { document_id: string }, reservedId: number | null): Promise<Context> {
  const paymentDate = date(request.payment_date, "payment_date");
  const pd = postingDate(request, paymentDate);
  const b = await base(db, request, pd, "AP_PAYMENT");
  assertDocumentCapabilities("AP_PAYMENT", request, b.documentProcessor);
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(b.company.id);
  const cash = await postingCode(db, settingsCompanyId, "AP_PAYMENT", AP_PAYMENT_CASH_POSTING_CODE, request.bank_cash_account_code);
  const bankCashDetails = await resolveBankCashDetails(b.company.id, b.company.base_currency_code, request.bank_cash_details);
  if (bankCashDetails && bankCashDetails.gl_account_id !== cash.gl_account_id) {
    throw new BusinessRuleError(`bank_cash_details.code ${bankCashDetails.code} GL account does not match bank_cash_account_code ${cash.bank_cash_control_account_code ?? cash.code}`);
  }
  const trade = await control(db, settingsCompanyId, AP_TRADE);
  const unapplied = await control(db, settingsCompanyId, AP_UNAPPLIED);
  const allocations = [];
  let requested = 0;
  let applied = 0;
  for (const [i, a] of (request.allocations ?? []).entries()) {
    const docId = documentId(a.document_id, `allocations[${i}].document_id`);
    const value = amount(a.amount);
    const bill = await openBill(db, b.company.id, b.counterparty.id, docId);
    if (!bill || bill.open_amount <= 0) throw new BusinessRuleError(`Open bill ${docId} was not found`);
    const appliedAmount = round(Math.min(value, bill.open_amount));
    requested = round(requested + value);
    applied = round(applied + appliedAmount);
    allocations.push({ bill, requested_amount: value, applied_amount: appliedAmount, surplus_to_unapplied_amount: round(value - appliedAmount) });
  }
  const paymentAmount = round(request.payment_amount == null ? requested : amount(request.payment_amount));
  if (paymentAmount <= 0) throw new InputValidationError("payment_amount must be greater than zero");
  if (paymentAmount < requested) throw new InputValidationError("payment_amount is less than the sum of allocation amounts");
  const unappliedAmount = round(paymentAmount - applied);
  const detailed = { document_type: "AP_PAYMENT", company: { code: b.company.code, base_currency_code: b.company.base_currency_code }, ap_counterparty: { code: b.counterparty.code, name: b.counterparty.name }, document_id: request.document_id, memo: request.memo ?? null, generated_description: `Supplier Payment ${request.document_id}`, payment_date: paymentDate, posting_date: pd, bank_cash_account_code: cash.bank_cash_control_account_code ?? "", bank_cash_details: bankCashDetails, payment_amount: paymentAmount, applied_amount: applied, unapplied_amount: unappliedAmount, allocations: allocations.map((x) => ({ bill_document_id: x.bill.document_id, bill_ap_subledger_entry_id: x.bill.id, requested_amount: x.requested_amount, applied_amount: x.applied_amount, surplus_to_unapplied_amount: x.surplus_to_unapplied_amount })) };
  const lines = [apGl(1, trade, "DR", applied, detailed.generated_description, detailed.memo, AP_TRADE), ...(unappliedAmount > 0 ? [apGl(2, unapplied, "DR", unappliedAmount, detailed.generated_description, detailed.memo, AP_UNAPPLIED)] : []), bankGl(unappliedAmount > 0 ? 3 : 2, cash, "CR", paymentAmount, detailed.generated_description, detailed.memo)];
  const ctx: Context = { documentType: "AP_PAYMENT", request, company: b.company, counterparty: b.counterparty, period: b.period, detailed, journalLines: lines.filter((l) => l.base_currency_amount > 0), apDetails: [], taxDetails: [], bankCashDetails, reservedJournalHeaderId: reservedId };
  ctx.apDetails = [...allocations.filter((x) => x.applied_amount > 0).map((x) => apDetail(ctx, AP_TRADE, "DEBIT", x.applied_amount, x.bill.id)), ...(unappliedAmount > 0 ? [apDetail(ctx, AP_UNAPPLIED, "DEBIT", unappliedAmount)] : [])];
  return ctx;
}

async function buildPaymentApplication(db: DbExecutor, request: ApPaymentApplicationRequestDto & { document_id: string }, reservedId: number | null): Promise<Context> {
  const appDate = date(request.application_date, "application_date");
  const pd = postingDate(request, appDate);
  const b = await base(db, request, pd, "AP_PAYMENT_APPLICATION");
  assertDocumentCapabilities("AP_PAYMENT_APPLICATION", request, b.documentProcessor);
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(b.company.id);
  const trade = await control(db, settingsCompanyId, AP_TRADE);
  const unapplied = await control(db, settingsCompanyId, AP_UNAPPLIED);
  let total = 0;
  const apps = [];
  for (const [i, a] of request.applications.entries()) {
    const sourceId = documentId(a.source_payment?.document_id, `applications[${i}].source_payment.document_id`);
    const targetId = documentId(a.target_bill?.document_id, `applications[${i}].target_bill.document_id`);
    const value = amount(a.amount);
    const source = await openPayment(db, b.company.id, b.counterparty.id, sourceId);
    const target = await openBill(db, b.company.id, b.counterparty.id, targetId);
    if (!source || source.open_amount <= 0) throw new BusinessRuleError(`Open unapplied payment ${sourceId} was not found`);
    if (!target || target.open_amount <= 0) throw new BusinessRuleError(`Open bill ${targetId} was not found`);
    if (value > source.open_amount) throw new BusinessRuleError(`Application exceeds source payment ${sourceId} unapplied balance`);
    if (value > target.open_amount) throw new BusinessRuleError(`Application exceeds target bill ${targetId} open balance`);
    total = round(total + value);
    apps.push({ source, target, amount: value });
  }
  const detailed = { document_type: "AP_PAYMENT_APPLICATION", company: { code: b.company.code, base_currency_code: b.company.base_currency_code }, ap_counterparty: { code: b.counterparty.code, name: b.counterparty.name }, document_id: request.document_id, memo: request.memo ?? null, generated_description: `Supplier Payment Application ${request.document_id}`, application_date: appDate, posting_date: pd, applications: apps.map((a) => ({ source_payment_document_id: a.source.document_id, target_bill_document_id: a.target.document_id, amount: a.amount })), total_application_amount: total };
  const ctx: Context = { documentType: "AP_PAYMENT_APPLICATION", request, company: b.company, counterparty: b.counterparty, period: b.period, detailed, journalLines: [apGl(1, unapplied, "CR", total, detailed.generated_description, detailed.memo, AP_UNAPPLIED), apGl(2, trade, "DR", total, detailed.generated_description, detailed.memo, AP_TRADE)], apDetails: [], taxDetails: [], bankCashDetails: null, reservedJournalHeaderId: reservedId };
  ctx.apDetails = apps.flatMap((a) => [apDetail(ctx, AP_UNAPPLIED, "CREDIT", a.amount, null, a.source.id), apDetail(ctx, AP_TRADE, "DEBIT", a.amount, a.target.id)]);
  return ctx;
}

async function buildSimpleAdjustment(db: DbExecutor, documentType: ApProcessingDocumentType, request: RequestDto & { document_id: string }, reservedId: number | null): Promise<Context> {
  if (documentType === "AP_PAYMENT") return buildPayment(db, request as ApPaymentRequestDto & { document_id: string }, reservedId);
  if (documentType === "AP_PAYMENT_APPLICATION") return buildPaymentApplication(db, request as ApPaymentApplicationRequestDto & { document_id: string }, reservedId);
  const dateField = documentType === "AP_CREDIT_NOTE" ? "credit_note_date" : documentType === "AP_OPENING_BALANCE" ? "opening_balance_date" : documentType === "AP_REFUND" ? "refund_date" : documentType === "AP_WRITE_OFF" ? "write_off_date" : "cancellation_date";
  const docDate = date((request as unknown as Record<string, unknown>)[dateField], dateField);
  const pd = postingDate(request, docDate);
  const b = await base(db, request, pd, documentType);
  assertDocumentCapabilities(documentType, request, b.documentProcessor);
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(b.company.id);
  const trade = await control(db, settingsCompanyId, AP_TRADE);
  const unapplied = await control(db, settingsCompanyId, AP_UNAPPLIED);
  const memo = (request as { memo?: string | null }).memo ?? null;

  if (documentType === "AP_REFUND") {
    const r = request as ApRefundRequestDto & { document_id: string };
    const cash = await postingCode(db, settingsCompanyId, "AP_REFUND", AP_REFUND_CASH_POSTING_CODE, r.bank_cash_account_code);
    const bankCashDetails = await resolveBankCashDetails(b.company.id, b.company.base_currency_code, r.bank_cash_details);
    if (bankCashDetails && bankCashDetails.gl_account_id !== cash.gl_account_id) {
      throw new BusinessRuleError(`bank_cash_details.code ${bankCashDetails.code} GL account does not match bank_cash_account_code ${cash.bank_cash_control_account_code ?? cash.code}`);
    }
    const value = amount(r.refund_amount);
    const available = round(await unappliedBalance(db, b.company.id, b.counterparty.id));
    if (available <= 0) throw new BusinessRuleError(`AP counterparty ${b.counterparty.code} has no open unapplied balance`);
    if (value > available) throw new BusinessRuleError(`refund_amount exceeds open unapplied balance for AP counterparty ${b.counterparty.code}`);
    const detailed = { document_type: documentType, company: { code: b.company.code, base_currency_code: b.company.base_currency_code }, ap_counterparty: { code: b.counterparty.code, name: b.counterparty.name }, document_id: r.document_id, memo, generated_description: `Supplier Refund ${r.document_id}`, refund_date: docDate, posting_date: pd, refund_amount: value, bank_cash_account_code: cash.bank_cash_control_account_code ?? "", bank_cash_details: bankCashDetails, unapplied_balance_before: available, unapplied_balance_after: round(available - value) };
    const ctx: Context = { documentType, request, company: b.company, counterparty: b.counterparty, period: b.period, detailed, journalLines: [bankGl(1, cash, "DR", value, detailed.generated_description, memo), apGl(2, unapplied, "CR", value, detailed.generated_description, memo, AP_UNAPPLIED)], apDetails: [], taxDetails: [], bankCashDetails, reservedJournalHeaderId: reservedId };
    ctx.apDetails = [apDetail(ctx, AP_UNAPPLIED, "CREDIT", value)];
    return ctx;
  }

  if (documentType === "AP_OPENING_BALANCE") {
    const r = request as ApOpeningBalanceRequestDto & { document_id: string };
    if (r.dimensions) throw new BusinessRuleError("AP_OPENING_BALANCE does not support dimensions");
    const equity = await postingCode(db, settingsCompanyId, "AP_OPENING_BALANCE", AP_OPENING_BALANCE_EQUITY_ACCOUNT_POSTING_CODE, r.opening_balance_equity_posting_code);
    const items = r.items.map((item, i) => ({ line_id: item.line_id ?? i + 1, description: item.description, gross_amount: amount(item.gross_amount), external_reference: item.external_reference ?? null }));
    const total = round(items.reduce((s, i) => s + i.gross_amount, 0));
    const detailed = { document_type: documentType, company: { code: b.company.code, base_currency_code: b.company.base_currency_code }, ap_counterparty: { code: b.counterparty.code, name: b.counterparty.name }, document_id: r.document_id, memo, generated_description: `AP Opening Balance ${r.document_id}`, opening_balance_date: docDate, posting_date: pd, opening_balance_equity_posting_code: equity.gl_account_code, items, total_amount: total };
    const ctx: Context = { documentType, request, company: b.company, counterparty: b.counterparty, period: b.period, detailed, journalLines: [gl(1, equity, "DR", total, detailed.generated_description, memo), apGl(2, trade, "CR", total, detailed.generated_description, memo, AP_TRADE)], apDetails: [], taxDetails: [], bankCashDetails: null, reservedJournalHeaderId: reservedId };
    ctx.apDetails = [apDetail(ctx, AP_TRADE, "CREDIT", total)];
    return ctx;
  }

  if (documentType === "AP_WRITE_OFF") {
    const r = request as ApWriteOffRequestDto & { document_id: string };
    if (r.dimensions) throw new BusinessRuleError("AP_WRITE_OFF does not support dimensions");
    const income = await postingCode(db, settingsCompanyId, "AP_WRITE_OFF", AP_WRITE_OFF_INCOME_POSTING_CODE, r.write_off_income_posting_code);
    const apps = [];
    let total = 0;
    for (const [i, app] of r.applications.entries()) {
      const docId = documentId(app.target_bill?.document_id, `applications[${i}].target_bill.document_id`);
      const value = amount(app.amount);
      const bill = await openBill(db, b.company.id, b.counterparty.id, docId);
      if (!bill || bill.open_amount <= 0) throw new BusinessRuleError(`Open bill ${docId} was not found`);
      if (value > bill.open_amount) throw new BusinessRuleError(`Write-off application to ${docId} exceeds open amount`);
      total = round(total + value);
      apps.push({ bill, amount: value });
    }
    const detailed = { document_type: documentType, company: { code: b.company.code, base_currency_code: b.company.base_currency_code }, ap_counterparty: { code: b.counterparty.code, name: b.counterparty.name }, document_id: r.document_id, memo, generated_description: `Payable Write-off ${r.document_id}`, write_off_date: docDate, posting_date: pd, write_off_income_posting_code: income.gl_account_code, applications: apps.map((a) => ({ target_bill_document_id: a.bill.document_id, amount: a.amount })), total_write_off_amount: total };
    const ctx: Context = { documentType, request, company: b.company, counterparty: b.counterparty, period: b.period, detailed, journalLines: [apGl(1, trade, "DR", total, detailed.generated_description, memo, AP_TRADE), gl(2, income, "CR", total, detailed.generated_description, memo)], apDetails: [], taxDetails: [], bankCashDetails: null, reservedJournalHeaderId: reservedId };
    ctx.apDetails = apps.map((a) => apDetail(ctx, AP_TRADE, "DEBIT", a.amount, a.bill.id));
    return ctx;
  }

  if (documentType === "AP_BILL_CANCELLATION") {
    const r = request as ApBillCancellationRequestDto & { document_id: string };
    const sourceId = documentId(r.source_bill?.document_id, "source_bill.document_id");
    const bill = await openBill(db, b.company.id, b.counterparty.id, sourceId);
    if (!bill || bill.open_amount <= 0) throw new BusinessRuleError(`source_bill.document_id ${sourceId} was not found`);
    if (bill.document_type_code !== "AP_BILL") throw new InputValidationError("AP_BILL_CANCELLATION can only cancel an AP_BILL");
    const original = bill.original_bill;
    if (!original?.lines?.length) throw new InputValidationError(`source_bill.document_id ${sourceId} is missing a bill snapshot`);
    if (round(bill.open_amount) !== round(original.gross_amount)) throw new BusinessRuleError(`source_bill.document_id ${sourceId} must be fully open`);
    const purchaseLines = original.lines.map((line, i) => ({ accountCode: line.purchase_posting_code, amount: line.purchase_amount, description: line.line_description, line: i + 1 }));
    const accounts = await Promise.all(purchaseLines.map((l) => postingCode(db, settingsCompanyId, "AP_BILL", AP_BILL_PURCHASE_POSTING_CODE, l.accountCode)));
    const taxAccount = await taxControl(db, settingsCompanyId);
    const gross = round(original.gross_amount);
    const detailed = { document_type: documentType, company: { code: b.company.code, base_currency_code: b.company.base_currency_code }, ap_counterparty: { code: b.counterparty.code, name: b.counterparty.name }, document_id: r.document_id, memo, generated_description: `Bill Cancellation ${r.document_id}`, source_bill_document_id: bill.document_id, cancellation_date: docDate, posting_date: pd, gross_amount: gross };
    const tax = round(original.recoverable_tax_amount);
    const lines = [apGl(1, trade, "DR", gross, detailed.generated_description, memo, AP_TRADE), ...purchaseLines.map((l, i) => gl(i + 2, accounts[i], "CR", l.amount, l.description, memo)), ...(tax > 0 ? [taxGl(purchaseLines.length + 2, taxAccount, "CR", tax, detailed.generated_description, memo)] : [])];
    const ctx: Context = { documentType, request, company: b.company, counterparty: b.counterparty, period: b.period, detailed, journalLines: lines, apDetails: [], taxDetails: [], bankCashDetails: null, reservedJournalHeaderId: reservedId };
    ctx.apDetails = [apDetail(ctx, AP_TRADE, "DEBIT", gross, bill.id)];
    if (tax > 0) {
      ctx.taxDetails = original.lines
        .flatMap((line) => line.tax_components)
        .filter((component) => component.tax_recoverable && component.tax_amount > 0)
        .map((component) => ({
          id: null,
          code: null,
          tax_rule: component.tax_rule,
          tax_component_id: component.tax_component_id ?? null,
          tax_authority_code: component.tax_authority_code,
          tax_authority_name: component.tax_authority_name,
          tax_movement_type_code: TAX_ON_PURCHASES,
          description: component.invoice_label ?? component.tax_rule,
          scheme_code: component.scheme_code ?? null,
          invoice_label: component.invoice_label ?? null,
          report_label: component.report_label ?? null,
          tax_rate: component.tax_rate,
          taxable_amount: component.taxable_amount,
          posting_date: pd,
          financial_year_code: b.period.financial_year_code,
          financial_period_code: b.period.financial_period_code,
          base_currency_code: b.company.base_currency_code,
          entry_type: "CREDIT" as const,
          base_currency_amount: component.tax_amount,
          status: "EPHEMERAL" as const,
        }));
    }
    return ctx;
  }

  const r = request as ApCreditNoteRequestDto & { document_id: string };
  const purchase = await postingCode(db, settingsCompanyId, "AP_CREDIT_NOTE", AP_CREDIT_NOTE_PURCHASE_POSTING_CODE, r.purchase_posting_code);
  const taxAccount = await taxControl(db, settingsCompanyId);
  const rawLines = r.lines ?? [];
  if (!rawLines.length) throw new InputValidationError("lines must contain at least one item");
  const taxRules = await listTaxRules(db, b.company.country_code, [...new Set(rawLines.map((line) => line.tax_rule))]);
  const taxRulesByCode = mapByCode(taxRules);
  const configuredTaxComponents = await listTaxComponents(db, b.company.country_code, taxRules.map((rule) => rule.code));
  const taxComponentsByRule = mapTaxComponentsByRule(configuredTaxComponents);
  const callerSuppliedAuthorityCodes = [...new Set(rawLines.flatMap((line) => line.tax_components?.map((component) => component.tax_authority_code) ?? []))];
  const authoritiesByCode = mapByCode(await listTaxAuthorities(db, b.company.country_code, callerSuppliedAuthorityCodes));
  const lines = rawLines.map((line, i) => {
    const taxRule = taxRulesByCode.get(line.tax_rule);
    if (!taxRule) throw new BusinessRuleError(`lines[${i}].tax_rule ${line.tax_rule} was not found`);
    if (taxRule.status !== "ACTIVE") throw new BusinessRuleError(`lines[${i}].tax_rule ${line.tax_rule} is not ACTIVE`);
    const net = amount(line.net_amount);
    const taxRecoverable = line.tax_recoverable ?? r.tax_recoverable ?? true;
    const configuredComponents = taxComponentsByRule.get(line.tax_rule) ?? [];
    if (taxRule.calculation_method === "CALLER_SUPPLIED" && line.tax_rule !== "CALLER_SUPPLIED") throw new InputValidationError(`Tax rule ${line.tax_rule} requires caller supplied tax components`);
    if (taxRule.calculation_method === "CONFIGURED_COMPONENTS") {
      if (configuredComponents.length === 0) throw new BusinessRuleError(`Tax rule ${line.tax_rule} has no configured tax components`);
      if (configuredComponents.length !== taxRule.component_count) throw new BusinessRuleError(`Tax rule ${line.tax_rule} expected ${taxRule.component_count} tax components but resolved ${configuredComponents.length}`);
      for (const component of configuredComponents) {
        if (component.status !== "ACTIVE") throw new BusinessRuleError(`Tax component ${component.code} is not ACTIVE`);
        if (component.tax_rule_code !== taxRule.code || component.tax_rule_country_code !== taxRule.country_code) throw new BusinessRuleError(`Tax component ${component.code} does not belong to tax rule ${taxRule.code}`);
      }
    }
    const taxComponents = creditNoteTaxComponents(line, net, taxRule, configuredComponents, authoritiesByCode, taxRecoverable);
    const tax = round(taxComponents.reduce((sum, component) => sum + component.base_currency_amount, 0));
    const gross = round(line.gross_amount == null ? net + tax : amount(line.gross_amount));
    return { line_id: line.line_id ?? i + 1, description: line.description, gross_amount: gross, net_amount: net, tax_amount: tax, purchase_amount: net, purchase_posting_code: line.purchase_posting_code ?? purchase.code ?? "", tax_components: taxComponents };
  });
  const gross = round(lines.reduce((s, l) => s + l.gross_amount, 0));
  const tax = round(lines.reduce((s, l) => s + l.tax_amount, 0));
  const allocations = [];
  let applied = 0;
  for (const allocation of r.allocations ?? []) {
    const bill = await openBill(db, b.company.id, b.counterparty.id, allocation.document_id);
    const value = amount(allocation.amount);
    if (!bill || bill.open_amount <= 0) throw new BusinessRuleError(`Open bill ${allocation.document_id} was not found`);
    if (value > bill.open_amount) throw new BusinessRuleError(`Allocation to ${allocation.document_id} exceeds open amount`);
    allocations.push({ bill, amount: value });
    applied = round(applied + value);
  }
  if (applied > gross) throw new InputValidationError("Credit note allocations exceed credit note gross amount");
  const unappliedAmount = round(gross - applied);
  const detailed = { document_type: documentType, company: { code: b.company.code, base_currency_code: b.company.base_currency_code }, ap_counterparty: { code: b.counterparty.code, name: b.counterparty.name }, document_id: r.document_id, supplier_credit_note_number: r.supplier_credit_note_number, memo, generated_description: `Supplier Credit Note ${r.document_id}`, credit_note_date: docDate, posting_date: pd, lines, allocations: allocations.map((a) => ({ bill_document_id: a.bill.document_id, amount: a.amount })), gross_amount: gross, tax_amount: tax, applied_amount: applied, unapplied_amount: unappliedAmount };
  const journalLines = [apGl(1, trade, "DR", applied, detailed.generated_description, memo, AP_TRADE), ...(unappliedAmount > 0 ? [apGl(2, unapplied, "DR", unappliedAmount, detailed.generated_description, memo, AP_UNAPPLIED)] : []), gl(unappliedAmount > 0 ? 3 : 2, purchase, "CR", round(gross - tax), detailed.generated_description, memo), ...(tax > 0 ? [taxGl(unappliedAmount > 0 ? 4 : 3, taxAccount, "CR", tax, detailed.generated_description, memo)] : [])].filter((l) => l.base_currency_amount > 0);
  const ctx: Context = { documentType, request, company: b.company, counterparty: b.counterparty, period: b.period, detailed, journalLines, apDetails: [], taxDetails: [], bankCashDetails: null, reservedJournalHeaderId: reservedId };
  ctx.apDetails = [...allocations.map((a) => apDetail(ctx, AP_TRADE, "DEBIT", a.amount, a.bill.id)), ...(unappliedAmount > 0 ? [apDetail(ctx, AP_UNAPPLIED, "DEBIT", unappliedAmount)] : [])];
  ctx.taxDetails = lines.flatMap((line) =>
    line.tax_components.map((component) => ({
      ...component,
      posting_date: pd,
      financial_year_code: b.period.financial_year_code,
      financial_period_code: b.period.financial_period_code,
      base_currency_code: b.company.base_currency_code,
    })),
  );
  return ctx;
}

async function taxControl(db: DbExecutor, companyId: number): Promise<Account> {
  const acc = await one(db, `SELECT ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
    FROM tax_control_account tmt JOIN gl_account ga ON ga.company_id = tmt.company_id AND ga.id = tmt.gl_account_id
    WHERE tmt.company_id = $1 AND tmt.code = $2 AND tmt.status = 'ACTIVE' AND ga.status = 'ACTIVE'`, [companyId, TAX_ON_PURCHASES], account);
  if (!acc) throw new BusinessRuleError(`${TAX_ON_PURCHASES} tax control account is not configured`);
  return acc;
}

export async function processApDocument(documentType: ApProcessingDocumentType, input: RequestDto, options: { preview?: boolean } = {}): Promise<ApProcessingPostingResponseDto> {
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");
  if (input.document_type !== undefined && input.document_type !== documentType) throw new InputValidationError(`document_type must be ${documentType}`);
  const { request, reservedId } = await reserveDocumentId(documentType, input);
  const ctx = await buildSimpleAdjustment(getDb(), documentType, request, reservedId);
  const debit = round(ctx.journalLines.filter((l) => l.dr_cr === "DR").reduce((s, l) => s + l.base_currency_amount, 0));
  const credit = round(ctx.journalLines.filter((l) => l.dr_cr === "CR").reduce((s, l) => s + l.base_currency_amount, 0));
  if (debit !== credit) throw new BusinessRuleError(`${documentType} generated unbalanced journal lines`);
  if (options.preview) return response(ctx);
  return withTransaction(async (client) => persist(client, ctx));
}

async function persist(client: DbExecutor, ctx: Context): Promise<ApProcessingPostingResponseDto> {
  const journalRepo = new JournalRepo(client);
  const header = await journalRepo.insert({ id: ctx.reservedJournalHeaderId ?? undefined, company_id: ctx.company.id, company_code: ctx.company.code, company_name: ctx.company.name, document_type_code: ctx.documentType, document_type_label: LABELS[ctx.documentType], document_id: ctx.detailed.document_id, description: ctx.detailed.generated_description, document_snapshot_json: ctx.request, detailed_document_snapshot_json: ctx.detailed, posting_engine_code: ctx.documentType, document_date: documentDate(ctx), posting_date: ctx.detailed.posting_date, financial_year_id: ctx.period.financial_year_id, financial_year_code: ctx.period.financial_year_code, financial_period_id: ctx.period.financial_period_id, financial_period_code: ctx.period.financial_period_code, base_currency_code: ctx.company.base_currency_code, memo: ctx.detailed.memo, ...toJournalBankCashFields(ctx.bankCashDetails) });
  const insertedLines: JournalLineRow[] = [];
  for (const line of ctx.journalLines) insertedLines.push(await journalRepo.insertLine({ journal_header_id: header.id, ...line }));
  const debit = round(ctx.journalLines.filter((l) => l.dr_cr === "DR").reduce((s, l) => s + l.base_currency_amount, 0));
  const credit = round(ctx.journalLines.filter((l) => l.dr_cr === "CR").reduce((s, l) => s + l.base_currency_amount, 0));
  const posted = await journalRepo.setPosted(header.id, debit, credit);
  const apHeader = await insertApHeader(client, ctx, header.id);
  const apRows = [];
  for (const [index, detail] of ctx.apDetails.entries()) {
    const row = await insertApLine(client, apHeader.id, index + 1, ctx, detail);
    apRows.push({ ...detail, id: row.id, code: `${apHeader.code}-${index + 1}`, journal_header_id: header.id, status: "POSTED" as const });
  }
  const taxRows = ctx.taxDetails.length ? await insertTaxLedger(client, ctx, header.id) : [];
  return response({ ...ctx, apDetails: apRows, taxDetails: taxRows }, posted, insertedLines);
}

async function insertApHeader(db: DbExecutor, ctx: Context, journalHeaderId: number): Promise<{ id: number; code: string }> {
  const code = `AP-${ctx.documentType.replace("AP_", "").replaceAll("_", "-")}-${journalHeaderId}`;
  const { rows } = await db.query(`INSERT INTO ap_subledger_entry_header
    (code, company_id, journal_header_id, ap_counterparty_id, document_type_code, document_id, supplier_invoice_number, description, memo, document_date, posting_date, financial_year_id, financial_period_id, base_currency_code, status, creation_date, creation_actor_type)
    VALUES ($1,$2,$3,$4,$5,$6,NULL,$7,$8,$9,$10,$11,$12,$13,'POSTED',now(),'SYSTEM') RETURNING id`,
    [code, ctx.company.id, journalHeaderId, ctx.counterparty.id, ctx.documentType, ctx.detailed.document_id, ctx.detailed.generated_description, ctx.detailed.memo, documentDate(ctx), ctx.detailed.posting_date, ctx.period.financial_year_id, ctx.period.financial_period_id, ctx.company.base_currency_code]);
  return { id: Number(rows[0].id), code };
}

async function insertApLine(db: DbExecutor, headerId: number, lineNumber: number, ctx: Context, detail: ApProcessingSubledgerDetailDto): Promise<{ id: number }> {
  const lineType = apLineType(ctx.documentType, detail);
  const { rows } = await db.query(`INSERT INTO ap_subledger_entry_line
    (ap_subledger_entry_header_id, line_number, line_type, description, control_account_code, dr_cr, gross_amount, source_entry_header_id, target_entry_header_id, base_currency_amount, memo, creation_date, creation_actor_type)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now(),'SYSTEM') RETURNING id`,
    [headerId, lineNumber, lineType, ctx.detailed.generated_description, detail.control_account_code, detail.entry_type === "DEBIT" ? "DR" : "CR", detail.base_currency_amount, detail.source_entry_header_id ?? null, detail.applied_to_ap_subledger_entry_id ?? null, detail.base_currency_amount, ctx.detailed.memo]);
  return { id: Number(rows[0].id) };
}

function apLineType(documentType: ApProcessingDocumentType, detail: ApProcessingSubledgerDetailDto): string {
  if (documentType === "AP_PAYMENT") return detail.control_account_code === AP_UNAPPLIED ? "PAYMENT_UNAPPLIED" : "PAYMENT_ALLOCATION";
  if (documentType === "AP_PAYMENT_APPLICATION") return "PAYMENT_APPLICATION";
  if (documentType === "AP_BILL_CANCELLATION") return "BILL_CANCELLATION_LINE";
  if (documentType === "AP_CREDIT_NOTE") return "CREDIT_NOTE_LINE";
  if (documentType === "AP_OPENING_BALANCE") return "OPENING_BALANCE_ITEM";
  if (documentType === "AP_REFUND") return "REFUND_APPLICATION";
  return "WRITE_OFF_APPLICATION";
}

async function insertTaxLedger(db: DbExecutor, ctx: Context, journalHeaderId: number): Promise<ApProcessingTaxLedgerDetailDto[]> {
  const headerCode = `TAX-${ctx.documentType.replace("AP_", "").replaceAll("_", "-")}-${journalHeaderId}`;
  const header = await db.query(`INSERT INTO tax_ledger_entry_header
    (code, company_id, journal_header_id, document_type_code, document_id, description, document_date, posting_date, financial_year_id, financial_period_id, base_currency_code, status, creation_date, creation_actor_type)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'POSTED',now(),'SYSTEM') RETURNING id`,
    [headerCode, ctx.company.id, journalHeaderId, ctx.documentType, ctx.detailed.document_id, ctx.detailed.generated_description, documentDate(ctx), ctx.detailed.posting_date, ctx.period.financial_year_id, ctx.period.financial_period_id, ctx.company.base_currency_code]);

  const rows: ApProcessingTaxLedgerDetailDto[] = [];
  for (const [index, detail] of ctx.taxDetails.entries()) {
    const taxSetup = await one(db, `SELECT tr.id AS tax_rule_id, ta.id AS tax_authority_id, ta.code AS tax_authority_code, ta.name AS tax_authority_name
      FROM tax_rule tr
      JOIN tax_authority ta ON ta.country_code = tr.country_code AND ta.code = $3 AND ta.status = 'ACTIVE'
      WHERE tr.country_code = $1 AND tr.code = $2 AND tr.status = 'ACTIVE'
      LIMIT 1`, [ctx.company.country_code, detail.tax_rule, detail.tax_authority_code], (row) => ({
        tax_rule_id: Number(row.tax_rule_id),
        tax_authority_id: Number(row.tax_authority_id),
        tax_authority_code: String(row.tax_authority_code),
        tax_authority_name: String(row.tax_authority_name),
      }));
    if (!taxSetup) throw new BusinessRuleError(`Tax setup was not resolved for ${detail.tax_rule}/${detail.tax_authority_code}`);
    const lineNumber = index + 1;
    const inserted = await db.query(`INSERT INTO tax_ledger_entry_line
      (tax_ledger_entry_header_id, line_number, tax_rule_id, tax_component_id, tax_authority_id, tax_movement_type_code, scheme_code, invoice_label, report_label, tax_rate, taxable_base_currency_amount, dr_cr, base_currency_amount, creation_date, creation_actor_type)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,now(),'SYSTEM') RETURNING id`,
      [
        Number(header.rows[0].id),
        lineNumber,
        taxSetup.tax_rule_id,
        detail.tax_component_id,
        taxSetup.tax_authority_id,
        detail.tax_movement_type_code,
        detail.scheme_code ?? null,
        detail.invoice_label ?? null,
        detail.report_label ?? null,
        detail.tax_rate,
        detail.taxable_amount,
        detail.entry_type === "CREDIT" ? "CR" : "DR",
        detail.base_currency_amount,
      ]);
    rows.push({ ...detail, id: Number(inserted.rows[0].id), code: `${headerCode}-${lineNumber}`, tax_authority_code: taxSetup.tax_authority_code, tax_authority_name: taxSetup.tax_authority_name, status: "POSTED" });
  }
  return rows;
}

