import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/finance/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";

import { getTaxPosition } from "../lib/tax-position.service";

export async function handleGetTaxPosition(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);

  const asAtDate = searchParams.get("asAtDate");
  if (!asAtDate) return inputValidationError("asAtDate is required");

  try {
    return ok(await getTaxPosition(companyId, asAtDate));
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Tax position error:", err);
    return serverError("Failed to generate tax position");
  }
}


