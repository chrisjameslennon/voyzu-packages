import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/finance/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";

import { getInventoryLedgerEntriesAudit } from "../lib/inventory-ledger-entries-audit.service";

export async function handleGetInventoryLedgerEntriesAudit(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if (!fromDate) return inputValidationError("fromDate is required");
  if (!toDate) return inputValidationError("toDate is required");

  try {
    return ok(await getInventoryLedgerEntriesAudit(companyId, fromDate, toDate));
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Inventory ledger entries audit error:", err);
    return serverError("Failed to generate Inventory ledger entries audit");
  }
}




