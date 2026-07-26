import { type NextRequest, NextResponse } from "next/server";

import type { CodesRequestDto, FilterRequestDto } from "@voyzu/types/params";
import type {
  BusinessRuleErrorResponseDto,
  ConflictErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types/errors";
import type { DimensionResponseDto } from "@voyzu-modules/core/types/modules/dimensions";
import type { DimensionValueResponseDto } from "@voyzu-modules/core/types/modules/dimensions";
import type { DimensionCreateRequestDto } from "@voyzu-modules/core/types/modules/dimensions";
import type { DimensionUpdateRequestDto } from "@voyzu-modules/core/types/modules/dimensions";
import type { DimensionPatchRequestDto } from "@voyzu-modules/core/types/modules/dimensions";
import type { DimensionBatchPatchRequestDto, DimensionBatchUpdateRequestDto } from "@voyzu-modules/core/types/modules/dimensions";
import type { DimensionValueCreateRequestDto } from "@voyzu-modules/core/types/modules/dimensions";
import type { DimensionValuePatchRequestDto } from "@voyzu-modules/core/types/modules/dimensions";

import { businessRuleError, conflictError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { created, noContent, ok } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

import {
  activateDimensions,
  activateDimension,
  listDimensions,
  filterDimensions,
  searchDimensions,
  getDimension,
  createDimension,
  updateDimension,
  patchDimension,
  deleteDimension,
  deactivateDimensions,
  deactivateDimension,
  batchCreateDimensions,
  batchGetDimensions,
  batchUpdateDimensions,
  batchPatchDimensions,
  batchDeleteDimensions,
  createDimensionValue,
  listDimensionValues,
  patchDimensionValue,
  deleteDimensionValue,
} from "../lib/dimension.service";

// Operations using "code".

// ── list  operations ──


export async function handleList(
  req: NextRequest,
): Promise<NextResponse<DimensionResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    const dimensions = await listDimensions(companyId);
    return ok(dimensions satisfies DimensionResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleFilter(
  req: NextRequest,
): Promise<NextResponse<DimensionResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const dimensions = await filterDimensions(filters ?? [], options, companyId);
    return ok(dimensions satisfies DimensionResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleSearch(
  req: NextRequest,
): Promise<
  NextResponse<DimensionResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) {
      return inputValidationError("Query parameter 'q' is required");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const dimensions = await searchDimensions(q, undefined, companyId);
    return ok(dimensions satisfies DimensionResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

// ── item operations ──


export async function handleGet(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<
  NextResponse<
    | DimensionResponseDto
    | EntityNotFoundErrorResponseDto
    | InternalServerErrorResponseDto
  >
> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    const dimension = await getDimension(code, companyId);
    if (!dimension) {
      return notFoundError(`Dimension code ${code} was not found`);
    }
    return ok(dimension satisfies DimensionResponseDto);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleCreate(
  req: NextRequest,
): Promise<NextResponse<DimensionResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<DimensionCreateRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const dimension = await createDimension(body, companyId);
    return created(dimension satisfies DimensionResponseDto);
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
    | DimensionResponseDto
    | BusinessRuleErrorResponseDto
    | InputValidationErrorResponseDto
    | ConflictErrorResponseDto
    | EntityNotFoundErrorResponseDto
    | InternalServerErrorResponseDto
  >
> {
  try {
    const { code } = await params;
    const body = await parseBody<DimensionUpdateRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const dimension = await updateDimension(code, body, companyId);
    return ok(dimension satisfies DimensionResponseDto);
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
    | DimensionResponseDto
    | BusinessRuleErrorResponseDto
    | InputValidationErrorResponseDto
    | ConflictErrorResponseDto
    | EntityNotFoundErrorResponseDto
    | InternalServerErrorResponseDto
  >
> {
  try {
    const { code } = await params;
    const body = await parseBody<DimensionPatchRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const dimension = await patchDimension(code, body, companyId);
    return ok(dimension satisfies DimensionResponseDto);
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
    await deleteDimension(code, companyId);
    return noContent();
  } catch (err) {
    return serverError(err);
  }
}

// Batch operations.


export async function handleBatchCreate(
  req: NextRequest,
): Promise<
  NextResponse<DimensionResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const body = await parseBody<DimensionCreateRequestDto[]>(req);
    if (!Array.isArray(body)) {
      return inputValidationError("Request body must be an array");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const dimensions = await batchCreateDimensions(body, companyId);
    return created(dimensions satisfies DimensionResponseDto[]);
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
  NextResponse<DimensionResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) {
      return inputValidationError("'codes' must be an array");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const dimensions = await batchGetDimensions(codes, companyId);
    return ok(dimensions satisfies DimensionResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleBatchUpdate(
  req: NextRequest,
): Promise<
  NextResponse<DimensionResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const body = await parseBody<DimensionBatchUpdateRequestDto[]>(req);
    if (!Array.isArray(body)) {
      return inputValidationError("Request body must be an array");
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const results = await batchUpdateDimensions(body, companyId);
    return ok(results satisfies DimensionResponseDto[]);
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
  NextResponse<DimensionResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const body = await parseBody<DimensionBatchPatchRequestDto[]>(req);
    if (!Array.isArray(body)) {
      return inputValidationError("Request body must be an array");
    }
    for (const item of body) {
      if (!item.code) {
        return inputValidationError("Each item must include a 'code' field");
      }
    }

    const { companyId } = await resolveApiSettingsScope(req);
    const results = await batchPatchDimensions(body, companyId);
    return ok(results satisfies DimensionResponseDto[]);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}

export async function handleBatchActivate(
  req: NextRequest,
): Promise<
  NextResponse<DimensionResponseDto[] | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateDimensions(codes.map(String), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleActivate(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<DimensionResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateDimension(code, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDeactivate(
  req: NextRequest,
): Promise<
  NextResponse<DimensionResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateDimensions(codes.map(String), companyId));
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
): Promise<NextResponse<DimensionResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateDimension(code, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
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
    await batchDeleteDimensions(codes, companyId);
    return noContent();
  } catch (err) {
    return serverError(err);
  }
}




export async function handleListValues(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<DimensionValueResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    const values = await listDimensionValues(code, companyId);
    return ok(values satisfies DimensionValueResponseDto[]);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


export async function handleCreateValue(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<
  NextResponse<DimensionValueResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { code } = await params;
    const body = await parseBody<DimensionValueCreateRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const value = await createDimensionValue(code, body, companyId);
    return created(value satisfies DimensionValueResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handlePatchValue(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<
  NextResponse<DimensionValueResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { id } = await params;
    const body = await parseBody<DimensionValuePatchRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const value = await patchDimensionValue(Number(id), body, companyId);
    return ok(value satisfies DimensionValueResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleDeleteValue(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<null | InternalServerErrorResponseDto>> {
  try {
    const { id } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    await deleteDimensionValue(Number(id), companyId);
    return noContent();
  } catch (err) {
    return serverError(err);
  }
}


