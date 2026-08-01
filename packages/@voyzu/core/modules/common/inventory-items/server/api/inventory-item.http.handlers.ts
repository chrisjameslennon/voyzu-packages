import { type NextRequest, NextResponse } from "next/server";

import type { CodesRequestDto, FilterRequestDto } from "@voyzu/types/params";
import type { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto, InputValidationErrorResponseDto } from "@voyzu/types/errors";
import type {
  InventoryItemBatchPatchRequestDto,
  InventoryItemBatchUpdateRequestDto,
  InventoryItemCreateRequestDto,
  InventoryItemPatchRequestDto,
  InventoryItemResponseDto,
  InventoryItemUpdateRequestDto,
} from "@voyzu/core/types/modules/inventory-items";
import { businessRuleError, inputValidationError, notFoundError, serverError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { created, noContent, ok } from "@voyzu/capability/http";
import { BusinessRuleError, InputValidationError, NotFoundError } from "@voyzu/capability/errors";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

import {
  activateInventoryItem,
  activateInventoryItems,
  batchCreateInventoryItems,
  batchDeleteInventoryItems,
  batchGetInventoryItems,
  batchPatchInventoryItems,
  batchUpdateInventoryItems,
  createInventoryItem,
  deactivateInventoryItem,
  deactivateInventoryItems,
  deleteInventoryItem,
  filterInventoryItems,
  getInventoryItem,
  listInventoryItems,
  patchInventoryItem,
  searchInventoryItems,
  updateInventoryItem,
} from "../lib/inventory-item.service";

export async function handleList(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await listInventoryItems(companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleFilter(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await filterInventoryItems(filters ?? [], options, companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleSearch(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return inputValidationError("Query parameter 'q' is required");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await searchInventoryItems(q, undefined, companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGet(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryItemResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const decodedCode = decodeURIComponent(code);
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await getInventoryItem(decodedCode, companyId);
    if (!out) return notFoundError(`Inventory item ${decodedCode} not found`);
    return ok(out);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleCreate(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return created(await createInventoryItem(await parseBody<InventoryItemCreateRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    return serverError(err);
  }
}

export async function handleUpdate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryItemResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await updateInventoryItem(decodeURIComponent(code), await parseBody<InventoryItemUpdateRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handlePatch(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryItemResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await patchInventoryItem(decodeURIComponent(code), await parseBody<InventoryItemPatchRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDelete(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<null | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    await deleteInventoryItem(decodeURIComponent(code), companyId);
    return noContent();
  } catch (err) {
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleActivate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryItemResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateInventoryItem(decodeURIComponent(code), companyId));
  } catch (err) {
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDeactivate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<InventoryItemResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateInventoryItem(decodeURIComponent(code), companyId));
  } catch (err) {
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

async function parseCodes(req: NextRequest): Promise<string[]> {
  const body = await parseBody<CodesRequestDto>(req);
  if (!Array.isArray(body.codes)) throw new InputValidationError("codes must be an array");
  return body.codes.map(String);
}

export async function handleBatchGet(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchGetInventoryItems(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    return serverError(err);
  }
}

export async function handleBatchCreate(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return created(await batchCreateInventoryItems(await parseBody<InventoryItemCreateRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    return serverError(err);
  }
}

export async function handleBatchUpdate(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchUpdateInventoryItems(await parseBody<InventoryItemBatchUpdateRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchPatch(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchPatchInventoryItems(await parseBody<InventoryItemBatchPatchRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDelete(req: NextRequest): Promise<NextResponse<null | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    await batchDeleteInventoryItems(await parseCodes(req), companyId);
    return noContent();
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchActivate(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto[] | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateInventoryItems(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDeactivate(req: NextRequest): Promise<NextResponse<InventoryItemResponseDto[] | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateInventoryItems(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}
