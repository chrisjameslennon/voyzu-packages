import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/core/common/server";

import { ok, serverError } from "@voyzu/capability/http";
import type { InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type { ArCounterpartySummaryResponseDto } from "@voyzu/core/types/modules/ar-subledger";

import { listArCounterpartySummaries } from "../lib/ar-subledger-statement.service";

function companyIdFrom(req: NextRequest): Promise<number> {
  return resolveApiCompanyIdFromPath(req);
}

export async function handleListArCounterpartySummaries(
  req: NextRequest,
): Promise<NextResponse<ArCounterpartySummaryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  try {
    const summaries = await listArCounterpartySummaries(companyId);
    return ok(summaries satisfies ArCounterpartySummaryResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}
