import type { AccountType } from "@voyzu/finance/types/modules/core";
import type { GlAccountCreateRequestDto } from "@voyzu/finance/types/modules/gl-accounts";
import type { GlAccountPatchRequestDto } from "@voyzu/finance/types/modules/gl-accounts";
import type { GlAccountResponseDto, GlAccountStatus } from "@voyzu/finance/types/modules/gl-accounts";
import type { GlAccountUpdateRequestDto } from "@voyzu/finance/types/modules/gl-accounts";

import type {
  GlAccountRow,
  InsertGlAccountRow,
  UpdateGlAccountRow,
  PatchGlAccountRow,
} from "../db/gl-account.row.types";

export function toDto(row: GlAccountRow): GlAccountResponseDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    accountType: row.account_type as AccountType,
    ...(row.account_category_id != null && { accountCategoryId: row.account_category_id }),
    ...(row.category_name != null && row.category_code != null && {
      category: { code: row.category_code, name: row.category_name },
    }),
    status: row.status as GlAccountStatus,
    linkedBy: row.linked_by,
    hasPostings: row.companies_with_postings.length > 0,
    companiesWithPostings: row.companies_with_postings,
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

export function toInsertRow(input: GlAccountCreateRequestDto, companyId: number): InsertGlAccountRow {
  return {
    finance_organization_id: companyId,
    code: input.code,
    name: input.name,
    account_type: input.accountType,
    account_category_id: input.accountCategoryId,
  };
}

export function toUpdateRow(input: GlAccountUpdateRequestDto): UpdateGlAccountRow {
  return {
    code: input.code,
    name: input.name,
    account_type: input.accountType,
    account_category_id: input.accountCategoryId ?? null,
  };
}

export function toPatchRow(input: GlAccountPatchRequestDto): PatchGlAccountRow {
  const row: PatchGlAccountRow = {};
  if (input.name !== undefined) row.name = input.name;
  if (input.accountType !== undefined) row.account_type = input.accountType;
  if (input.accountCategoryId !== undefined) row.account_category_id = input.accountCategoryId;
  return row;
}
