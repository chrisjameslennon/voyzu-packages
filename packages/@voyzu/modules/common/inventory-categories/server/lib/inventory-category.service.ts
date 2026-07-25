import { getDb } from "@voyzu/capability/db";
import { BusinessRuleError, DataError, NotFoundError } from "@voyzu/capability/errors";
import { Deactivate, Delete } from "@voyzu/modules/common/inventory-categories/domain/operation-policy";
import { createCreationAuditStamp, createUpdateAuditStamp, withAuditActors, withCreationAudit, withUpdateAudit } from "../../../server";
import { assertCompanySettingsWritable, resolveTemplateSettingsScope } from "../../../server/settings-scope";

import type { Filter, ListOptions } from "@voyzu/types/params";
import type { InventoryCategoryBatchPatchRequestDto } from "@voyzu/types/modules/inventory-categories";
import type { InventoryCategoryBatchUpdateRequestDto } from "@voyzu/types/modules/inventory-categories";
import type { InventoryCategoryCreateRequestDto } from "@voyzu/types/modules/inventory-categories";
import type { InventoryCategoryPatchRequestDto } from "@voyzu/types/modules/inventory-categories";
import type { InventoryCategoryResponseDto } from "@voyzu/types/modules/inventory-categories";
import type { InventoryCategoryUpdateRequestDto } from "@voyzu/types/modules/inventory-categories";

import { InventoryCategoryRepo } from "../db/inventory-category.repo";
import type { InventoryCategoryRow } from "../db/inventory-category.row.types";
import { toDto, toInsertRow, toPatchRow, toUpdateRow } from "./inventory-category.mapper";
import { validateCreate, validatePatch, validateUpdate } from "./inventory-category.validator";

function repo() {
  return new InventoryCategoryRepo(getDb());
}

function enrichRow(row: InventoryCategoryRow): Promise<InventoryCategoryResponseDto> {
  return withAuditActors(toDto(row), row);
}

function enrichRows(rows: InventoryCategoryRow[]): Promise<InventoryCategoryResponseDto[]> {
  return Promise.all(rows.map(enrichRow));
}

async function scopedCompanyId(companyId?: number): Promise<number> {
  return companyId ?? (await resolveTemplateSettingsScope()).companyId;
}

async function assertWritableScope(companyId?: number): Promise<void> {
  if (companyId !== undefined) await assertCompanySettingsWritable(companyId);
}

function throwIfBlocked(blockers: ReturnType<typeof Delete>): void {
  if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
}

function notFoundFromData(err: unknown): never {
  if (err instanceof DataError) throw new NotFoundError(err.message);
  throw err;
}

function normalizeCodes(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

export async function listInventoryCategories(companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  return enrichRows(await repo().listAll(await scopedCompanyId(companyId)));
}

export async function filterInventoryCategories(filters: Filter[], options?: ListOptions, companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  return enrichRows(await repo().filter(await scopedCompanyId(companyId), filters, options));
}

export async function searchInventoryCategories(phrase: string, options?: ListOptions, companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  return enrichRows(await repo().search(await scopedCompanyId(companyId), phrase, options));
}

export async function getInventoryCategory(code: string, companyId?: number): Promise<InventoryCategoryResponseDto | null> {
  const row = await repo().get(await scopedCompanyId(companyId), code);
  return row ? enrichRow(row) : null;
}

export async function createInventoryCategory(input: InventoryCategoryCreateRequestDto, companyId?: number): Promise<InventoryCategoryResponseDto> {
  validateCreate(input);
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  return enrichRow(await repo().insert(withCreationAudit(toInsertRow(input, resolvedCompanyId), await createCreationAuditStamp())));
}

export async function updateInventoryCategory(code: string, input: InventoryCategoryUpdateRequestDto, companyId?: number): Promise<InventoryCategoryResponseDto> {
  validateUpdate(input);
  try {
    await assertWritableScope(companyId);
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const inventoryCategoryRepo = repo();
    const existing = await inventoryCategoryRepo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Inventory category ${code} not found`);
    const updateRow = toUpdateRow(input);
    return enrichRow(await inventoryCategoryRepo.update(resolvedCompanyId, code, updateRow, await createUpdateAuditStamp()));
  } catch (err) {
    notFoundFromData(err);
  }
}

export async function patchInventoryCategory(code: string, input: InventoryCategoryPatchRequestDto, companyId?: number): Promise<InventoryCategoryResponseDto> {
  validatePatch(input);
  try {
    await assertWritableScope(companyId);
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const inventoryCategoryRepo = repo();
    const existing = await inventoryCategoryRepo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Inventory category ${code} not found`);
    const patchRow = toPatchRow(input);
    return enrichRow(await inventoryCategoryRepo.patch(resolvedCompanyId, code, withUpdateAudit(patchRow, await createUpdateAuditStamp())));
  } catch (err) {
    notFoundFromData(err);
  }
}

export async function deleteInventoryCategory(code: string, companyId?: number): Promise<void> {
  try {
    await assertWritableScope(companyId);
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const inventoryCategoryRepo = repo();
    const existing = await inventoryCategoryRepo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Inventory category ${code} not found`);
    throwIfBlocked(Delete({ code: existing.code, numberOfItems: existing.number_of_items }));
    await inventoryCategoryRepo.delete(resolvedCompanyId, code);
  } catch (err) {
    notFoundFromData(err);
  }
}

export async function batchGetInventoryCategories(codes: string[], companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  return enrichRows(await repo().batchGet(await scopedCompanyId(companyId), normalizeCodes(codes)));
}

export async function batchCreateInventoryCategories(inputs: InventoryCategoryCreateRequestDto[], companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  const result: InventoryCategoryResponseDto[] = [];
  for (const input of inputs) {
    result.push(await createInventoryCategory(input, companyId));
  }
  return result;
}

export async function batchUpdateInventoryCategories(inputs: InventoryCategoryBatchUpdateRequestDto[], companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  const result: InventoryCategoryResponseDto[] = [];
  for (const input of inputs) {
    result.push(await updateInventoryCategory(input.code, input, companyId));
  }
  return result;
}

export async function batchPatchInventoryCategories(inputs: InventoryCategoryBatchPatchRequestDto[], companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  const result: InventoryCategoryResponseDto[] = [];
  for (const input of inputs) {
    result.push(await patchInventoryCategory(input.code, input, companyId));
  }
  return result;
}

export async function batchDeleteInventoryCategories(codes: string[], companyId?: number): Promise<void> {
  for (const code of normalizeCodes(codes)) {
    await deleteInventoryCategory(code, companyId);
  }
}

export async function activateInventoryCategory(code: string, companyId?: number): Promise<InventoryCategoryResponseDto> {
  return (await activateInventoryCategories([code], companyId))[0];
}

export async function deactivateInventoryCategory(code: string, companyId?: number): Promise<InventoryCategoryResponseDto> {
  return (await deactivateInventoryCategories([code], companyId))[0];
}

export async function activateInventoryCategories(codes: string[], companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  return transitionInventoryCategoryStatus(codes, "ACTIVE", companyId);
}

export async function deactivateInventoryCategories(codes: string[], companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  return transitionInventoryCategoryStatus(codes, "INACTIVE", companyId);
}

async function transitionInventoryCategoryStatus(codes: string[], status: "ACTIVE" | "INACTIVE", companyId?: number): Promise<InventoryCategoryResponseDto[]> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const inventoryCategoryRepo = repo();
  const result: InventoryCategoryResponseDto[] = [];
  const audit = await createUpdateAuditStamp();

  for (const code of normalizeCodes(codes)) {
    const existing = await inventoryCategoryRepo.get(resolvedCompanyId, code);
    if (!existing) throw new NotFoundError(`Inventory category ${code} not found`);
    if (status === "INACTIVE") throwIfBlocked(Deactivate({ code: existing.code, numberOfItems: existing.number_of_items }));
    result.push(await enrichRow(await inventoryCategoryRepo.patch(resolvedCompanyId, code, withUpdateAudit({ status }, audit))));
  }

  return result;
}
