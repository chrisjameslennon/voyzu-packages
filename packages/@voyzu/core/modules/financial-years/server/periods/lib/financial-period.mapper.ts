import type { FinancialPeriodResponseDto, FinancialPeriodStatus } from "@voyzu/core/types/modules/financial-periods";
import type { FinancialPeriodRow } from "../db/financial-period.row.types";

export function toDto(row: FinancialPeriodRow): FinancialPeriodResponseDto {
  return {
    id: row.id,
    financialYearId: row.fiscal_year_id,
    companyId: row.company_id,
    code: row.code,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status as FinancialPeriodStatus,
    hasPostings: row.has_postings,
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
