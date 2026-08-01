import { type NextRequest, NextResponse } from "next/server";

import type {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types/errors";
import type { InventoryControlAccountPatchRequestDto } from "@voyzu/core/types/modules/inventory-control-accounts";
import type { InventoryControlAccountSettingResponseDto } from "@voyzu/core/types/modules/inventory-control-accounts";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

import {
  listInventoryControlAccountSettings,
  patchInventoryControlAccountSetting,
} from "../lib/inventory-control-account.service";

export async function handleListInventoryControlAccounts(
  req: NextRequest,
): Promise<NextResponse<InventoryControlAccountSettingResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await listInventoryControlAccountSettings(companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handlePatchInventoryControlAccount(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<InventoryControlAccountSettingResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const body = await parseBody<InventoryControlAccountPatchRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await patchInventoryControlAccountSetting(code, body, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


