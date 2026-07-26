import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu-modules/core/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";

import { getApSubledgerEntriesAudit } from "../lib/ap-subledger-entries-audit.service";

export async function handleGetApSubledgerEntriesAudit(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if (!fromDate) return inputValidationError("fromDate is required");
  if (!toDate) return inputValidationError("toDate is required");

  try {
    return ok(await getApSubledgerEntriesAudit(companyId, fromDate, toDate));
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("AP subledger entries audit error:", err);
    return serverError("Failed to generate AP subledger entries audit");
  }
}




