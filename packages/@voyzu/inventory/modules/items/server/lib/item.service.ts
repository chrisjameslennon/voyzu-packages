import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, ConflictError, DataError, NotFoundError } from "@voyzu/capability/errors";
import { createCreationAuditStamp, createUpdateAuditStamp, withAuditActors, withCreationAudit, withUpdateAudit } from "@voyzu/audit/stamps";
import type { ItemListRow, ItemStatus } from "../../types/item-list.types";
import type { OperationalItemDto } from "../../types/operational-item.types";
import type { ItemCategoryOptionDto, ItemCreateRequestDto, ItemDeletionImpactDto, ItemPatchRequestDto, ItemResponseDto } from "../../types/item.types";
import { ItemRepo } from "../db/item.repo";
import type { ItemRow } from "../db/item.row.types";

const normalizeSku = (sku: string) => sku.trim().toUpperCase();
const normalizeSkus = (skus: string[]) => [...new Set(skus.map(normalizeSku).filter(Boolean))];

async function toResponse(repo: ItemRepo, row: ItemRow): Promise<ItemResponseDto> {
  const customFields = await repo.listCustomFields(row.organization_id, row.id);
  const dto: ItemResponseDto = {
    id: row.id, sku: row.sku, name: row.name, description: row.description,
    category: row.item_category_id === null ? null : { id: row.item_category_id, code: row.category_code ?? "", name: row.category_name ?? "" },
    unit: row.unit, quantityTracked: row.quantity_tracked,
    dimensionUnit: row.dimension_unit, dimensionHeight: row.dimension_height, dimensionWidth: row.dimension_width, dimensionDepth: row.dimension_depth,
    weightUnit: row.weight_unit, weight: row.weight,
    status: row.status, inUse: row.in_use,
    customFields,
    audit: {
      created: { date: row.creation_date, actorType: row.creation_actor_type, userId: row.creation_user_id, mutationId: row.creation_mutation_id },
      updated: { date: row.updated_date, actorType: row.updated_actor_type, userId: row.updated_user_id, mutationId: row.updated_mutation_id },
    },
  };
  return withAuditActors(dto, row);
}

function translateConflict(error: unknown): never {
  if (error instanceof Error && error.message.includes("duplicate key value")) throw new ConflictError("An item with this SKU already exists");
  if (error instanceof DataError) throw new NotFoundError(error.message);
  throw error;
}

async function requireItems(repo: ItemRepo, organizationId: number, skus: string[]): Promise<ItemRow[]> {
  const rows = await Promise.all(skus.map((sku) => repo.get(organizationId, sku)));
  const missing = skus.filter((_, index) => !rows[index]);
  if (missing.length) throw new NotFoundError(`Item ${missing.join(", ")} was not found`);
  return rows as ItemRow[];
}

export async function listItems(organizationId: number): Promise<ItemListRow[]> { return new ItemRepo(getDb()).list(organizationId); }
export async function listItemCategories(organizationId: number): Promise<ItemCategoryOptionDto[]> { return new ItemRepo(getDb()).listCategories(organizationId); }
export async function reserveItemSku(): Promise<{ id: number; sku: string }> { return new ItemRepo(getDb()).reserveAutoSku(); }
export async function getItem(organizationId: number, sku: string): Promise<ItemResponseDto | null> { const repo = new ItemRepo(getDb()); const row = await repo.get(organizationId, normalizeSku(sku)); return row ? toResponse(repo, row) : null; }

export async function createItem(organizationId: number, input: ItemCreateRequestDto): Promise<ItemResponseDto> {
  try {
    return await withTransaction(async (db) => {
      if (input.sku && input.reservedId) throw new BusinessRuleError("Use either a manual SKU or a reserved automatic SKU");
      if (input.quantityTracked && input.unit === null) throw new BusinessRuleError("Unit is required when quantity tracking is enabled");
      const repo = new ItemRepo(db); const values = withCreationAudit({ name: input.name.trim(), description: "", item_category_id: input.categoryId,
        unit: input.quantityTracked ? input.unit : null, quantity_tracked: input.quantityTracked,
        status: "ACTIVE" }, await createCreationAuditStamp());
      const row = input.sku
        ? await repo.insert(organizationId, { sku: normalizeSku(input.sku), ...values })
        : input.reservedId
          ? await repo.insertReservedAutoSku(organizationId, input.reservedId, values)
          : await repo.insertAutoSku(organizationId, values);
      return toResponse(repo, row);
    });
  } catch (error) { return translateConflict(error); }
}

export async function patchItem(organizationId: number, sku: string, input: ItemPatchRequestDto): Promise<ItemResponseDto> {
  try {
    return await withTransaction(async (db) => {
      const repo = new ItemRepo(db); const current = await repo.get(organizationId, sku);
      if (!current) throw new NotFoundError(`Item ${sku} was not found`);
      const targetQuantityTracked = input.quantityTracked ?? current.quantity_tracked;
      const targetUnit = targetQuantityTracked ? (input.unit === undefined ? current.unit : input.unit) : null;
      if (targetQuantityTracked && targetUnit === null) throw new BusinessRuleError("Unit is required when quantity tracking is enabled");
      const customFieldDefinitions = await repo.listCustomFields(organizationId, current.id);
      if (input.customFields) {
        const supplied = new Map(input.customFields.map((field) => [field.customFieldId, field.value]));
        const missingRequired = customFieldDefinitions.filter((field) => {
          if (!field.required || field.status !== "ACTIVE") return false;
          const value = supplied.has(field.id) ? supplied.get(field.id) : field.value;
          return value === null || value === "" || (Array.isArray(value) && value.length === 0);
        });
        if (missingRequired.length) throw new BusinessRuleError(`Complete required custom field${missingRequired.length === 1 ? "" : "s"}: ${missingRequired.map(({ name }) => name).join(", ")}`);
      }
      const audit = await createUpdateAuditStamp();
      const changed = await repo.patch(organizationId, sku, withUpdateAudit({ name: input.name?.trim(), description: input.description?.trim(), item_category_id: input.categoryId,
        unit: targetUnit, quantity_tracked: input.quantityTracked,
        dimension_unit: input.dimensionUnit, dimension_height: input.dimensionHeight, dimension_width: input.dimensionWidth, dimension_depth: input.dimensionDepth,
        weight_unit: input.weightUnit, weight: input.weight }, audit));
      if (input.customFields) await repo.replaceCustomFieldValues(organizationId, current.id, input.customFields, customFieldDefinitions, audit);
      return toResponse(repo, (await repo.get(organizationId, changed.sku)) ?? changed);
    });
  } catch (error) { return translateConflict(error); }
}

async function transitionItems(organizationId: number, skus: string[], status: ItemStatus): Promise<ItemResponseDto[]> {
  return withTransaction(async (db) => { const repo = new ItemRepo(db); const normalized = normalizeSkus(skus); await requireItems(repo, organizationId, normalized);
    await repo.transition(organizationId, normalized, status, await createUpdateAuditStamp());
    return Promise.all((await requireItems(repo, organizationId, normalized)).map((row) => toResponse(repo, row))); });
}
export async function activateItem(organizationId: number, sku: string) { return (await transitionItems(organizationId, [sku], "ACTIVE"))[0]!; }
export async function deactivateItem(organizationId: number, sku: string) { return (await transitionItems(organizationId, [sku], "INACTIVE"))[0]!; }
export async function activateItems(organizationId: number, skus: string[]) { return transitionItems(organizationId, skus, "ACTIVE"); }
export async function deactivateItems(organizationId: number, skus: string[]) { return transitionItems(organizationId, skus, "INACTIVE"); }

export async function changeItemsCategory(organizationId: number, skus: string[], categoryId: number): Promise<ItemResponseDto[]> {
  return withTransaction(async (db) => {
    const repo = new ItemRepo(db); const normalized = normalizeSkus(skus);
    await requireItems(repo, organizationId, normalized);
    if (!await repo.categoryExists(organizationId, categoryId)) throw new BusinessRuleError("Select an active item category");
    await repo.changeCategory(organizationId, normalized, categoryId, await createUpdateAuditStamp());
    return Promise.all((await requireItems(repo, organizationId, normalized)).map((row) => toResponse(repo, row)));
  });
}

export async function deleteItems(organizationId: number, skus: string[]): Promise<void> {
  await withTransaction(async (db) => { const repo = new ItemRepo(db); const normalized = normalizeSkus(skus); await requireItems(repo, organizationId, normalized);
    const stocked = await repo.deletionImpact(organizationId, normalized);
    if (stocked.length) throw new BusinessRuleError("The stock must be issued or written off before the item can be deleted");
    await repo.delete(organizationId, normalized, await createUpdateAuditStamp()); });
}
export async function deleteItem(organizationId: number, sku: string) { return deleteItems(organizationId, [sku]); }
export async function getItemDeletionImpact(organizationId: number, skus: string[]): Promise<ItemDeletionImpactDto[]> {
  const repo = new ItemRepo(getDb()); const normalized = normalizeSkus(skus); await requireItems(repo, organizationId, normalized);
  return repo.deletionImpact(organizationId, normalized);
}
export async function getOperationalItems(organizationId: number, skus: string[]): Promise<OperationalItemDto[]> { return new ItemRepo(getDb()).listOperationalItems(organizationId, skus); }
