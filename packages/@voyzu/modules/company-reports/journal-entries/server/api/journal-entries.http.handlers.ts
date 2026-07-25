import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";

import { getJournalEntries } from "../lib/journal-entries.service";

export async function handleGetJournalEntries(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if (!fromDate) return inputValidationError("fromDate is required");
  if (!toDate) return inputValidationError("toDate is required");

  try {
    return ok(await getJournalEntries(companyId, fromDate, toDate));
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Journal Entries error:", err);
    return serverError("Failed to generate Journal Entries");
  }
}

