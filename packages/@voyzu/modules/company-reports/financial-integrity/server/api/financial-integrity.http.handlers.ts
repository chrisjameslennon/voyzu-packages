import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";

import { getFinancialIntegrity } from "../lib/financial-integrity.service";

export async function handleGetFinancialIntegrity(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const documentTypeCode = searchParams.get("documentTypeCode") || null;

  if (!fromDate) return inputValidationError("fromDate is required");
  if (!toDate) return inputValidationError("toDate is required");

  try {
    return ok(await getFinancialIntegrity(companyId, fromDate, toDate, documentTypeCode));
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Financial Integrity error:", err);
    return serverError("Failed to generate Financial Integrity report");
  }
}

