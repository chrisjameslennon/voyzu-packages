import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu-modules/all-modules/common/server";
import { inputValidationError, ok, serverError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";

import { getBalanceSheet, listFinancialYearsWithPostings } from "../lib/balance-sheet.service";

export async function handleGetBalanceSheet(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);

  const asAtDate = searchParams.get("asAtDate") ?? undefined;

  try {
    const data = await getBalanceSheet(companyId, asAtDate);
    return ok(data);
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Balance sheet error:", err);
    return serverError(err);
  }
}

export async function handleListFinancialYears(request: NextRequest) {
  const companyId = await resolveApiCompanyIdFromPath(request);

  try {
    return ok(await listFinancialYearsWithPostings(companyId));
  } catch (err) {
    return serverError(err);
  }
}
