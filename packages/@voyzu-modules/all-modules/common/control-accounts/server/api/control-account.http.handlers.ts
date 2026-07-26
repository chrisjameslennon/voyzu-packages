import { type NextRequest, NextResponse } from "next/server";

import type { FilterRequestDto } from "@voyzu/types/params";
import type {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types/errors";
import type {
  ControlAccountPatchRequestDto,
  ControlAccountResponseDto,
  ControlAccountSettingResponseDto,
} from "@voyzu-modules/types/modules/control-accounts";

import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

import {
  filterControlAccounts,
  searchControlAccounts,
  getControlAccount,
  listControlAccountSettings,
  listControlAccountSettingsByLedger,
  patchControlAccount,
} from "../lib/control-account.service";

export async function handleList(
  req: NextRequest,
): Promise<NextResponse<ControlAccountSettingResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await listControlAccountSettings(companyId);
    return ok(accounts satisfies ControlAccountSettingResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleListAp(
  req: NextRequest,
): Promise<NextResponse<ControlAccountSettingResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await listControlAccountSettingsByLedger("ACCOUNTS_PAYABLE", companyId);
    return ok(accounts satisfies ControlAccountSettingResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleListAr(
  req: NextRequest,
): Promise<NextResponse<ControlAccountSettingResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await listControlAccountSettingsByLedger("ACCOUNTS_RECEIVABLE", companyId);
    return ok(accounts satisfies ControlAccountSettingResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleFilter(
  req: NextRequest,
): Promise<NextResponse<ControlAccountResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await filterControlAccounts(filters ?? [], options, companyId);
    return ok(accounts satisfies ControlAccountResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleSearch(
  req: NextRequest,
): Promise<NextResponse<ControlAccountResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return inputValidationError("Query parameter 'q' is required");
    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await searchControlAccounts(q, undefined, companyId);
    return ok(accounts satisfies ControlAccountResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGet(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<ControlAccountResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    const account = await getControlAccount(code, companyId);
    if (!account) return notFoundError(`Control account code ${code} was not found`);
    return ok(account satisfies ControlAccountResponseDto);
  } catch (err) {
    return serverError(err);
  }
}

export async function handlePatch(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<ControlAccountResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const body = await parseBody<ControlAccountPatchRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await patchControlAccount(code, body, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


