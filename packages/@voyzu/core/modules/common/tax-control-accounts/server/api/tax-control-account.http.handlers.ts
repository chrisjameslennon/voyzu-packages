import { type NextRequest, NextResponse } from "next/server";

import type {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types/errors";
import type { TaxControlAccountPatchRequestDto } from "@voyzu/core/types/modules/tax-control-accounts";
import type { TaxControlAccountResponseDto } from "@voyzu/core/types/modules/tax-control-accounts";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

import {
  listTaxControlAccounts,
  patchTaxControlAccount,
} from "../lib/tax-control-account.service";

export async function handleListTaxControlAccounts(
  req: NextRequest,
): Promise<NextResponse<TaxControlAccountResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await listTaxControlAccounts(companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handlePatchTaxControlAccount(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<TaxControlAccountResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const body = await parseBody<TaxControlAccountPatchRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await patchTaxControlAccount(code, body, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


