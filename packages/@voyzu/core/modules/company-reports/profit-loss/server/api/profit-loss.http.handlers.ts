import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/core/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";
import { getProfitLoss } from "../lib/profit-loss.service";

export async function handleGetProfitLoss(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);

  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if (!fromDate || !toDate) {
    return inputValidationError("fromDate and toDate are required");
  }

  try {
    const data = await getProfitLoss(companyId, fromDate, toDate);
    return ok(data);
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Profit and loss error:", err);
    return serverError("Failed to generate profit and loss");
  }
}

