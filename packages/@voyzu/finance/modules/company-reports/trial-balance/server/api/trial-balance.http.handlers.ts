import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/finance/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";
import { getTrialBalance } from "../lib/trial-balance.service";

export async function handleGetTrialBalance(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);

  const asAtDate = searchParams.get("asAtDate") ?? undefined;

  try {
    const data = await getTrialBalance(companyId, asAtDate);
    return ok(data);
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Trial balance error:", err);
    return serverError("Failed to generate trial balance");
  }
}


