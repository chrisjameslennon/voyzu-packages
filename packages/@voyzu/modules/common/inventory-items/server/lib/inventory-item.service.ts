import type { InventoryItemCreateRequestDto } from "@voyzu/types/modules/inventory-items";
import type { InventoryItemBatchPatchRequestDto, InventoryItemBatchUpdateRequestDto } from "@voyzu/types/modules/inventory-items";
import type { InventoryItemPatchRequestDto } from "@voyzu/types/modules/inventory-items";
import type { InventoryItemResponseDto } from "@voyzu/types/modules/inventory-items";
import type { InventoryItemUpdateRequestDto } from "@voyzu/types/modules/inventory-items";
import { getDb } from "@voyzu/capability/db";
import { BusinessRuleError, DataError, NotFoundError } from "@voyzu/capability/errors";
import { ChangeCode, Deactivate, Delete } from "@voyzu/modules/common/inventory-items/domain/operation-policy";
import type { Filter, ListOptions } from "@voyzu/types/params";
import { withAuditActors } from "../../../server/audit-actors";
import {
  createCreationAuditStamp,
  createUpdateAuditStamp,
  withCreationAudit,
  withUpdateAudit,
} from "../../../server/audit-stamp";
import { resolveTemplateSettingsScope } from "../../../server/settings-scope";

import { InventoryItemRepo } from "../db/inventory-item.repo";
import type { InventoryItemRow } from "../db/inventory-item.row.types";
import { toDto, toInsertRow, toPatchRow, toUpdateRow } from "./inventory-item.mapper";
import { validateCreate, validatePatch, validateUpdate } from "./inventory-item.validator";

function repo() {
  return new InventoryItemRepo(getDb());
}

function enrichRow(row: InventoryItemRow): Promise<InventoryItemResponseDto> {
  return withAuditActors(toDto(row), row);
}

function enrichRows(rows: InventoryItemRow[]): Promise<InventoryItemResponseDto[]> {
  return Promise.all(rows.map(enrichRow));
}

async function scopedCompanyId(companyId?: number): Promise<number> {
  return companyId ?? (await resolveTemplateSettingsScope()).companyId;
}

function notFoundFromData(err: unknown): never {
  if (err instanceof DataError) throw new NotFoundError(err.message);
  throw err;
}

function throwIfBlocked(blockers: ReturnType<typeof Delete>): void {
  if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
}

export async function listInventoryItems(companyId?: number): Promise<InventoryItemResponseDto[]> {
  return enrichRows(await repo().listAll(await scopedCompanyId(companyId)));
}

export async function filterInventoryItems(filters: Filter[], options?: ListOptions, companyId?: number): Promise<InventoryItemResponseDto[]> {
  return enrichRows(await repo().filter(await scopedCompanyId(companyId), filters, options));
}

export async function searchInventoryItems(phrase: string, options?: ListOptions, companyId?: number): Promise<InventoryItemResponseDto[]> {
  return enrichRows(await repo().search(await scopedCompanyId(companyId), phrase, options));
}

export async function getInventoryItem(code: string, companyId?: number): Promise<InventoryItemResponseDto | null> {
  const row = await repo().get(await scopedCompanyId(companyId), code);
  return row ? enrichRow(row) : null;
}

export async function createInventoryItem(input: InventoryItemCreateRequestDto, companyId?: number): Promise<InventoryItemResponseDto> {
  validateCreate(input);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  return enrichRow(await repo().insert(withCreationAudit(toInsertRow(input, resolvedCompanyId), await createCreationAuditStamp())));
}

export async function updateInventoryItem(code: string, input: InventoryItemUpdateRequestDto, companyId?: number): Promise<InventoryItemResponseDto> {
  validateUpdate(input);
  try {
    return enrichRow(await repo().update(await scopedCompanyId(companyId), code, toUpdateRow(input), await createUpdateAuditStamp()));
  } catch (err) {
    notFoundFromData(err);
  }
}

export async function patchInventoryItem(code: string, input: InventoryItemPatchRequestDto, companyId?: number): Promise<InventoryItemResponseDto> {
  validatePatch(input);
  try {
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const inventoryItemRepo = repo();
    const existing = await inventoryItemRepo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Inventory item ${code} not found`);
    if (input.item_code !== undefined) {
      throwIfBlocked(ChangeCode(toDto(existing), input.item_code.trim().toUpperCase().replaceAll(" ", "_")));
    }
    return enrichRow(await inventoryItemRepo.patch(resolvedCompanyId, code, withUpdateAudit(toPatchRow(input), await createUpdateAuditStamp())));
  } catch (err) {
    notFoundFromData(err);
  }
}

export async function deleteInventoryItem(code: string, companyId?: number): Promise<void> {
  try {
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const inventoryItemRepo = repo();
    const existing = await inventoryItemRepo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Inventory item ${code} not found`);
    throwIfBlocked(Delete(toDto(existing)));
    await inventoryItemRepo.delete(resolvedCompanyId, code);
  } catch (err) {
    notFoundFromData(err);
  }
}

function normalizeCodes(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

export async function batchGetInventoryItems(codes: string[], companyId?: number): Promise<InventoryItemResponseDto[]> {
  return enrichRows(await repo().batchGet(await scopedCompanyId(companyId), normalizeCodes(codes)));
}

export async function batchCreateInventoryItems(inputs: InventoryItemCreateRequestDto[], companyId?: number): Promise<InventoryItemResponseDto[]> {
  const result: InventoryItemResponseDto[] = [];
  for (const input of inputs) result.push(await createInventoryItem(input, companyId));
  return result;
}

export async function batchUpdateInventoryItems(inputs: InventoryItemBatchUpdateRequestDto[], companyId?: number): Promise<InventoryItemResponseDto[]> {
  const result: InventoryItemResponseDto[] = [];
  for (const input of inputs) result.push(await updateInventoryItem(input.item_code, input, companyId));
  return result;
}

export async function batchPatchInventoryItems(inputs: InventoryItemBatchPatchRequestDto[], companyId?: number): Promise<InventoryItemResponseDto[]> {
  const result: InventoryItemResponseDto[] = [];
  for (const input of inputs) result.push(await patchInventoryItem(input.item_code, input, companyId));
  return result;
}

export async function batchDeleteInventoryItems(codes: string[], companyId?: number): Promise<void> {
  for (const code of normalizeCodes(codes)) await deleteInventoryItem(code, companyId);
}

export async function activateInventoryItem(code: string, companyId?: number): Promise<InventoryItemResponseDto> {
  return (await activateInventoryItems([code], companyId))[0];
}

export async function deactivateInventoryItem(code: string, companyId?: number): Promise<InventoryItemResponseDto> {
  return (await deactivateInventoryItems([code], companyId))[0];
}

export async function activateInventoryItems(codes: string[], companyId?: number): Promise<InventoryItemResponseDto[]> {
  return transitionInventoryItemStatus(codes, "ACTIVE", companyId);
}

export async function deactivateInventoryItems(codes: string[], companyId?: number): Promise<InventoryItemResponseDto[]> {
  return transitionInventoryItemStatus(codes, "INACTIVE", companyId);
}

async function transitionInventoryItemStatus(codes: string[], status: "ACTIVE" | "INACTIVE", companyId?: number): Promise<InventoryItemResponseDto[]> {
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const inventoryItemRepo = repo();
  const audit = await createUpdateAuditStamp();
  const result: InventoryItemResponseDto[] = [];
  for (const code of normalizeCodes(codes)) {
    const existing = await inventoryItemRepo.get(resolvedCompanyId, code);
    if (!existing) throw new NotFoundError(`Inventory item ${code} not found`);
    if (status === "INACTIVE") throwIfBlocked(Deactivate(toDto(existing)));
    result.push(await enrichRow(await inventoryItemRepo.patch(resolvedCompanyId, code, withUpdateAudit({ status }, audit))));
  }
  return result;
}
