import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";

import type { EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto, InputValidationErrorResponseDto } from "@voyzu/types/errors";
import type { ApSubledgerEntryResponseDto } from "@voyzu/types/modules/ap-subledger";
import { serverError, notFoundError } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";

import {
  listApSubledgerEntries,
  getApSubledgerEntry,
} from "../lib/ap-subledger-ledger-entries.service";

function companyIdFrom(req: NextRequest): Promise<number> {
  return resolveApiCompanyIdFromPath(req);
}

export async function handleListApEntries(
  req: NextRequest,
): Promise<NextResponse<ApSubledgerEntryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  try {
    const entries = await listApSubledgerEntries(companyId);
    return ok(entries satisfies ApSubledgerEntryResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGetApEntry(
  req: NextRequest,
  context: { params: Promise<{ code: string }> },
): Promise<NextResponse<ApSubledgerEntryResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  const { code } = await context.params;
  try {
    const entry = await getApSubledgerEntry(companyId, decodeURIComponent(code));
    if (!entry) return notFoundError("AP subledger entry not found");
    return ok(entry satisfies ApSubledgerEntryResponseDto);
  } catch (err) {
    return serverError(err);
  }
}


