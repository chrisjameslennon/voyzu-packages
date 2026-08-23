import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/finance/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";

import { getTaxActivity } from "../lib/tax-activity.service";

export async function handleGetTaxActivity(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);

  const periodStartDate = searchParams.get("periodStartDate");
  if (!periodStartDate) return inputValidationError("periodStartDate is required");

  const periodEndDate = searchParams.get("periodEndDate");
  if (!periodEndDate) return inputValidationError("periodEndDate is required");

  const periodLabel = searchParams.get("periodLabel") ?? `${periodStartDate} to ${periodEndDate}`;

  try {
    return ok(await getTaxActivity(companyId, periodStartDate, periodEndDate, periodLabel));
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Tax activity error:", err);
    return serverError("Failed to generate tax activity");
  }
}

