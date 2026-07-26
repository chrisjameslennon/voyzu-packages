import type { BankCashMovementLineDto } from "@voyzu-modules/core/types/modules/company-reports";
import type { DbExecutor } from "@voyzu/capability/db";

import { TrialBalanceSnapshotRepo } from "../../../common/server/db/trial-balance-snapshot.repo";

function localDate(value: unknown): string {
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }
  return String(value);
}

function line(row: Record<string, unknown>): BankCashMovementLineDto {
  return {
    id: `${String(row.journal_id)}-${String(row.journal_line_id)}`,
    journalId: Number(row.journal_id),
    journalCode: String(row.journal_code),
    documentTypeCode: String(row.document_type_code),
    documentTypeLabel: String(row.document_type_label),
    documentId: String(row.document_id),
    postingDate: localDate(row.posting_date),
    documentDate: localDate(row.document_date),
    bankCashCode: String(row.bank_cash_code),
    bankCashType: String(row.bank_cash_type),
    bankCashGlAccountCode: String(row.bank_cash_gl_account_code),
    bankCashGlAccountName: String(row.bank_cash_gl_account_name),
    txId: row.bank_cash_tx_id == null ? null : String(row.bank_cash_tx_id),
    txCode: row.bank_cash_tx_code == null ? null : String(row.bank_cash_tx_code),
    txRef: row.bank_cash_tx_ref == null ? null : String(row.bank_cash_tx_ref),
    txDetails: row.bank_cash_tx_details == null ? null : String(row.bank_cash_tx_details),
    paymentRef: row.bank_cash_payment_ref == null ? null : String(row.bank_cash_payment_ref),
    drCr: row.dr_cr === "CR" ? "CR" : "DR",
    amount: Number(row.base_currency_amount),
  };
}

export class BankCashMovementRepo {
  private readonly trialBalanceSnapshot: TrialBalanceSnapshotRepo;

  constructor(private readonly db: DbExecutor) {
    this.trialBalanceSnapshot = new TrialBalanceSnapshotRepo(db);
  }

  async getBankCashAccountFilterLabel(settingsCompanyId: number, bankCashCode?: string | null): Promise<string> {
    if (!bankCashCode) return "All";

    const { rows } = await this.db.query(
      `SELECT code
       FROM bank_cash_control_account
       WHERE company_id = $1
         AND code = $2`,
      [settingsCompanyId, bankCashCode],
    );
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return bankCashCode;
    return String(row.code);
  }

  async getLines(companyId: number, settingsCompanyId: number, fromDate: string, toDate: string, bankCashCode?: string | null): Promise<BankCashMovementLineDto[]> {
    const { rows } = await this.db.query(
      `SELECT
         j.id AS journal_id,
         j.code AS journal_code,
         j.document_type_code,
         j.document_type_label,
         j.document_id,
         j.document_date,
         j.posting_date,
         cash_line.id AS journal_line_id,
         bank_cash.code AS bank_cash_code,
         bank_cash.type AS bank_cash_type,
         cash_line.gl_account_code AS bank_cash_gl_account_code,
         cash_line.gl_account_name AS bank_cash_gl_account_name,
         j.bank_cash_tx_id,
         j.bank_cash_tx_code,
         j.bank_cash_tx_ref,
         j.bank_cash_tx_details,
         j.bank_cash_payment_ref,
         cash_line.dr_cr,
         cash_line.base_currency_amount
       FROM journal_line cash_line
       JOIN journal_header j ON j.id = cash_line.journal_header_id
       JOIN LATERAL (
         SELECT bca.code, bca.type
         FROM bank_cash_control_account bca
         WHERE bca.company_id = $5
           AND bca.gl_account_id = cash_line.gl_account_id
           AND ($4::text IS NULL OR bca.code = $4)
         ORDER BY
           (bca.id = j.bank_cash_account_id) DESC,
           (bca.status = 'ACTIVE') DESC,
           bca.id ASC
         LIMIT 1
       ) bank_cash ON true
       WHERE j.company_id = $1
         AND j.posting_date BETWEEN $2 AND $3
         AND j.status = 'POSTED'
       ORDER BY j.posting_date ASC, j.code ASC, cash_line.line_number ASC`,
      [companyId, fromDate, toDate, bankCashCode ?? null, settingsCompanyId],
    );
    return rows.map((row: Record<string, unknown>) => line(row));
  }

  async getTrialBalanceMovement(companyId: number, settingsCompanyId: number, fromDate: string, toDate: string, bankCashCode?: string | null): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT DISTINCT gl_account_id::int AS gl_account_id
       FROM bank_cash_control_account
       WHERE company_id = $1
         AND ($2::text IS NULL OR code = $2)`,
      [settingsCompanyId, bankCashCode ?? null],
    );
    const glAccountIds = rows.map((row: Record<string, unknown>) => Number(row.gl_account_id));
    return this.trialBalanceSnapshot.getPeriodBalanceForGlAccounts(companyId, fromDate, toDate, glAccountIds);
  }
}

