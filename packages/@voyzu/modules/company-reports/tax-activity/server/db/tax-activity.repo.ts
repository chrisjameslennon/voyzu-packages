import type { EntryType } from "@voyzu/types/modules/core";
import type { DbExecutor } from "@voyzu/capability/db";
import type {
  TaxActivityAuthorityColumnDto,
  TaxActivityLineDto,
} from "@voyzu/types/modules/company-reports";

import { TrialBalanceSnapshotRepo } from "../../../common/server/db/trial-balance-snapshot.repo";
import { resolveEffectiveSettingsCompanyId } from "../../../../common/server/settings-scope";

interface TaxActivityRawLine {
  tax_authority_code: string;
  tax_authority_name: string;
  document_type_code: string;
  tax_movement_type_code: string;
  entry_type: EntryType;
  base_currency_amount: number;
}

type TaxActivityLineKey = TaxActivityLineDto["key"];

const LINE_DEFINITIONS: Array<{ key: TaxActivityLineKey; label: string }> = [
  { key: "OUTPUT_TAX_PAYABLE", label: "Output tax payable" },
  { key: "INPUT_TAX_RECEIVABLE", label: "Less: Input tax recoverable" },
  { key: "TAX_ADJUSTMENTS", label: "Tax adjustments" },
  { key: "TAX_PAYMENTS", label: "Less: Tax payments" },
  { key: "TAX_REFUNDS", label: "Plus: Tax refunds" },
];

function signedAmount(row: TaxActivityRawLine): number {
  return row.entry_type === "CREDIT" ? row.base_currency_amount : -row.base_currency_amount;
}

function inputTaxAmount(row: TaxActivityRawLine): number {
  return row.entry_type === "DEBIT" ? row.base_currency_amount : -row.base_currency_amount;
}

function absoluteAmount(row: TaxActivityRawLine): number {
  return Math.abs(row.base_currency_amount);
}

function lineKeyFor(row: TaxActivityRawLine): TaxActivityLineKey {
  if (row.document_type_code === "TAX_PAYMENT") return "TAX_PAYMENTS";
  if (row.document_type_code === "TAX_REFUND") return "TAX_REFUNDS";
  if (row.document_type_code === "TAX_ADJUSTMENT") return "TAX_ADJUSTMENTS";
  if (row.tax_movement_type_code === "TAX_ON_PURCHASES") return "INPUT_TAX_RECEIVABLE";
  return "OUTPUT_TAX_PAYABLE";
}

function reportAmount(row: TaxActivityRawLine): number {
  const key = lineKeyFor(row);
  if (key === "INPUT_TAX_RECEIVABLE") return inputTaxAmount(row);
  if (key === "TAX_PAYMENTS" || key === "TAX_REFUNDS") return absoluteAmount(row);
  return signedAmount(row);
}

function netContribution(line: TaxActivityLineDto): number {
  if (line.key === "INPUT_TAX_RECEIVABLE" || line.key === "TAX_PAYMENTS") return -line.total;
  return line.total;
}

function isReturnLine(line: TaxActivityLineDto): boolean {
  return line.key === "OUTPUT_TAX_PAYABLE" || line.key === "INPUT_TAX_RECEIVABLE" || line.key === "TAX_ADJUSTMENTS";
}

export class TaxActivityRepo {
  private readonly trialBalanceSnapshot: TrialBalanceSnapshotRepo;

  constructor(private readonly db: DbExecutor) {
    this.trialBalanceSnapshot = new TrialBalanceSnapshotRepo(db);
  }

  async getAccrualLinesForPeriod(companyId: number, startDate: string, endDate: string): Promise<TaxActivityRawLine[]> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT
         ta.code AS tax_authority_code,
         ta.name AS tax_authority_name,
         h.document_type_code,
         l.tax_movement_type_code,
         CASE WHEN l.dr_cr = 'CR' THEN 'CREDIT' ELSE 'DEBIT' END AS entry_type,
         l.base_currency_amount::float AS base_currency_amount
       FROM tax_ledger_entry_header e
       JOIN tax_ledger_entry_line l ON l.tax_ledger_entry_header_id = e.id
       JOIN journal_header h ON h.id = e.journal_header_id
       JOIN tax_control_account tmt ON tmt.company_id = $4 AND tmt.code = l.tax_movement_type_code
       JOIN tax_authority ta ON ta.id = l.tax_authority_id
       WHERE e.company_id = $1
         AND e.status = 'POSTED'
         AND h.status = 'POSTED'
         AND tmt.status = 'ACTIVE'
         AND e.posting_date BETWEEN $2 AND $3
       ORDER BY ta.code ASC, e.posting_date ASC, e.id ASC, l.line_number ASC`,
      [companyId, startDate, endDate, settingsCompanyId],
    );
    return rows.map((row: Record<string, unknown>) => ({
      tax_authority_code: String(row.tax_authority_code),
      tax_authority_name: String(row.tax_authority_name),
      document_type_code: String(row.document_type_code),
      tax_movement_type_code: String(row.tax_movement_type_code),
      entry_type: row.entry_type === "CREDIT" ? "CREDIT" as const : "DEBIT" as const,
      base_currency_amount: Number(row.base_currency_amount),
    }));
  }

  summarize(lines: TaxActivityRawLine[]): {
    authorityColumns: TaxActivityAuthorityColumnDto[];
    returnLines: TaxActivityLineDto[];
    settlementLines: TaxActivityLineDto[];
    netTaxReturn: number;
    closingTaxPositionImpact: number;
  } {
    const authorityByCode = new Map<string, TaxActivityAuthorityColumnDto>();
    const lineByKey = new Map<TaxActivityLineKey, TaxActivityLineDto>(
      LINE_DEFINITIONS.map((definition) => [
        definition.key,
        { ...definition, amountsByAuthority: {}, total: 0 },
      ]),
    );

    for (const rawLine of lines) {
      authorityByCode.set(rawLine.tax_authority_code, {
        taxAuthorityCode: rawLine.tax_authority_code,
        taxAuthorityName: rawLine.tax_authority_name,
      });

      const key = lineKeyFor(rawLine);
      const line = lineByKey.get(key)!;
      const amount = reportAmount(rawLine);
      line.amountsByAuthority[rawLine.tax_authority_code] = (line.amountsByAuthority[rawLine.tax_authority_code] ?? 0) + amount;
      line.total += amount;
    }

    const reportLines = LINE_DEFINITIONS.map((definition) => lineByKey.get(definition.key)!);
    const returnLines = reportLines.filter(isReturnLine);
    const settlementLines = reportLines.filter((line) => !isReturnLine(line));
    const netTaxReturn = returnLines.reduce((sum, line) => sum + netContribution(line), 0);
    return {
      authorityColumns: [...authorityByCode.values()].sort((a, b) => a.taxAuthorityCode.localeCompare(b.taxAuthorityCode)),
      returnLines,
      settlementLines,
      netTaxReturn,
      closingTaxPositionImpact: netTaxReturn + settlementLines.reduce((sum, line) => sum + netContribution(line), 0),
    };
  }

  async getTrialBalanceTaxMovement(companyId: number, startDate: string, endDate: string): Promise<number> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT gl_account_id::int AS gl_account_id
       FROM tax_control_account
       WHERE company_id = $1
         AND status = 'ACTIVE'`,
      [settingsCompanyId],
    );
    const glAccountIds = rows.map((row: Record<string, unknown>) => Number(row.gl_account_id));
    return this.trialBalanceSnapshot.getPeriodBalanceForGlAccounts(companyId, startDate, endDate, glAccountIds);
  }
}
