import type { EntryType } from "@voyzu/core/types/modules/core";
import type { DbExecutor } from "@voyzu/capability/db";
import type {
  TaxPositionAuthorityColumnDto,
  TaxPositionLineDto,
} from "@voyzu/core/types/modules/company-reports";

import { TrialBalanceSnapshotRepo } from "../../../common/server/db/trial-balance-snapshot.repo";
import { resolveEffectiveSettingsCompanyId } from "../../../../common/server/settings-scope";

interface TaxPositionRawLine {
  tax_authority_code: string;
  tax_authority_name: string;
  tax_movement_type_code: string;
  entry_type: EntryType;
  base_currency_amount: number;
}

type TaxPositionLineKey = TaxPositionLineDto["key"];

const LINE_DEFINITIONS: Array<{ key: TaxPositionLineKey; label: string }> = [
  { key: "OUTPUT_TAX_PAYABLE", label: "Output tax payable" },
  { key: "INPUT_TAX_RECEIVABLE", label: "Less: Input tax recoverable" },
];

function signedAmount(row: TaxPositionRawLine): number {
  return row.entry_type === "CREDIT" ? row.base_currency_amount : -row.base_currency_amount;
}

function inputTaxAmount(row: TaxPositionRawLine): number {
  return row.entry_type === "DEBIT" ? row.base_currency_amount : -row.base_currency_amount;
}

function lineKeyFor(row: TaxPositionRawLine): TaxPositionLineKey {
  if (row.tax_movement_type_code === "TAX_ON_PURCHASES") return "INPUT_TAX_RECEIVABLE";
  return "OUTPUT_TAX_PAYABLE";
}

function reportAmount(row: TaxPositionRawLine): number {
  const key = lineKeyFor(row);
  if (key === "INPUT_TAX_RECEIVABLE") return inputTaxAmount(row);
  return signedAmount(row);
}

function netContribution(line: TaxPositionLineDto): number {
  if (line.key === "INPUT_TAX_RECEIVABLE") return -line.total;
  return line.total;
}

export class TaxPositionRepo {
  private readonly trialBalanceSnapshot: TrialBalanceSnapshotRepo;

  constructor(private readonly db: DbExecutor) {
    this.trialBalanceSnapshot = new TrialBalanceSnapshotRepo(db);
  }

  async getLines(companyId: number, asAtDate: string): Promise<TaxPositionRawLine[]> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT
         ta.code AS tax_authority_code,
         ta.name AS tax_authority_name,
         l.tax_movement_type_code,
         CASE WHEN l.dr_cr = 'CR' THEN 'CREDIT' ELSE 'DEBIT' END AS entry_type,
         l.base_currency_amount::float AS base_currency_amount
       FROM tax_ledger_entry_header e
       JOIN tax_ledger_entry_line l ON l.tax_ledger_entry_header_id = e.id
       JOIN journal_header h ON h.id = e.journal_header_id
       JOIN tax_control_account tmt ON tmt.finance_company_id = $3 AND tmt.code = l.tax_movement_type_code
       JOIN tax_authority ta ON ta.id = l.tax_authority_id
       WHERE e.finance_company_id = $1
         AND e.status = 'POSTED'
         AND h.status = 'POSTED'
         AND tmt.status = 'ACTIVE'
         AND l.tax_movement_type_code IN ('TAX_ON_SALES', 'TAX_ON_PURCHASES')
         AND e.posting_date <= $2
       ORDER BY ta.code ASC, e.posting_date ASC, e.id ASC, l.line_number ASC`,
      [companyId, asAtDate, settingsCompanyId],
    );
    return rows.map((row: Record<string, unknown>) => ({
      tax_authority_code: String(row.tax_authority_code),
      tax_authority_name: String(row.tax_authority_name),
      tax_movement_type_code: String(row.tax_movement_type_code),
      entry_type: row.entry_type === "CREDIT" ? "CREDIT" : "DEBIT",
      base_currency_amount: Number(row.base_currency_amount),
    }));
  }

  summarize(lines: TaxPositionRawLine[]): {
    authorityColumns: TaxPositionAuthorityColumnDto[];
    lines: TaxPositionLineDto[];
    netTaxPosition: number;
  } {
    const authorityByCode = new Map<string, TaxPositionAuthorityColumnDto>();
    const lineByKey = new Map<TaxPositionLineKey, TaxPositionLineDto>(
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
    return {
      authorityColumns: [...authorityByCode.values()].sort((a, b) => a.taxAuthorityCode.localeCompare(b.taxAuthorityCode)),
      lines: reportLines,
      netTaxPosition: reportLines.reduce((sum, line) => sum + netContribution(line), 0),
    };
  }

  async getTrialBalanceTaxPosition(companyId: number, asAtDate: string): Promise<number> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT gl_account_id::int AS gl_account_id
       FROM tax_control_account
       WHERE finance_company_id = $1
         AND status = 'ACTIVE'`,
      [settingsCompanyId],
    );
    const glAccountIds = rows.map((row: Record<string, unknown>) => Number(row.gl_account_id));
    return this.trialBalanceSnapshot.getAsAtBalanceForGlAccounts(companyId, asAtDate, glAccountIds);
  }
}

