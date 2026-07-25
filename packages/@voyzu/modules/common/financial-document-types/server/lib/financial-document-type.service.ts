import type { Filter } from "@voyzu/types/params";
import type { ListOptions } from "@voyzu/types/params";
import type { FinancialDocumentTypeCreateRequestDto } from "@voyzu/types/modules/financial-document-types";
import type { FinancialDocumentTypePatchRequestDto } from "@voyzu/types/modules/financial-document-types";
import type { FinancialDocumentTypeResponseDto } from "@voyzu/types/modules/financial-document-types";
import type { FinancialDocumentTypeUpdateRequestDto } from "@voyzu/types/modules/financial-document-types";
import { runtime } from "@voyzu/capability/runtime";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError, DataError } from "@voyzu/capability/errors";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { createCreationAuditStamp, withAuditActors, withCreationAudit } from "../../../server";

import { FinancialDocumentTypeRepo } from "../db/financial-document-type.repo";

import { toDto, toInsertRow, toUpdateRow, toPatchRow } from "./financial-document-type.mapper";
import { validateCreate, validateUpdate, validatePatch, validateResponse } from "./financial-document-type.validator";

const SYSTEM_LOCKED_MSG = "Financial document types are system-defined and cannot be modified or deleted";

function checkedResponse(dto: FinancialDocumentTypeResponseDto): FinancialDocumentTypeResponseDto {
  const errors = validateResponse(dto);
  if (errors.length) {
    const message = `Invalid financial document type response (code=${dto.code}): ${errors.join("; ")}`;
    if (runtime.isDevLike) throw new Error(message);
    console.error(message);
  }
  return dto;
}

async function enrichRow(row: Parameters<typeof toDto>[0]): Promise<FinancialDocumentTypeResponseDto> {
  return checkedResponse(await withAuditActors(toDto(row), row));
}

function enrichRows(rows: Array<Parameters<typeof toDto>[0]>): Promise<FinancialDocumentTypeResponseDto[]> {
  return Promise.all(rows.map(enrichRow));
}

async function assertNotSystem(repo: FinancialDocumentTypeRepo, code: string): Promise<void> {
  const row = await repo.get(code);
  if (!row) throw new NotFoundError(`Financial document type ${code} not found`);
  throw new BusinessRuleError(SYSTEM_LOCKED_MSG);
}

async function assertNoneAreSystem(repo: FinancialDocumentTypeRepo, codes: string[]): Promise<void> {
  if (!codes.length) return;
  const rows = await repo.batchGet(codes);
  if (rows.length) throw new BusinessRuleError(SYSTEM_LOCKED_MSG);
}

export async function createFinancialDocumentType(input: FinancialDocumentTypeCreateRequestDto, _companyId?: number): Promise<FinancialDocumentTypeResponseDto> {
  const errors = validateCreate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  try {
    const row = await withTransaction(async (client) => {
      return new FinancialDocumentTypeRepo(client).insert(withCreationAudit(toInsertRow(input), await createCreationAuditStamp()));
    });
    return enrichRow(row);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A financial document type with this code already exists");
    }
    throw err;
  }
}

export async function getFinancialDocumentType(code: string, _companyId?: number): Promise<FinancialDocumentTypeResponseDto | null> {
  const row = await new FinancialDocumentTypeRepo(getDb()).get(code);
  if (!row) return null;
  return enrichRow(row);
}

export async function updateFinancialDocumentType(code: string, input: FinancialDocumentTypeUpdateRequestDto, _companyId?: number): Promise<FinancialDocumentTypeResponseDto> {
  const errors = validateUpdate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  try {
    return await withTransaction(async (client) => {
      const repo = new FinancialDocumentTypeRepo(client);
      const existing = await repo.get(code);
      if (!existing) throw new NotFoundError(`Financial document type ${code} not found`);
      throw new BusinessRuleError(SYSTEM_LOCKED_MSG);
      const row = await repo.update(code, toUpdateRow(input));
      return enrichRow(row);
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A financial document type with the target code already exists");
    }
    if (err instanceof DataError) throw new NotFoundError(`Financial document type ${code} not found`);
    throw err;
  }
}

export async function patchFinancialDocumentType(code: string, input: FinancialDocumentTypePatchRequestDto, _companyId?: number): Promise<FinancialDocumentTypeResponseDto> {
  const errors = validatePatch(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  try {
    return await withTransaction(async (client) => {
      const repo = new FinancialDocumentTypeRepo(client);
      const existing = await repo.get(code);
      if (!existing) throw new NotFoundError(`Financial document type ${code} not found`);
      throw new BusinessRuleError(SYSTEM_LOCKED_MSG);
      const row = await repo.patch(code, toPatchRow(input));
      return enrichRow(row);
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A financial document type with the target code already exists");
    }
    if (err instanceof DataError) throw new NotFoundError(`Financial document type ${code} not found`);
    throw err;
  }
}

export async function deleteFinancialDocumentType(code: string, _companyId?: number): Promise<void> {
  const repo = new FinancialDocumentTypeRepo(getDb());
  await assertNotSystem(repo, code);
  await repo.delete(code);
}

export async function listFinancialDocumentTypes(_companyId?: number): Promise<FinancialDocumentTypeResponseDto[]> {
  const rows = await new FinancialDocumentTypeRepo(getDb()).listAll();
  return enrichRows(rows);
}

export async function filterFinancialDocumentTypes(filters: Filter[], options?: ListOptions, _companyId?: number): Promise<FinancialDocumentTypeResponseDto[]> {
  const rows = await new FinancialDocumentTypeRepo(getDb()).filter(filters, options);
  return enrichRows(rows);
}

export async function searchFinancialDocumentTypes(phrase: string, options?: ListOptions, _companyId?: number): Promise<FinancialDocumentTypeResponseDto[]> {
  const rows = await new FinancialDocumentTypeRepo(getDb()).search(phrase, options);
  return enrichRows(rows);
}

export async function batchGetFinancialDocumentTypes(codes: string[], _companyId?: number): Promise<FinancialDocumentTypeResponseDto[]> {
  const rows = await new FinancialDocumentTypeRepo(getDb()).batchGet(codes);
  return enrichRows(rows);
}

export async function batchDeleteFinancialDocumentTypes(codes: string[], _companyId?: number): Promise<void> {
  const repo = new FinancialDocumentTypeRepo(getDb());
  await assertNoneAreSystem(repo, codes);
  await repo.batchDelete(codes);
}

export async function batchCreateFinancialDocumentTypes(inputs: FinancialDocumentTypeCreateRequestDto[], companyId?: number): Promise<FinancialDocumentTypeResponseDto[]> {
  const result: FinancialDocumentTypeResponseDto[] = [];
  for (const input of inputs) result.push(await createFinancialDocumentType(input, companyId));
  return result;
}

export async function batchUpdateFinancialDocumentTypes(inputs: Array<FinancialDocumentTypeUpdateRequestDto & { code: string }>, companyId?: number): Promise<FinancialDocumentTypeResponseDto[]> {
  const result: FinancialDocumentTypeResponseDto[] = [];
  for (const input of inputs) result.push(await updateFinancialDocumentType(input.code, input, companyId));
  return result;
}

export async function batchPatchFinancialDocumentTypes(inputs: Array<FinancialDocumentTypePatchRequestDto & { code: string }>, companyId?: number): Promise<FinancialDocumentTypeResponseDto[]> {
  const result: FinancialDocumentTypeResponseDto[] = [];
  for (const input of inputs) result.push(await patchFinancialDocumentType(input.code, input, companyId));
  return result;
}

export async function activateFinancialDocumentType(code: string, companyId?: number): Promise<FinancialDocumentTypeResponseDto> {
  return patchFinancialDocumentType(code, { status: "ACTIVE" }, companyId);
}

export async function deactivateFinancialDocumentType(code: string, companyId?: number): Promise<FinancialDocumentTypeResponseDto> {
  return patchFinancialDocumentType(code, { status: "INACTIVE" }, companyId);
}

export async function activateFinancialDocumentTypes(codes: string[], companyId?: number): Promise<FinancialDocumentTypeResponseDto[]> {
  const result: FinancialDocumentTypeResponseDto[] = [];
  for (const code of codes) result.push(await activateFinancialDocumentType(code, companyId));
  return result;
}

export async function deactivateFinancialDocumentTypes(codes: string[], companyId?: number): Promise<FinancialDocumentTypeResponseDto[]> {
  const result: FinancialDocumentTypeResponseDto[] = [];
  for (const code of codes) result.push(await deactivateFinancialDocumentType(code, companyId));
  return result;
}
