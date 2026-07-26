import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu-modules/all-modules/common/server";

import { notFoundError, ok, serverError } from "@voyzu/capability/http";
import type { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type { ApCounterpartyResponseDto } from "@voyzu-modules/types/modules/ap-subledger";

import { getApCounterparty, listApCounterparties } from "../lib/ap-subledger-counterparty.service";

function companyIdFrom(req: NextRequest): Promise<number> {
  return resolveApiCompanyIdFromPath(req);
}

export async function handleListApCounterparties(
  req: NextRequest,
): Promise<NextResponse<ApCounterpartyResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  try {
    const counterparties = await listApCounterparties(companyId);
    return ok(counterparties satisfies ApCounterpartyResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGetApCounterparty(
  req: NextRequest,
  context: { params: Promise<{ code: string }> },
): Promise<NextResponse<ApCounterpartyResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  const { code } = await context.params;
  try {
    const counterparty = await getApCounterparty(companyId, decodeURIComponent(code));
    if (!counterparty) return notFoundError("AP counterparty not found");
    return ok(counterparty satisfies ApCounterpartyResponseDto);
  } catch (err) {
    return serverError(err);
  }
}
