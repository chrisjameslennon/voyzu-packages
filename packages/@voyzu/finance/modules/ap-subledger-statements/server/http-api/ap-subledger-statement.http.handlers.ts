import { type NextRequest, NextResponse } from "next/server";
import { resolveHttpApiCompanyIdFromPath } from "../../../organization-finance/server/lib/settings-scope";

import { ok, serverError } from "@voyzu/capability/http";
import type { InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type { ApCounterpartySummaryResponseDto } from "../../../ap-subledger-counterparties/types/ap-counterparty-summary.response.dto";

import { listApCounterpartySummaries } from "../lib/ap-subledger-statement.service";

function companyIdFrom(req: NextRequest): Promise<number> {
  return resolveHttpApiCompanyIdFromPath(req);
}

export async function handleListApCounterpartySummaries(
  req: NextRequest,
): Promise<NextResponse<ApCounterpartySummaryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  try {
    const summaries = await listApCounterpartySummaries(companyId);
    return ok(summaries satisfies ApCounterpartySummaryResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}
