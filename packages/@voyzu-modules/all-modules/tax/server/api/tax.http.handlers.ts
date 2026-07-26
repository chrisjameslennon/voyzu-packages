import { type NextRequest, NextResponse } from "next/server";

import { inputValidationError, notFoundError, ok, serverError } from "@voyzu/capability/http";
import type { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type { TaxAuthorityResponseDto } from "@voyzu-modules/types/modules/tax";

import { getTaxAuthority, listApplicableTaxAuthorities, listTaxAuthorities } from "../lib/tax.service";

export async function handleListTaxAuthorities(
  req: NextRequest,
): Promise<NextResponse<TaxAuthorityResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const countryCode = req.nextUrl.searchParams.get("countryCode") ?? undefined;
    const rawCompanyId = req.nextUrl.searchParams.get("companyId");
    if (rawCompanyId) {
      const companyId = Number.parseInt(rawCompanyId, 10);
      if (!Number.isSafeInteger(companyId) || companyId <= 0) return inputValidationError("companyId must be a positive integer");
      return ok(await listApplicableTaxAuthorities(companyId));
    }
    return ok(await listTaxAuthorities(countryCode));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGetTaxAuthority(
  _req: NextRequest,
  context: { params: Promise<{ code: string }> },
): Promise<NextResponse<TaxAuthorityResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  const { code } = await context.params;
  if (!code) return inputValidationError("code is required");
  try {
    const authority = await getTaxAuthority(decodeURIComponent(code));
    if (!authority) return notFoundError("Tax authority not found");
    return ok(authority);
  } catch (err) {
    return serverError(err);
  }
}
