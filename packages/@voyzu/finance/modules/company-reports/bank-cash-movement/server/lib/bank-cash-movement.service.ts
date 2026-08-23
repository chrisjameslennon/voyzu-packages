import type { BankCashMovementResponseDto } from "@voyzu/finance/types/modules/company-reports";
import { getDb } from "@voyzu/capability/db";
import { NotFoundError } from "@voyzu/capability/errors";
import { resolveEffectiveSettingsCompanyId } from "../../../../common/server/settings-scope";
import { BankCashMovementRepo } from "../db/bank-cash-movement.repo";

async function fetchCompany(companyId: number): Promise<{ name: string; baseCurrencyCode: string }> {
  const { rows } = await getDb().query(
    `SELECT c.name, c.base_currency_code
       FROM finance_organization fc JOIN organization c ON c.id = fc.organization_id
      WHERE fc.id = $1 AND fc.is_template = false`,
    [companyId],
  );
  if (!rows[0]) throw new NotFoundError(`Company id ${companyId} not found`);
  const row = rows[0] as Record<string, unknown>;
  return { name: String(row.name), baseCurrencyCode: String(row.base_currency_code) };
}

async function getBankCashMovementUnchecked(companyId: number, fromDate: string, toDate: string, bankCashCode?: string | null): Promise<BankCashMovementResponseDto> {
  const db = getDb();
  const repo = new BankCashMovementRepo(db);
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, db);
  const normalizedBankCashCode = bankCashCode || null;
  const [company, lines] = await Promise.all([
    fetchCompany(companyId),
    repo.getLines(companyId, settingsCompanyId, fromDate, toDate, normalizedBankCashCode),
  ]);
  const [bankCashFilterLabel, trialBalanceMovement] = await Promise.all([
    repo.getBankCashAccountFilterLabel(settingsCompanyId, normalizedBankCashCode),
    repo.getTrialBalanceMovement(companyId, settingsCompanyId, fromDate, toDate, normalizedBankCashCode),
  ]);
  const detailMovement = lines.reduce((sum, line) => sum + (line.drCr === "DR" ? line.amount : -line.amount), 0);
  return {
    companyId,
    companyName: company.name,
    baseCurrencyCode: company.baseCurrencyCode,
    fromDate,
    toDate,
    bankCashFilter: {
      code: normalizedBankCashCode,
      label: bankCashFilterLabel,
    },
    lines,
    trialBalanceReconciled: Math.abs(detailMovement - trialBalanceMovement) < 0.01,
  };
}

export const getBankCashMovement = getBankCashMovementUnchecked;
