import { type NextRequest, NextResponse } from "next/server";

import type { FilterRequestDto, FinancialDocumentDefaultKeysRequestDto } from "@voyzu/types/params";
import type {
  BusinessRuleErrorResponseDto,
  ConflictErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types/errors";
import type { FinancialDocumentDefaultResponseDto } from "@voyzu/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultCreateRequestDto } from "@voyzu/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultUpdateRequestDto } from "@voyzu/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultPatchRequestDto } from "@voyzu/types/modules/financial-document-defaults";

import { businessRuleError, conflictError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { created, noContent, ok } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

import {
  listFinancialDocumentDefaults,
  filterFinancialDocumentDefaults,
  searchFinancialDocumentDefaults,
  getFinancialDocumentDefault,
  createFinancialDocumentDefault,
  updateFinancialDocumentDefault,
  patchFinancialDocumentDefault,
  deleteFinancialDocumentDefault,
  batchCreateFinancialDocumentDefaults,
  batchGetFinancialDocumentDefaults,
  batchUpdateFinancialDocumentDefaults,
  batchPatchFinancialDocumentDefaults,
  batchDeleteFinancialDocumentDefaults,
  activateFinancialDocumentDefault,
  activateFinancialDocumentDefaults,
  deactivateFinancialDocumentDefault,
  deactivateFinancialDocumentDefaults,
  normalizeFinancialDocumentDefaultKeys,
  decodeFinancialDocumentDefaultKey,
} from "../lib/financial-document-default.service";

// Collection operations.


export async function handleList(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentDefaultResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    const codes = await listFinancialDocumentDefaults(companyId);
    return ok(codes satisfies FinancialDocumentDefaultResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleFilter(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentDefaultResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const codes = await filterFinancialDocumentDefaults(filters ?? [], options, companyId);
    return ok(codes satisfies FinancialDocumentDefaultResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleSearch(
  req: NextRequest,
): Promise<
  NextResponse<FinancialDocumentDefaultResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return inputValidationError("Query parameter 'q' is required");
    const { companyId } = await resolveApiSettingsScope(req);
    const codes = await searchFinancialDocumentDefaults(q, undefined, companyId);
    return ok(codes satisfies FinancialDocumentDefaultResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

// Item operations.


export async function handleGet(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<
  NextResponse<FinancialDocumentDefaultResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { code } = await params;
    const key = decodeFinancialDocumentDefaultKey(code);
    const { companyId } = await resolveApiSettingsScope(req);
    const pc = key ? await getFinancialDocumentDefault(key.documentCode, key.code, companyId) : null;
    if (!pc) return notFoundError(`Posting code ${code} was not found`);
    return ok(pc satisfies FinancialDocumentDefaultResponseDto);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleCreate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentDefaultResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<FinancialDocumentDefaultCreateRequestDto>(req);
    const pc = await createFinancialDocumentDefault(body);
    return created(pc satisfies FinancialDocumentDefaultResponseDto);
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
  NextResponse<FinancialDocumentDefaultResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { code } = await params;
    const key = decodeFinancialDocumentDefaultKey(code);
    if (!key) return inputValidationError("Posting code key is invalid");
    const body = await parseBody<FinancialDocumentDefaultUpdateRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const pc = await updateFinancialDocumentDefault(key.documentCode, key.code, body, companyId);
    return ok(pc satisfies FinancialDocumentDefaultResponseDto);
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
  NextResponse<FinancialDocumentDefaultResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { code } = await params;
    const key = decodeFinancialDocumentDefaultKey(code);
    if (!key) return inputValidationError("Posting code key is invalid");
    const body = await parseBody<FinancialDocumentDefaultPatchRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const pc = await patchFinancialDocumentDefault(key.documentCode, key.code, body, companyId);
    return ok(pc satisfies FinancialDocumentDefaultResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleDelete(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<
  NextResponse<null | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>
> {
  try {
    const { code } = await params;
    const key = decodeFinancialDocumentDefaultKey(code);
    if (!key) return inputValidationError("Posting code key is invalid");
    await deleteFinancialDocumentDefault(key.documentCode, key.code);
    return noContent();
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

// Batch operations.


export async function handleBatchCreate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentDefaultResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<FinancialDocumentDefaultCreateRequestDto[]>(req);
    if (!Array.isArray(body)) return inputValidationError("Request body must be an array");
    const out = await batchCreateFinancialDocumentDefaults(body);
    return created(out satisfies FinancialDocumentDefaultResponseDto[]);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleBatchGet(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentDefaultResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { keys } = await parseBody<FinancialDocumentDefaultKeysRequestDto>(req);
    const parsedKeys = normalizeFinancialDocumentDefaultKeys(keys);
    if (!parsedKeys.length) return inputValidationError("'keys' must be a non-empty array");
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await batchGetFinancialDocumentDefaults(parsedKeys, companyId);
    return ok(out satisfies FinancialDocumentDefaultResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleBatchUpdate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentDefaultResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<Array<FinancialDocumentDefaultUpdateRequestDto & { documentCode: string; code: string }>>(req);
    if (!Array.isArray(body)) return inputValidationError("Request body must be an array");
    const out = await batchUpdateFinancialDocumentDefaults(body);
    return ok(out satisfies FinancialDocumentDefaultResponseDto[]);
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
): Promise<NextResponse<FinancialDocumentDefaultResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<Array<FinancialDocumentDefaultPatchRequestDto & { documentCode: string; code: string }>>(req);
    if (!Array.isArray(body)) return inputValidationError("Request body must be an array");
    for (const item of body) {
      if (!item.documentCode || !item.code) return inputValidationError("Each item must include documentCode and code");
    }
    const out = await batchPatchFinancialDocumentDefaults(body);
    return ok(out satisfies FinancialDocumentDefaultResponseDto[]);
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
): Promise<NextResponse<null | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { keys } = await parseBody<FinancialDocumentDefaultKeysRequestDto>(req);
    const parsedKeys = normalizeFinancialDocumentDefaultKeys(keys);
    if (!parsedKeys.length) return inputValidationError("'keys' must be a non-empty array");
    await batchDeleteFinancialDocumentDefaults(parsedKeys);
    return noContent();
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    return serverError(err);
  }
}

export async function handleActivate(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialDocumentDefaultResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const key = decodeFinancialDocumentDefaultKey(code);
    if (!key) return inputValidationError("Posting code key is invalid");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateFinancialDocumentDefault(key.documentCode, key.code, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDeactivate(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialDocumentDefaultResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const key = decodeFinancialDocumentDefaultKey(code);
    if (!key) return inputValidationError("Posting code key is invalid");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateFinancialDocumentDefault(key.documentCode, key.code, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchActivate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentDefaultResponseDto[] | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { keys } = await parseBody<FinancialDocumentDefaultKeysRequestDto>(req);
    const parsedKeys = normalizeFinancialDocumentDefaultKeys(keys);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateFinancialDocumentDefaults(parsedKeys, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDeactivate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentDefaultResponseDto[] | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { keys } = await parseBody<FinancialDocumentDefaultKeysRequestDto>(req);
    const parsedKeys = normalizeFinancialDocumentDefaultKeys(keys);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateFinancialDocumentDefaults(parsedKeys, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}
