import { type NextRequest, NextResponse } from "next/server";

import type { CodesRequestDto, FilterRequestDto } from "@voyzu/types/params";

import type { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto, InputValidationErrorResponseDto } from "@voyzu/types/errors";
import type {
  ItemPostingProfileBatchPatchRequestDto,
  ItemPostingProfileBatchUpdateRequestDto,
  ItemPostingProfileCreateRequestDto,
  ItemPostingProfilePatchRequestDto,
  ItemPostingProfileResponseDto,
  ItemPostingProfileUpdateRequestDto,
} from "@voyzu/finance/types/modules/inventory-item-posting-profiles";
import { businessRuleError, inputValidationError, notFoundError, serverError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { created, noContent, ok } from "@voyzu/capability/http";
import { BusinessRuleError, DatabaseError, InputValidationError, NotFoundError } from "@voyzu/capability/errors";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

import {
  activateItemPostingProfile,
  activateItemPostingProfiles,
  batchCreateItemPostingProfiles,
  batchDeleteItemPostingProfiles,
  batchGetItemPostingProfiles,
  batchPatchItemPostingProfiles,
  batchUpdateItemPostingProfiles,
  createItemPostingProfile,
  deactivateItemPostingProfile,
  deactivateItemPostingProfiles,
  deleteItemPostingProfile,
  filterItemPostingProfiles,
  getItemPostingProfile,
  listItemPostingProfiles,
  patchItemPostingProfile,
  searchItemPostingProfiles,
  updateItemPostingProfile,
} from "../lib/item-posting-profile.service";

function isInventoryItemPostingProfileReferenceError(err: unknown): err is DatabaseError {
  return err instanceof DatabaseError && err.message.includes("fk_inventory_item_posting_profile");
}

export async function handleList(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await listItemPostingProfiles(companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleFilter(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await filterItemPostingProfiles(filters ?? [], options, companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleSearch(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return inputValidationError("Query parameter 'q' is required");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await searchItemPostingProfiles(q, undefined, companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGet(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<ItemPostingProfileResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const decodedCode = decodeURIComponent(code);
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await getItemPostingProfile(decodedCode, companyId);
    if (!out) return notFoundError(`Item posting profile ${decodedCode} not found`);
    return ok(out);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleCreate(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return created(await createItemPostingProfile(await parseBody<ItemPostingProfileCreateRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    return serverError(err);
  }
}

export async function handleUpdate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<ItemPostingProfileResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await updateItemPostingProfile(decodeURIComponent(code), await parseBody<ItemPostingProfileUpdateRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handlePatch(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<ItemPostingProfileResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await patchItemPostingProfile(decodeURIComponent(code), await parseBody<ItemPostingProfilePatchRequestDto>(req), companyId));
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
    await deleteItemPostingProfile(decodeURIComponent(code), companyId);
    return noContent();
  } catch (err) {
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (isInventoryItemPostingProfileReferenceError(err)) return businessRuleError("This posting code is in use by one or more companies and cannot be deleted.");
    return serverError(err);
  }
}

export async function handleActivate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<ItemPostingProfileResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateItemPostingProfile(decodeURIComponent(code), companyId));
  } catch (err) {
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDeactivate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<ItemPostingProfileResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateItemPostingProfile(decodeURIComponent(code), companyId));
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

export async function handleBatchGet(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchGetItemPostingProfiles(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    return serverError(err);
  }
}

export async function handleBatchCreate(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return created(await batchCreateItemPostingProfiles(await parseBody<ItemPostingProfileCreateRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    return serverError(err);
  }
}

export async function handleBatchUpdate(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchUpdateItemPostingProfiles(await parseBody<ItemPostingProfileBatchUpdateRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchPatch(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchPatchItemPostingProfiles(await parseBody<ItemPostingProfileBatchPatchRequestDto[]>(req), companyId));
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
    await batchDeleteItemPostingProfiles(await parseCodes(req), companyId);
    return noContent();
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (isInventoryItemPostingProfileReferenceError(err)) return businessRuleError("This posting code is in use by one or more companies and cannot be deleted.");
    return serverError(err);
  }
}

export async function handleBatchActivate(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateItemPostingProfiles(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDeactivate(req: NextRequest): Promise<NextResponse<ItemPostingProfileResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateItemPostingProfiles(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}
