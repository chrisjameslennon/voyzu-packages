import type { ItemPostingProfileCreateRequestDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";
import type { ItemPostingProfilePatchRequestDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";
import type { ItemPostingProfileResponseDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";
import type { ItemPostingProfileUpdateRequestDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";

import type { InsertItemPostingProfileRow, ItemPostingProfileRow, PatchItemPostingProfileRow, UpdateItemPostingProfileRow } from "../db/item-posting-profile.row.types";

function normalizeCode(value: string): string {
  return value.trim().toUpperCase().replaceAll(" ", "_");
}

function normalizeNullableCode(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  return normalizeCode(value);
}

function glRef(row: ItemPostingProfileRow, codeKey: keyof ItemPostingProfileRow, nameKey: keyof ItemPostingProfileRow) {
  const code = row[codeKey];
  const name = row[nameKey];
  return code && name ? { code: String(code), name: String(name) } : null;
}

export function toDto(row: ItemPostingProfileRow): ItemPostingProfileResponseDto {
  return {
    id: row.id,
    profile_code: row.profile_code,
    profile_name: row.profile_name,
    description: row.description,
    is_sold: row.is_sold,
    is_purchased: row.is_purchased,
    is_consumed: row.is_consumed,
    revenue_code: glRef(row, "revenue_code", "revenue_name"),
    cogs_code: glRef(row, "cogs_code", "cogs_name"),
    purchase_expense_code: glRef(row, "purchase_expense_code", "purchase_expense_name"),
    consumption_code: glRef(row, "consumption_code", "consumption_name"),
    adjustment_gain_code: glRef(row, "adjustment_gain_code", "adjustment_gain_name"),
    adjustment_loss_code: glRef(row, "adjustment_loss_code", "adjustment_loss_name"),
    status: row.status,
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

export function toInsertRow(input: ItemPostingProfileCreateRequestDto, companyId: number): InsertItemPostingProfileRow {
  return {
    company_id: companyId,
    code: normalizeCode(input.profile_code),
    name: input.profile_name.trim(),
    description: input.description.trim(),
    is_sold: input.is_sold,
    is_purchased: input.is_purchased,
    is_consumed: input.is_consumed,
    revenue_code: normalizeNullableCode(input.revenue_code),
    cogs_code: normalizeNullableCode(input.cogs_code),
    purchase_expense_code: normalizeNullableCode(input.purchase_expense_code),
    consumption_code: normalizeNullableCode(input.consumption_code),
    adjustment_gain_code: normalizeNullableCode(input.adjustment_gain_code),
    adjustment_loss_code: normalizeNullableCode(input.adjustment_loss_code),
    status: "ACTIVE",
  };
}

export function toUpdateRow(input: ItemPostingProfileUpdateRequestDto): UpdateItemPostingProfileRow {
  return {
    code: normalizeCode(input.profile_code),
    name: input.profile_name.trim(),
    description: input.description.trim(),
    is_sold: input.is_sold,
    is_purchased: input.is_purchased,
    is_consumed: input.is_consumed,
    revenue_code: normalizeNullableCode(input.revenue_code),
    cogs_code: normalizeNullableCode(input.cogs_code),
    purchase_expense_code: normalizeNullableCode(input.purchase_expense_code),
    consumption_code: normalizeNullableCode(input.consumption_code),
    adjustment_gain_code: normalizeNullableCode(input.adjustment_gain_code),
    adjustment_loss_code: normalizeNullableCode(input.adjustment_loss_code),
  };
}

export function toPatchRow(input: ItemPostingProfilePatchRequestDto): PatchItemPostingProfileRow {
  return {
    ...(input.profile_code !== undefined && { code: normalizeCode(input.profile_code) }),
    ...(input.profile_name !== undefined && { name: input.profile_name.trim() }),
    ...(input.description !== undefined && { description: input.description.trim() }),
    ...(input.is_sold !== undefined && { is_sold: input.is_sold }),
    ...(input.is_purchased !== undefined && { is_purchased: input.is_purchased }),
    ...(input.is_consumed !== undefined && { is_consumed: input.is_consumed }),
    ...(input.revenue_code !== undefined && { revenue_code: normalizeNullableCode(input.revenue_code) }),
    ...(input.cogs_code !== undefined && { cogs_code: normalizeNullableCode(input.cogs_code) }),
    ...(input.purchase_expense_code !== undefined && { purchase_expense_code: normalizeNullableCode(input.purchase_expense_code) }),
    ...(input.consumption_code !== undefined && { consumption_code: normalizeNullableCode(input.consumption_code) }),
    ...(input.adjustment_gain_code !== undefined && { adjustment_gain_code: normalizeNullableCode(input.adjustment_gain_code) }),
    ...(input.adjustment_loss_code !== undefined && { adjustment_loss_code: normalizeNullableCode(input.adjustment_loss_code) }),
  };
}


