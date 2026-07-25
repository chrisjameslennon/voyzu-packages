import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";

import { notFoundError, ok, serverError } from "@voyzu/capability/http";
import type { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type { ArCounterpartyResponseDto } from "@voyzu/types/modules/ar-subledger";

import { getArCounterparty, listArCounterparties } from "../lib/ar-subledger-counterparty.service";

function companyIdFrom(req: NextRequest): Promise<number> {
  return resolveApiCompanyIdFromPath(req);
}

export async function handleListArCounterparties(
  req: NextRequest,
): Promise<NextResponse<ArCounterpartyResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  try {
    const counterparties = await listArCounterparties(companyId);
    return ok(counterparties satisfies ArCounterpartyResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGetArCounterparty(
  req: NextRequest,
  context: { params: Promise<{ code: string }> },
): Promise<NextResponse<ArCounterpartyResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  const { code } = await context.params;
  try {
    const counterparty = await getArCounterparty(companyId, decodeURIComponent(code));
    if (!counterparty) return notFoundError("AR counterparty not found");
    return ok(counterparty satisfies ArCounterpartyResponseDto);
  } catch (err) {
    return serverError(err);
  }
}
