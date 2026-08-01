import type { FinancialPeriodResponseDto } from "@voyzu/core/types/modules/financial-periods";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import { getDb } from "@voyzu/capability/db";
import { createUpdateAuditStamp } from "../../../../common/server";

import { FinancialYearRepo } from "../../db/financial-year.repo";
import { FinancialPeriodRepo } from "../db/financial-period.repo";
import { toDto } from "./financial-period.mapper";

// ── List ──────────────────────────────────────────────────────

export async function listPeriods(fiscalYearId: number): Promise<FinancialPeriodResponseDto[]> {
  const rows = await new FinancialPeriodRepo(getDb()).listByYear(fiscalYearId);
  return rows.map((r) => toDto(r));
}

// ── Close ─────────────────────────────────────────────────────

export async function closePeriod(
  companyId: number,
  fyCode: string,
  periodCode: string,
): Promise<FinancialPeriodResponseDto> {
  const fyRepo = new FinancialYearRepo(getDb());
  const periodRepo = new FinancialPeriodRepo(getDb());

  const fy = await fyRepo.get(companyId, fyCode);
  if (!fy) throw new NotFoundError(`Financial year ${fyCode} not found`);

  const period = await periodRepo.getByCode(fy.id, periodCode);
  if (!period) throw new NotFoundError(`Financial period ${periodCode} not found in ${fyCode}`);

  const periodDto = toDto(period);
  if (periodDto.status !== "OPEN") {
    throw new BusinessRuleError(
      `Cannot close period: current status is ${periodDto.status}. Must be OPEN.`,
    );
  }
  if (fy.status !== "OPEN") {
    throw new BusinessRuleError(
      `Cannot close period: parent Financial Year must be OPEN (current status: ${fy.status}).`,
    );
  }
  await periodRepo.updateStatus(periodDto.id, "CLOSED", await createUpdateAuditStamp());

  const updated = await periodRepo.getByCode(fy.id, periodCode);
  return toDto(updated ?? period);
}

// ── Reopen ────────────────────────────────────────────────────

export async function reopenPeriod(
  companyId: number,
  fyCode: string,
  periodCode: string,
): Promise<FinancialPeriodResponseDto> {
  const fyRepo = new FinancialYearRepo(getDb());
  const periodRepo = new FinancialPeriodRepo(getDb());

  const fy = await fyRepo.get(companyId, fyCode);
  if (!fy) throw new NotFoundError(`Financial year ${fyCode} not found`);

  const period = await periodRepo.getByCode(fy.id, periodCode);
  if (!period) throw new NotFoundError(`Financial period ${periodCode} not found in ${fyCode}`);

  const periodDto = toDto(period);
  if (periodDto.status !== "CLOSED") {
    throw new BusinessRuleError(
      `Cannot reopen period: current status is ${periodDto.status}. Must be CLOSED.`,
    );
  }
  if (fy.status !== "OPEN") {
    throw new BusinessRuleError(
      `Cannot reopen period: parent Financial Year must be OPEN (current status: ${fy.status}).`,
    );
  }
  await periodRepo.updateStatus(periodDto.id, "OPEN", await createUpdateAuditStamp());

  const updated = await periodRepo.getByCode(fy.id, periodCode);
  return toDto(updated ?? period);
}

// ── Seed ──────────────────────────────────────────────────────

export async function seedPeriodsForYear(
  companyId: number,
  fiscalYearId: number,
  startDate: string,
  endDate: string,
): Promise<void> {
  await new FinancialPeriodRepo(getDb()).seedMonthlyPeriods(companyId, fiscalYearId, startDate, endDate);
}
