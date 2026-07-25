import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";

import type {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types/errors";
import type { FinancialPeriodResponseDto } from "@voyzu/types/modules/financial-periods";

import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { ok } from "@voyzu/capability/http";

import { listPeriods, closePeriod, reopenPeriod } from "../lib/financial-period.service";
import { FinancialYearRepo } from "../../db/financial-year.repo";
import { getDb } from "@voyzu/capability/db";

function getCompanyId(req: NextRequest): Promise<number> {
  return resolveApiCompanyIdFromPath(req);
}

// ── List periods for a financial year ─────────────────────────


export async function handleList(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialPeriodResponseDto[] | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const { code } = await params;
    const fy = await new FinancialYearRepo(getDb()).get(companyId, code);
    if (!fy) return notFoundError(`Financial year ${code} not found`);
    const periods = await listPeriods(fy.id);
    return ok(periods satisfies FinancialPeriodResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

// ── Close period ──────────────────────────────────────────────


export async function handleClose(
  req: NextRequest,
  { params }: { params: Promise<{ code: string; periodCode: string }> },
): Promise<NextResponse<FinancialPeriodResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const { code, periodCode } = await params;
    const period = await closePeriod(companyId, code, periodCode);
    return ok(period satisfies FinancialPeriodResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

// ── Reopen period ─────────────────────────────────────────────


export async function handleReopen(
  req: NextRequest,
  { params }: { params: Promise<{ code: string; periodCode: string }> },
): Promise<NextResponse<FinancialPeriodResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const { code, periodCode } = await params;
    const period = await reopenPeriod(companyId, code, periodCode);
    return ok(period satisfies FinancialPeriodResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


