import type { InventoryItemCreateRequestDto } from "@voyzu/core/types/modules/inventory-items";
import type { InventoryItemPatchRequestDto } from "@voyzu/core/types/modules/inventory-items";
import type { InventoryItemResponseDto } from "@voyzu/core/types/modules/inventory-items";
import type { InventoryItemUpdateRequestDto } from "@voyzu/core/types/modules/inventory-items";

import type { InsertInventoryItemRow, InventoryItemRow, PatchInventoryItemRow, UpdateInventoryItemRow } from "../db/inventory-item.row.types";

function normalizeCode(value: string): string {
  return value.trim().toUpperCase().replaceAll(" ", "_");
}

function normalizeUnit(value: string): string {
  return value.trim().toLowerCase();
}

export function toDto(row: InventoryItemRow): InventoryItemResponseDto {
  return {
    id: row.id,
    item_code: row.item_code,
    item_name: row.item_name,
    description: row.description,
    item_type: row.item_type,
    category_code: row.category_code,
    unit_code: row.unit_code,
    status: row.status,
    hasPostings: row.has_postings,
    quantity_on_hand_derived: row.quantity_on_hand_derived,
    book_value_derived: row.book_value_derived,
    avg_unit_book_value_derived: row.avg_unit_book_value_derived,
    audit: {
      created: {
        date: row.creation_date ?? "",
        actorType: row.creation_actor_type,
        userId: row.creation_user_id,
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: row.updated_date ?? row.creation_date ?? "",
        actorType: row.updated_actor_type,
        userId: row.updated_user_id,
        mutationId: row.updated_mutation_id,
      },
    },
  };
}

export function toInsertRow(input: InventoryItemCreateRequestDto, companyId: number): InsertInventoryItemRow {
  return {
    company_id: companyId,
    code: normalizeCode(input.item_code),
    name: input.item_name.trim(),
    description: input.description.trim(),
    item_type: input.item_type,
    category_code: normalizeCode(input.category_code),
    unit_code: normalizeUnit(input.unit_code),
    status: "ACTIVE",
    quantity_on_hand_derived: input.quantity_on_hand_derived,
    book_value_derived: input.book_value_derived,
    avg_unit_book_value_derived: input.avg_unit_book_value_derived,
  };
}

export function toUpdateRow(input: InventoryItemUpdateRequestDto): UpdateInventoryItemRow {
  return {
    name: input.item_name.trim(),
    description: input.description.trim(),
    item_type: input.item_type,
    category_code: normalizeCode(input.category_code),
    unit_code: normalizeUnit(input.unit_code),
    quantity_on_hand_derived: input.quantity_on_hand_derived,
    book_value_derived: input.book_value_derived,
    avg_unit_book_value_derived: input.avg_unit_book_value_derived,
  };
}

export function toPatchRow(input: InventoryItemPatchRequestDto): PatchInventoryItemRow {
  return {
    ...(input.item_code !== undefined && { code: normalizeCode(input.item_code) }),
    ...(input.item_name !== undefined && { name: input.item_name.trim() }),
    ...(input.description !== undefined && { description: input.description.trim() }),
    ...(input.item_type !== undefined && { item_type: input.item_type }),
    ...(input.category_code !== undefined && { category_code: normalizeCode(input.category_code) }),
    ...(input.unit_code !== undefined && { unit_code: normalizeUnit(input.unit_code) }),
    ...(input.quantity_on_hand_derived !== undefined && { quantity_on_hand_derived: input.quantity_on_hand_derived }),
    ...(input.book_value_derived !== undefined && { book_value_derived: input.book_value_derived }),
    ...(input.avg_unit_book_value_derived !== undefined && { avg_unit_book_value_derived: input.avg_unit_book_value_derived }),
  };
}
