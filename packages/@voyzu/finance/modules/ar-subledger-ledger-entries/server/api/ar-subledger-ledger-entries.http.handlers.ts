import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/finance/common/server";

import type { EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto, InputValidationErrorResponseDto } from "@voyzu/types/errors";
import type { ArSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/ar-subledger";
import { serverError, notFoundError } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";

import {
  listArSubledgerEntries,
  getArSubledgerEntry,
} from "../lib/ar-subledger-ledger-entries.service";

function companyIdFrom(req: NextRequest): Promise<number> {
  return resolveApiCompanyIdFromPath(req);
}

export async function handleListArEntries(
  req: NextRequest,
): Promise<NextResponse<ArSubledgerEntryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  try {
    const entries = await listArSubledgerEntries(companyId);
    return ok(entries satisfies ArSubledgerEntryResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGetArEntry(
  req: NextRequest,
  context: { params: Promise<{ code: string }> },
): Promise<NextResponse<ArSubledgerEntryResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  const { code } = await context.params;
  try {
    const entry = await getArSubledgerEntry(companyId, decodeURIComponent(code));
    if (!entry) return notFoundError("AR subledger entry not found");
    return ok(entry satisfies ArSubledgerEntryResponseDto);
  } catch (err) {
    return serverError(err);
  }
}
