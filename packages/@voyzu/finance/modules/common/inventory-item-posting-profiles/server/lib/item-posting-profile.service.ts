import { getDb } from "@voyzu/capability/db";
import { BusinessRuleError, DataError, NotFoundError } from "@voyzu/capability/errors";
import { AssignGLAccount, ConfigurePostingAccounts, Deactivate, Delete } from "@voyzu/finance/common/inventory-item-posting-profiles/domain/operation-policy";
import type { ItemPostingProfileBatchPatchRequestDto, ItemPostingProfileBatchUpdateRequestDto, ItemPostingProfileCreateRequestDto, ItemPostingProfilePatchRequestDto, ItemPostingProfileResponseDto, ItemPostingProfileUpdateRequestDto } from "@voyzu/finance/types/modules/inventory-item-posting-profiles";
import type { Filter, ListOptions } from "@voyzu/types/params";
import { createCreationAuditStamp, createUpdateAuditStamp, withAuditActors, withCreationAudit, withUpdateAudit } from "../../../server";
import { assertCompanySettingsWritable, resolveEffectiveSettingsCompanyId } from "../../../server/settings-scope";
import { getItemPostingProfileUsages } from "../../../server/operational-inventory";

import { ItemPostingProfileRepo } from "../db/item-posting-profile.repo";
import type { ItemPostingProfileRow } from "../db/item-posting-profile.row.types";
import { toDto, toInsertRow, toPatchRow, toUpdateRow } from "./item-posting-profile.mapper";

function repo() {
  return new ItemPostingProfileRepo(getDb());
}

async function enrichRow(row: ItemPostingProfileRow): Promise<ItemPostingProfileResponseDto> {
  const usages = await getItemPostingProfileUsages([row.id]);
  const dto = await withAuditActors(toDto({
    ...row,
    linked_by: usages.map((usage) => ({ type: "Inventory Items", code: usage.sku })),
  }), row);
  return dto;
}

function enrichRows(rows: ItemPostingProfileRow[]): Promise<ItemPostingProfileResponseDto[]> {
  return Promise.all(rows.map(enrichRow));
}

async function scopedCompanyId(companyId?: number): Promise<number> {
  if (companyId === undefined) throw new BusinessRuleError("Financial entity context is required");
  return resolveEffectiveSettingsCompanyId(companyId);
}

async function assertWritableScope(companyId?: number): Promise<void> {
  if (companyId !== undefined) await assertCompanySettingsWritable(companyId);
}

function notFoundFromData(err: unknown): never {
  if (err instanceof DataError) throw new NotFoundError(err.message);
  throw err;
}

function normalizeCodes(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

const GL_TARGET_FIELDS = [
  ["revenue_code", "REVENUE"],
  ["cogs_code", "EXPENSE"],
  ["purchase_expense_code", "EXPENSE"],
  ["consumption_code", "EXPENSE"],
  ["adjustment_gain_code", "REVENUE"],
  ["adjustment_loss_code", "EXPENSE"],
] as const;

async function assertValidGLTargets(
  itemPostingProfileRepo: ItemPostingProfileRepo,
  companyId: number,
  input: Partial<Record<typeof GL_TARGET_FIELDS[number][0], string | null>>,
): Promise<void> {
  for (const [field, requiredAccountType] of GL_TARGET_FIELDS) {
    const code = input[field];
    if (code == null || !code.trim()) continue;
    const target = await itemPostingProfileRepo.getGlAccount(companyId, code.trim().toUpperCase());
    if (!target) throw new NotFoundError(`GL account ${code} not found`);
    const blockers = AssignGLAccount(target, requiredAccountType);
    if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
  }
}

function throwIfBlocked(blockers: ReturnType<typeof Delete>): void {
  if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
}

function assertValidConfiguration(input: ItemPostingProfileCreateRequestDto | ItemPostingProfileUpdateRequestDto): void {
  const blockers = ConfigurePostingAccounts(input, input);
  if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
}

export async function listItemPostingProfiles(companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  return enrichRows(await repo().listAll(await scopedCompanyId(companyId)));
}

export async function filterItemPostingProfiles(filters: Filter[], options?: ListOptions, companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  return enrichRows(await repo().filter(await scopedCompanyId(companyId), filters, options));
}

export async function searchItemPostingProfiles(phrase: string, options?: ListOptions, companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  return enrichRows(await repo().search(await scopedCompanyId(companyId), phrase, options));
}

export async function getItemPostingProfile(code: string, companyId?: number): Promise<ItemPostingProfileResponseDto | null> {
  const row = await repo().get(await scopedCompanyId(companyId), code);
  return row ? enrichRow(row) : null;
}

export async function createItemPostingProfile(input: ItemPostingProfileCreateRequestDto, companyId?: number): Promise<ItemPostingProfileResponseDto> {
  assertValidConfiguration(input);
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const itemPostingProfileRepo = repo();
  await assertValidGLTargets(itemPostingProfileRepo, resolvedCompanyId, input);
  return enrichRow(await itemPostingProfileRepo.insert(withCreationAudit(toInsertRow(input, resolvedCompanyId), await createCreationAuditStamp())));
}

export async function updateItemPostingProfile(code: string, input: ItemPostingProfileUpdateRequestDto, companyId?: number): Promise<ItemPostingProfileResponseDto> {
  try {
    await assertWritableScope(companyId);
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const itemPostingProfileRepo = repo();
    const existing = await itemPostingProfileRepo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Item posting profile ${code} not found`);
    assertValidConfiguration(input);
    await assertValidGLTargets(itemPostingProfileRepo, resolvedCompanyId, input);
    const updateRow = toUpdateRow(input);
    return enrichRow(await itemPostingProfileRepo.update(resolvedCompanyId, code, updateRow, await createUpdateAuditStamp()));
  } catch (err) {
    notFoundFromData(err);
  }
}

export async function patchItemPostingProfile(code: string, input: ItemPostingProfilePatchRequestDto, companyId?: number): Promise<ItemPostingProfileResponseDto> {
  try {
    await assertWritableScope(companyId);
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const itemPostingProfileRepo = repo();
    const existing = await itemPostingProfileRepo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Item posting profile ${code} not found`);
    const existingDto = toDto(existing);
    assertValidConfiguration({
      profile_code: input.profile_code ?? existingDto.profile_code,
      profile_name: input.profile_name ?? existingDto.profile_name,
      description: input.description ?? existingDto.description,
      is_sold: input.is_sold ?? existingDto.is_sold,
      is_purchased: input.is_purchased ?? existingDto.is_purchased,
      is_consumed: input.is_consumed ?? existingDto.is_consumed,
      revenue_code: input.revenue_code !== undefined ? input.revenue_code : existingDto.revenue_code?.code ?? null,
      cogs_code: input.cogs_code !== undefined ? input.cogs_code : existingDto.cogs_code?.code ?? null,
      purchase_expense_code: input.purchase_expense_code !== undefined ? input.purchase_expense_code : existingDto.purchase_expense_code?.code ?? null,
      consumption_code: input.consumption_code !== undefined ? input.consumption_code : existingDto.consumption_code?.code ?? null,
      adjustment_gain_code: input.adjustment_gain_code !== undefined ? input.adjustment_gain_code : existingDto.adjustment_gain_code?.code ?? null,
      adjustment_loss_code: input.adjustment_loss_code !== undefined ? input.adjustment_loss_code : existingDto.adjustment_loss_code?.code ?? null,
    });
    await assertValidGLTargets(itemPostingProfileRepo, resolvedCompanyId, input);
    const patchRow = toPatchRow(input);
    return enrichRow(await itemPostingProfileRepo.patch(resolvedCompanyId, code, withUpdateAudit(patchRow, await createUpdateAuditStamp())));
  } catch (err) {
    notFoundFromData(err);
  }
}

export async function deleteItemPostingProfile(code: string, companyId?: number): Promise<void> {
  try {
    await assertWritableScope(companyId);
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const itemPostingProfileRepo = repo();
    const existing = await itemPostingProfileRepo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Item posting profile ${code} not found`);
    throwIfBlocked(Delete({ code: existing.profile_code, linkedBy: (await enrichRow(existing)).linkedBy }));
    await itemPostingProfileRepo.delete(resolvedCompanyId, code);
  } catch (err) {
    notFoundFromData(err);
  }
}

export async function batchGetItemPostingProfiles(codes: string[], companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  return enrichRows(await repo().batchGet(await scopedCompanyId(companyId), normalizeCodes(codes)));
}

export async function batchCreateItemPostingProfiles(inputs: ItemPostingProfileCreateRequestDto[], companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  const result: ItemPostingProfileResponseDto[] = [];
  for (const input of inputs) {
    result.push(await createItemPostingProfile(input, companyId));
  }
  return result;
}

export async function batchUpdateItemPostingProfiles(inputs: ItemPostingProfileBatchUpdateRequestDto[], companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  const result: ItemPostingProfileResponseDto[] = [];
  for (const input of inputs) {
    result.push(await updateItemPostingProfile(input.profile_code, input, companyId));
  }
  return result;
}

export async function batchPatchItemPostingProfiles(inputs: ItemPostingProfileBatchPatchRequestDto[], companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  const result: ItemPostingProfileResponseDto[] = [];
  for (const input of inputs) {
    result.push(await patchItemPostingProfile(input.profile_code, input, companyId));
  }
  return result;
}

export async function batchDeleteItemPostingProfiles(codes: string[], companyId?: number): Promise<void> {
  for (const code of normalizeCodes(codes)) {
    await deleteItemPostingProfile(code, companyId);
  }
}

export async function activateItemPostingProfile(code: string, companyId?: number): Promise<ItemPostingProfileResponseDto> {
  return (await activateItemPostingProfiles([code], companyId))[0];
}

export async function deactivateItemPostingProfile(code: string, companyId?: number): Promise<ItemPostingProfileResponseDto> {
  return (await deactivateItemPostingProfiles([code], companyId))[0];
}

export async function activateItemPostingProfiles(codes: string[], companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  return transitionItemPostingProfileStatus(codes, "ACTIVE", companyId);
}

export async function deactivateItemPostingProfiles(codes: string[], companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  return transitionItemPostingProfileStatus(codes, "INACTIVE", companyId);
}

async function transitionItemPostingProfileStatus(codes: string[], status: "ACTIVE" | "INACTIVE", companyId?: number): Promise<ItemPostingProfileResponseDto[]> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const itemPostingProfileRepo = repo();
  const result: ItemPostingProfileResponseDto[] = [];
  const audit = await createUpdateAuditStamp();

  for (const code of normalizeCodes(codes)) {
    const existing = await itemPostingProfileRepo.get(resolvedCompanyId, code);
    if (!existing) throw new NotFoundError(`Item posting profile ${code} not found`);
    if (status === "INACTIVE") throwIfBlocked(Deactivate({ code: existing.profile_code, linkedBy: (await enrichRow(existing)).linkedBy }));
    result.push(await enrichRow(await itemPostingProfileRepo.patch(resolvedCompanyId, code, withUpdateAudit({ status }, audit))));
  }

  return result;
}
