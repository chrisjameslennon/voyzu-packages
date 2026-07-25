import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError } from "@voyzu/capability/errors";
import { getBankCashMovement } from "../lib/bank-cash-movement.service";

export async function handleGetBankCashMovement(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const bankCashCode = searchParams.get("bankCashCode");

  if (!fromDate) return inputValidationError("fromDate is required");
  if (!toDate) return inputValidationError("toDate is required");

  try {
    return ok(await getBankCashMovement(companyId, fromDate, toDate, bankCashCode));
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Bank / Cash Movement error:", err);
    return serverError("Failed to generate Bank / Cash Movement");
  }
}


