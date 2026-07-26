import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu-modules/all-modules/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";

import { getTaxLedgerEntriesAudit } from "../lib/tax-ledger-entries-audit.service";

export async function handleGetTaxLedgerEntriesAudit(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if (!fromDate) return inputValidationError("fromDate is required");
  if (!toDate) return inputValidationError("toDate is required");

  try {
    return ok(await getTaxLedgerEntriesAudit(companyId, fromDate, toDate));
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Tax ledger entries audit error:", err);
    return serverError("Failed to generate tax ledger entries audit");
  }
}



