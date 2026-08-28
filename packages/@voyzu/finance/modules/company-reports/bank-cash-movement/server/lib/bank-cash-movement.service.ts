import type { BankCashMovementResponseDto } from "@voyzu/finance/types/modules/company-reports";
import { getDb } from "@voyzu/capability/db";
import { resolveEffectiveSettingsCompanyId } from "../../../../common/server/settings-scope";
import { BankCashMovementRepo } from "../db/bank-cash-movement.repo";
import { getCompanyReportContext } from "../../../common/server/lib/company-report.service";

async function getBankCashMovementUnchecked(companyId: number, fromDate: string, toDate: string, bankCashCode?: string | null): Promise<BankCashMovementResponseDto> {
  const db = getDb();
  const repo = new BankCashMovementRepo(db);
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, db);
  const normalizedBankCashCode = bankCashCode || null;
  const [company, lines] = await Promise.all([
    getCompanyReportContext(db, companyId),
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
