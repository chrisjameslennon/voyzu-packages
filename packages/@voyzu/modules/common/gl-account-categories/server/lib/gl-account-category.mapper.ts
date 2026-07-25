import type {
  GlAccountCategoryCreateRequestDto,
  GlAccountCategoryPatchRequestDto,
  GlAccountCategoryResponseDto,
  GlAccountCategoryUpdateRequestDto,
} from "@voyzu/types/modules/gl-account-categories";

import type {
  GlAccountCategoryRow,
  InsertGlAccountCategoryRow,
  PatchGlAccountCategoryRow,
  UpdateGlAccountCategoryRow,
} from "../db/gl-account-category.row.types";

export function toInsertRow(input: GlAccountCategoryCreateRequestDto, companyId: number): InsertGlAccountCategoryRow {
  return {
    company_id: companyId,
    code: input.code,
    name: input.name,
    account_type: input.accountType,
    sequence: input.sequence,
  };
}

export function toUpdateRow(input: GlAccountCategoryUpdateRequestDto): UpdateGlAccountCategoryRow {
  return {
    name: input.name,
    account_type: input.accountType,
    sequence: input.sequence,
  };
}

export function toPatchRow(input: GlAccountCategoryPatchRequestDto): PatchGlAccountCategoryRow {
  const row: PatchGlAccountCategoryRow = {};
  if (input.name !== undefined) row.name = input.name;
  if (input.accountType !== undefined) row.account_type = input.accountType;
  if (input.sequence !== undefined) row.sequence = input.sequence;
  return row;
}

export function toDto(row: GlAccountCategoryRow): GlAccountCategoryResponseDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    accountType: row.account_type as GlAccountCategoryResponseDto["accountType"],
    sequence: row.sequence,
    status: row.status as GlAccountCategoryResponseDto["status"],
    hasPostings: row.companies_with_postings.length > 0,
    companiesWithPostings: row.companies_with_postings,
    linkedBy: row.linked_by,
    audit: {
      created: {
        date: row.creation_date,
        actorType: row.creation_actor_type,
        userId: row.creation_user_id,
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: row.updated_date,
        actorType: row.updated_actor_type,
        userId: row.updated_user_id,
        mutationId: row.updated_mutation_id,
      },
    },
  };
}
