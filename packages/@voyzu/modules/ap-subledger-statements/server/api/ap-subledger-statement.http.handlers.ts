import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";

import { ok, serverError } from "@voyzu/capability/http";
import type { InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type { ApCounterpartySummaryResponseDto } from "@voyzu/types/modules/ap-subledger";

import { listApCounterpartySummaries } from "../lib/ap-subledger-statement.service";

function companyIdFrom(req: NextRequest): Promise<number> {
  return resolveApiCompanyIdFromPath(req);
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
