import type { AccountType, Status } from "@voyzu/types/modules";
import type { ControlAccountResponseDto } from "@voyzu-modules/core/types/modules/control-accounts";

import type { ControlAccountRow } from "../db/control-account.row.types";

export function toDto(row: ControlAccountRow): ControlAccountResponseDto {
  return {
    code: row.code,
    ledger: row.ledger,
    name: row.name,
    glAccountId: row.gl_account_id,
    glAccount: row.gl_account_code != null ? {
      code: row.gl_account_code,
      name: row.gl_account_name ?? "",
      accountType: (row.gl_account_type ?? "") as AccountType,
    } : null,
    status: row.status as Status,
    hasPostings: row.companies_with_postings.length > 0,
    companiesWithPostings: row.companies_with_postings,
    linkedBy: [],
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
