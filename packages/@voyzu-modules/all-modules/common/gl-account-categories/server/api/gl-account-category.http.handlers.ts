import { type NextRequest, NextResponse } from "next/server";

import {
  businessRuleError,
  conflictError,
  created,
  inputValidationError,
  noContent,
  notFoundError,
  ok,
  parseBody,
  serverError,
} from "@voyzu/capability/http";
import { BusinessRuleError, ConflictError, InputValidationError, NotFoundError } from "@voyzu/capability/errors";
import type {
  ConflictErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
  BusinessRuleErrorResponseDto,
} from "@voyzu/types/errors";
import type { CodesRequestDto, FilterRequestDto } from "@voyzu/types/params";
import type {
  GlAccountCategoryCreateRequestDto,
  GlAccountCategoryBatchPatchRequestDto,
  GlAccountCategoryBatchUpdateRequestDto,
  GlAccountCategoryPatchRequestDto,
  GlAccountCategoryResponseDto,
  GlAccountCategoryUpdateRequestDto,
} from "@voyzu-modules/types/modules/gl-account-categories";

import { resolveApiSettingsScope } from "../../../server/settings-scope";
import {
  activateGlAccountCategories,
  activateGlAccountCategory,
  batchCreateGlAccountCategories,
  batchDeleteGlAccountCategories,
  batchGetGlAccountCategories,
  batchPatchGlAccountCategories,
  batchUpdateGlAccountCategories,
  createGlAccountCategory,
  deactivateGlAccountCategories,
  deactivateGlAccountCategory,
  deleteGlAccountCategory,
  filterGlAccountCategories,
  getGlAccountCategory,
  listGlAccountCategories,
  patchGlAccountCategory,
  searchGlAccountCategories,
  updateGlAccountCategory,
} from "../lib/gl-account-category.service";

async function scopedCompanyId(request: NextRequest): Promise<number> {
  return (await resolveApiSettingsScope(request)).companyId;
}

export async function handleList(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    return ok(await listGlAccountCategories(await scopedCompanyId(request)));
  } catch (error) {
    return serverError(error);
  }
}

export async function handleFilter(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(request);
    return ok(await filterGlAccountCategories(filters ?? [], options, await scopedCompanyId(request)));
  } catch (error) {
    return serverError(error);
  }
}

export async function handleSearch(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const query = request.nextUrl.searchParams.get("q");
    if (!query) return inputValidationError("Query parameter 'q' is required");
    return ok(await searchGlAccountCategories(query, undefined, await scopedCompanyId(request)));
  } catch (error) {
    return serverError(error);
  }
}

export async function handleGet(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<GlAccountCategoryResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const category = await getGlAccountCategory(code, await scopedCompanyId(request));
    if (!category) return notFoundError(`GL account category ${code} was not found`);
    return ok(category);
  } catch (error) {
    return serverError(error);
  }
}

export async function handleCreate(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    return created(await createGlAccountCategory(await parseBody<GlAccountCategoryCreateRequestDto>(request), await scopedCompanyId(request)));
  } catch (error) {
    if (error instanceof InputValidationError) return inputValidationError(error.message);
    if (error instanceof ConflictError) return conflictError(error.message);
    return serverError(error);
  }
}

export async function handleUpdate(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<GlAccountCategoryResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    return ok(await updateGlAccountCategory(code, await parseBody<GlAccountCategoryUpdateRequestDto>(request), await scopedCompanyId(request)));
  } catch (error) {
    if (error instanceof InputValidationError) return inputValidationError(error.message);
    if (error instanceof BusinessRuleError) return businessRuleError(error.message);
    if (error instanceof ConflictError) return conflictError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}

export async function handlePatch(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<GlAccountCategoryResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    return ok(await patchGlAccountCategory(code, await parseBody<GlAccountCategoryPatchRequestDto>(request), await scopedCompanyId(request)));
  } catch (error) {
    if (error instanceof InputValidationError) return inputValidationError(error.message);
    if (error instanceof BusinessRuleError) return businessRuleError(error.message);
    if (error instanceof ConflictError) return conflictError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}

export async function handleDelete(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<null | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    await deleteGlAccountCategory(code, await scopedCompanyId(request));
    return noContent();
  } catch (error) {
    if (error instanceof BusinessRuleError) return businessRuleError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}
export async function handleBatchCreate(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto[] | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    return created(await batchCreateGlAccountCategories(await parseBody<GlAccountCategoryCreateRequestDto[]>(request), await scopedCompanyId(request)));
  } catch (error) {
    if (error instanceof InputValidationError) return inputValidationError(error.message);
    if (error instanceof ConflictError) return conflictError(error.message);
    return serverError(error);
  }
}

export async function handleBatchGet(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    return ok(await batchGetGlAccountCategories(codes.map(String), await scopedCompanyId(request)));
  } catch (error) {
    return serverError(error);
  }
}

export async function handleBatchUpdate(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    return ok(await batchUpdateGlAccountCategories(await parseBody<GlAccountCategoryBatchUpdateRequestDto[]>(request), await scopedCompanyId(request)));
  } catch (error) {
    return serverError(error);
  }
}

export async function handleBatchPatch(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    return ok(await batchPatchGlAccountCategories(await parseBody<GlAccountCategoryBatchPatchRequestDto[]>(request), await scopedCompanyId(request)));
  } catch (error) {
    return serverError(error);
  }
}

export async function handleBatchActivate(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto[] | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    return ok(await activateGlAccountCategories(codes.map(String), await scopedCompanyId(request)));
  } catch (error) {
    if (error instanceof InputValidationError) return inputValidationError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}

export async function handleActivate(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<GlAccountCategoryResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    return ok(await activateGlAccountCategory(code, await scopedCompanyId(request)));
  } catch (error) {
    if (error instanceof InputValidationError) return inputValidationError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}

export async function handleBatchDeactivate(request: NextRequest): Promise<NextResponse<GlAccountCategoryResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    return ok(await deactivateGlAccountCategories(codes.map(String), await scopedCompanyId(request)));
  } catch (error) {
    if (error instanceof InputValidationError) return inputValidationError(error.message);
    if (error instanceof BusinessRuleError) return businessRuleError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}

export async function handleDeactivate(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<GlAccountCategoryResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    return ok(await deactivateGlAccountCategory(code, await scopedCompanyId(request)));
  } catch (error) {
    if (error instanceof InputValidationError) return inputValidationError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}

export async function handleBatchDelete(request: NextRequest): Promise<NextResponse<null | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    await batchDeleteGlAccountCategories(codes.map(String), await scopedCompanyId(request));
    return noContent();
  } catch (error) {
    if (error instanceof BusinessRuleError) return businessRuleError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}

