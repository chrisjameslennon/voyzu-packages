import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";

import { getTaxActivityReconciliation } from "../lib/tax-activity-reconciliation.service";

export async function handleGetTaxActivityReconciliation(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);

  const periodStartDate = searchParams.get("periodStartDate");
  if (!periodStartDate) return inputValidationError("periodStartDate is required");

  const periodEndDate = searchParams.get("periodEndDate");
  if (!periodEndDate) return inputValidationError("periodEndDate is required");

  const periodLabel = searchParams.get("periodLabel") ?? `${periodStartDate} to ${periodEndDate}`;
  const taxAuthorityCode = searchParams.get("taxAuthorityCode");

  try {
    return ok(await getTaxActivityReconciliation(companyId, periodStartDate, periodEndDate, periodLabel, taxAuthorityCode));
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Tax activity reconciliation error:", err);
    return serverError("Failed to generate tax activity reconciliation");
  }
}

