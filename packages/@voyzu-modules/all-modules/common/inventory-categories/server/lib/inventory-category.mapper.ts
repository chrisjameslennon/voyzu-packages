import type { InventoryCategoryCreateRequestDto } from "@voyzu-modules/types/modules/inventory-categories";
import type { InventoryCategoryPatchRequestDto } from "@voyzu-modules/types/modules/inventory-categories";
import type { InventoryCategoryResponseDto } from "@voyzu-modules/types/modules/inventory-categories";
import type { InventoryCategoryUpdateRequestDto } from "@voyzu-modules/types/modules/inventory-categories";

import type { InsertInventoryCategoryRow, InventoryCategoryRow, PatchInventoryCategoryRow, UpdateInventoryCategoryRow } from "../db/inventory-category.row.types";

export function toDto(row: InventoryCategoryRow): InventoryCategoryResponseDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    posting_profile_code: row.posting_profile_code,
    status: row.status,
    numberOfItems: row.number_of_items,
    linkedBy: row.linked_by,
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

export function toInsertRow(input: InventoryCategoryCreateRequestDto, companyId: number): InsertInventoryCategoryRow {
  return {
    company_id: companyId,
    code: input.code.trim().toUpperCase().replaceAll(" ", "_"),
    name: input.name.trim(),
    description: input.description.trim(),
    posting_profile_code: input.posting_profile_code.trim().toUpperCase().replaceAll(" ", "_"),
    status: "ACTIVE",
  };
}

export function toUpdateRow(input: InventoryCategoryUpdateRequestDto): UpdateInventoryCategoryRow {
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    posting_profile_code: input.posting_profile_code.trim().toUpperCase().replaceAll(" ", "_"),
  };
}

export function toPatchRow(input: InventoryCategoryPatchRequestDto): PatchInventoryCategoryRow {
  return {
    ...(input.code !== undefined && { code: input.code.trim().toUpperCase().replaceAll(" ", "_") }),
    ...(input.name !== undefined && { name: input.name.trim() }),
    ...(input.description !== undefined && { description: input.description.trim() }),
    ...(input.posting_profile_code !== undefined && { posting_profile_code: input.posting_profile_code.trim().toUpperCase().replaceAll(" ", "_") }),
  };
}
