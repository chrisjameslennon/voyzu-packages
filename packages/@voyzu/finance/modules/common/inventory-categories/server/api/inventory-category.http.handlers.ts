import { type NextRequest, NextResponse } from "next/server";

import type { CodesRequestDto, FilterRequestDto } from "@voyzu/types/params";

import type { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto, InputValidationErrorResponseDto } from "@voyzu/types/errors";
import type {
  InventoryCategoryBatchPatchRequestDto,
  InventoryCategoryBatchUpdateRequestDto,
  InventoryCategoryCreateRequestDto,
  InventoryCategoryPatchRequestDto,
  InventoryCategoryResponseDto,
  InventoryCategoryUpdateRequestDto,
} from "@voyzu/finance/types/modules/inventory-categories";
import { businessRuleError, inputValidationError, notFoundError, serverError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { created, noContent, ok } from "@voyzu/capability/http";
import { BusinessRuleError, InputValidationError, NotFoundError } from "@voyzu/capability/errors";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

import {
  activateInventoryCategories,
  activateInventoryCategory,
  batchCreateInventoryCategories,
  batchDeleteInventoryCategories,
  batchGetInventoryCategories,
  batchPatchInventoryCategories,
  batchUpdateInventoryCategories,
  createInventoryCategory,
  deactivateInventoryCategories,
  deactivateInventoryCategory,
  deleteInventoryCategory,
  filterInventoryCategories,
  getInventoryCategory,
  listInventoryCategories,
  patchInventoryCategory,
  searchInventoryCategories,
  updateInventoryCategory,
} from "../lib/inventory-category.service";

export async function handleList(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await listInventoryCategories(companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleFilter(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await filterInventoryCategories(filters ?? [], options, companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleSearch(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return inputValidationError("Query parameter 'q' is required");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await searchInventoryCategories(q, undefined, companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGet(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryCategoryResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const decodedCode = decodeURIComponent(code);
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await getInventoryCategory(decodedCode, companyId);
    if (!out) return notFoundError(`Inventory category ${decodedCode} not found`);
    return ok(out);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleCreate(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return created(await createInventoryCategory(await parseBody<InventoryCategoryCreateRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    return serverError(err);
  }
}

export async function handleUpdate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryCategoryResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await updateInventoryCategory(decodeURIComponent(code), await parseBody<InventoryCategoryUpdateRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handlePatch(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryCategoryResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await patchInventoryCategory(decodeURIComponent(code), await parseBody<InventoryCategoryPatchRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDelete(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<null | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    await deleteInventoryCategory(decodeURIComponent(code), companyId);
    return noContent();
  } catch (err) {
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleActivate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryCategoryResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateInventoryCategory(decodeURIComponent(code), companyId));
  } catch (err) {
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDeactivate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryCategoryResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateInventoryCategory(decodeURIComponent(code), companyId));
  } catch (err) {
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

async function parseCodes(req: NextRequest): Promise<string[]> {
  const body = await parseBody<CodesRequestDto>(req);
  return body.codes;
}

export async function handleBatchGet(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchGetInventoryCategories(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    return serverError(err);
  }
}

export async function handleBatchCreate(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return created(await batchCreateInventoryCategories(await parseBody<InventoryCategoryCreateRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    return serverError(err);
  }
}

export async function handleBatchUpdate(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchUpdateInventoryCategories(await parseBody<InventoryCategoryBatchUpdateRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchPatch(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchPatchInventoryCategories(await parseBody<InventoryCategoryBatchPatchRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDelete(req: NextRequest): Promise<NextResponse<null | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    await batchDeleteInventoryCategories(await parseCodes(req), companyId);
    return noContent();
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchActivate(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateInventoryCategories(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDeactivate(req: NextRequest): Promise<NextResponse<InventoryCategoryResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateInventoryCategories(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}
