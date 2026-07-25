import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";

import type { EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto, InputValidationErrorResponseDto } from "@voyzu/types/errors";
import type { TaxSubledgerEntryResponseDto } from "@voyzu/types/modules/tax-ledger";
import { serverError, notFoundError } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";

import { getTaxSubledgerEntry, listTaxSubledgerEntries } from "../lib/tax-ledger.service";

export async function handleListTaxEntries(
  req: NextRequest,
): Promise<NextResponse<TaxSubledgerEntryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await resolveApiCompanyIdFromPath(req);
  try {
    const entries = await listTaxSubledgerEntries(companyId);
    return ok(entries satisfies TaxSubledgerEntryResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGetTaxEntry(
  req: NextRequest,
  context: { params: Promise<{ code: string }> },
): Promise<NextResponse<TaxSubledgerEntryResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await resolveApiCompanyIdFromPath(req);
  const { code } = await context.params;
  try {
    const entry = await getTaxSubledgerEntry(companyId, decodeURIComponent(code));
    if (!entry) return notFoundError("Tax ledger entry not found");
    return ok(entry);
  } catch (err) {
    return serverError(err);
  }
}


