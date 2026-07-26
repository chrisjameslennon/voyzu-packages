import { type NextRequest, NextResponse } from "next/server";

import type { CodesRequestDto, FilterRequestDto } from "@voyzu/types/params";
import type {
  BusinessRuleErrorResponseDto,
  ConflictErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types/errors";
import type { FinancialDocumentTypeResponseDto } from "@voyzu-modules/core/types/modules/financial-document-types";
import type { FinancialDocumentTypeCreateRequestDto } from "@voyzu-modules/core/types/modules/financial-document-types";
import type { FinancialDocumentTypeUpdateRequestDto } from "@voyzu-modules/core/types/modules/financial-document-types";
import type { FinancialDocumentTypePatchRequestDto } from "@voyzu-modules/core/types/modules/financial-document-types";

import { businessRuleError, conflictError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { created, noContent, ok } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

import {
  listFinancialDocumentTypes,
  filterFinancialDocumentTypes,
  searchFinancialDocumentTypes,
  getFinancialDocumentType,
  createFinancialDocumentType,
  updateFinancialDocumentType,
  patchFinancialDocumentType,
  deleteFinancialDocumentType,
  batchGetFinancialDocumentTypes,
  batchCreateFinancialDocumentTypes,
  batchUpdateFinancialDocumentTypes,
  batchPatchFinancialDocumentTypes,
  batchDeleteFinancialDocumentTypes,
  activateFinancialDocumentType,
  deactivateFinancialDocumentType,
  activateFinancialDocumentTypes,
  deactivateFinancialDocumentTypes,
} from "../lib/financial-document-type.service";


export async function handleList(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentTypeResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await listFinancialDocumentTypes(companyId);
    return ok(out satisfies FinancialDocumentTypeResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleFilter(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentTypeResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await filterFinancialDocumentTypes(filters ?? [], options, companyId);
    return ok(out satisfies FinancialDocumentTypeResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleSearch(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentTypeResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return inputValidationError("Query parameter 'q' is required");
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await searchFinancialDocumentTypes(q, undefined, companyId);
    return ok(out satisfies FinancialDocumentTypeResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleGet(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialDocumentTypeResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await getFinancialDocumentType(code, companyId);
    if (!out) return notFoundError(`Financial document type ${code} was not found`);
    return ok(out satisfies FinancialDocumentTypeResponseDto);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleCreate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentTypeResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<FinancialDocumentTypeCreateRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await createFinancialDocumentType(body, companyId);
    return created(out satisfies FinancialDocumentTypeResponseDto);
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
): Promise<NextResponse<FinancialDocumentTypeResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const body = await parseBody<FinancialDocumentTypeUpdateRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await updateFinancialDocumentType(code, body, companyId);
    return ok(out satisfies FinancialDocumentTypeResponseDto);
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
): Promise<NextResponse<FinancialDocumentTypeResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const body = await parseBody<FinancialDocumentTypePatchRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await patchFinancialDocumentType(code, body, companyId);
    return ok(out satisfies FinancialDocumentTypeResponseDto);
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
): Promise<NextResponse<null | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    await deleteFinancialDocumentType(code, companyId);
    return noContent();
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


export async function handleBatchGet(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentTypeResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    const { companyId } = await resolveApiSettingsScope(req);
    const out = await batchGetFinancialDocumentTypes(codes, companyId);
    return ok(out satisfies FinancialDocumentTypeResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleBatchCreate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentTypeResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<FinancialDocumentTypeCreateRequestDto[]>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return created(await batchCreateFinancialDocumentTypes(body, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}

export async function handleBatchUpdate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentTypeResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<Array<FinancialDocumentTypeUpdateRequestDto & { code: string }>>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchUpdateFinancialDocumentTypes(body, companyId));
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
): Promise<NextResponse<FinancialDocumentTypeResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const body = await parseBody<Array<FinancialDocumentTypePatchRequestDto & { code: string }>>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchPatchFinancialDocumentTypes(body, companyId));
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
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    const { companyId } = await resolveApiSettingsScope(req);
    await batchDeleteFinancialDocumentTypes(codes, companyId);
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
): Promise<NextResponse<FinancialDocumentTypeResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateFinancialDocumentType(code, companyId));
  } catch (err) {
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDeactivate(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialDocumentTypeResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateFinancialDocumentType(code, companyId));
  } catch (err) {
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchActivate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentTypeResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateFinancialDocumentTypes(codes, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDeactivate(
  req: NextRequest,
): Promise<NextResponse<FinancialDocumentTypeResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { codes } = await parseBody<CodesRequestDto>(req);
    if (!Array.isArray(codes)) return inputValidationError("'codes' must be an array");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateFinancialDocumentTypes(codes, companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}
