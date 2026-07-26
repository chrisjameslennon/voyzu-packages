import { type NextRequest, NextResponse } from "next/server";

import type { CodesRequestDto, FilterRequestDto } from "@voyzu/types/params";
import type {
  BusinessRuleErrorResponseDto,
  ConflictErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types/errors";
import type { GlAccountResponseDto } from "@voyzu-modules/core/types/modules/gl-accounts";
import type { GlAccountCreateRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts";
import type { GlAccountUpdateRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts";
import type { GlAccountPatchRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts";
import type { GlAccountBatchPatchRequestDto, GlAccountBatchUpdateRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts";

import { businessRuleError, conflictError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { created, noContent, ok } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";

import {
  listGlAccounts,
  filterGlAccounts,
  searchGlAccounts,
  getGlAccount,
  createGlAccount,
  updateGlAccount,
  patchGlAccount,
  deleteGlAccount,
  batchCreateGlAccounts,
  batchGetGlAccounts,
  batchUpdateGlAccounts,
  batchPatchGlAccounts,
  batchDeleteGlAccounts,
  activateGlAccount,
  activateGlAccounts,
  deactivateGlAccount,
  deactivateGlAccounts,
} from "../lib/gl-account.service";
import { resolveApiSettingsScope } from "../../../server/settings-scope";




export async function handleList(
  req: NextRequest,
): Promise<NextResponse<GlAccountResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await listGlAccounts(companyId);
    return ok(accounts satisfies GlAccountResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleFilter(
  req: NextRequest,
): Promise<NextResponse<GlAccountResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await filterGlAccounts(filters ?? [], options, companyId);
    return ok(accounts satisfies GlAccountResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleSearch(
  req: NextRequest,
): Promise<
  NextResponse<GlAccountResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) {
      return inputValidationError("Query parameter 'q' is required");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await searchGlAccounts(q, undefined, companyId);
    return ok(accounts satisfies GlAccountResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}



export async function handleGet(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<
  NextResponse<
    | GlAccountResponseDto
    | EntityNotFoundErrorResponseDto
    | InternalServerErrorResponseDto
  >
> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    const account = await getGlAccount(code, companyId);
    if (!account) {
      return notFoundError(`GL account code ${code} was not found`);
    }
    return ok(account satisfies GlAccountResponseDto);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleCreate(
  req: NextRequest,
): Promise<NextResponse<GlAccountResponseDto | InputValidationErrorResponseDto | BusinessRuleErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<GlAccountCreateRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const account = await createGlAccount(body, companyId);
    return created(account satisfies GlAccountResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleUpdate(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<
  NextResponse<
    | GlAccountResponseDto
    | InputValidationErrorResponseDto
    | BusinessRuleErrorResponseDto
    | ConflictErrorResponseDto
    | EntityNotFoundErrorResponseDto
    | InternalServerErrorResponseDto
  >
> {
  try {
    const { code } = await params;
    const body = await parseBody<GlAccountUpdateRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const account = await updateGlAccount(code, body, companyId);
    return ok(account satisfies GlAccountResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handlePatch(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<
  NextResponse<
    | GlAccountResponseDto
    | InputValidationErrorResponseDto
    | BusinessRuleErrorResponseDto
    | ConflictErrorResponseDto
    | EntityNotFoundErrorResponseDto
    | InternalServerErrorResponseDto
  >
> {
  try {
    const { code } = await params;
    const body = await parseBody<GlAccountPatchRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const account = await patchGlAccount(code, body, companyId);
    return ok(account satisfies GlAccountResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleDelete(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<
  NextResponse<
    | null
    | EntityNotFoundErrorResponseDto
    | InternalServerErrorResponseDto
  >
> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    await deleteGlAccount(code, companyId);
    return noContent();
  } catch (err) {
    return serverError(err);
  }
}



export async function handleBatchCreate(
  req: NextRequest,
): Promise<
  NextResponse<GlAccountResponseDto[] | InputValidationErrorResponseDto | BusinessRuleErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const body = await parseBody<GlAccountCreateRequestDto[]>(req);
    if (!Array.isArray(body)) {
      return inputValidationError("Request body must be an array");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await batchCreateGlAccounts(body, companyId);
    return created(accounts satisfies GlAccountResponseDto[]);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleBatchGet(
  req: NextRequest,
): Promise<
  NextResponse<GlAccountResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) {
      return inputValidationError("'codes' must be an array");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await batchGetGlAccounts(codes, companyId);
    return ok(accounts satisfies GlAccountResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleBatchUpdate(
  req: NextRequest,
): Promise<
  NextResponse<GlAccountResponseDto[] | InputValidationErrorResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const body = await parseBody<GlAccountBatchUpdateRequestDto[]>(req);
    if (!Array.isArray(body)) {
      return inputValidationError("Request body must be an array");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const results = await batchUpdateGlAccounts(body, companyId);
    return ok(results satisfies GlAccountResponseDto[]);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleBatchPatch(
  req: NextRequest,
): Promise<
  NextResponse<GlAccountResponseDto[] | InputValidationErrorResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const body = await parseBody<GlAccountBatchPatchRequestDto[]>(req);
    if (!Array.isArray(body)) {
      return inputValidationError("Request body must be an array");
    }
    for (const item of body) {
      if (!item.code) {
        return inputValidationError("Each item must include a 'code' field");
      }
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const results = await batchPatchGlAccounts(body, companyId);
    return ok(results satisfies GlAccountResponseDto[]);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleBatchDelete(
  req: NextRequest,
): Promise<
  NextResponse<null | InputValidationErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) {
      return inputValidationError("'codes' must be an array");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    await batchDeleteGlAccounts(codes, companyId);
    return noContent();
  } catch (err) {
    return serverError(err);
  }
}


export async function handleBatchActivate(
  req: NextRequest,
): Promise<NextResponse<GlAccountResponseDto[] | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) {
      return inputValidationError("'codes' must be an array");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await activateGlAccounts(codes, companyId);
    return ok(accounts satisfies GlAccountResponseDto[]);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleActivate(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<GlAccountResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateGlAccount(code, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDeactivate(
  req: NextRequest,
): Promise<NextResponse<GlAccountResponseDto[] | InputValidationErrorResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) {
      return inputValidationError("'codes' must be an array");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const accounts = await deactivateGlAccounts(codes, companyId);
    return ok(accounts satisfies GlAccountResponseDto[]);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDeactivate(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<GlAccountResponseDto | InputValidationErrorResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateGlAccount(code, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}
