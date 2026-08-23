import type { FinancialYearResponseDto, FinancialYearStatus } from "@voyzu/finance/types/modules/financial-years";
import type { FinancialYearCreateRequestDto } from "@voyzu/finance/types/modules/financial-years";
import type { FinancialYearRow, InsertFinancialYearRow } from "../db/financial-year.row.types";

export function toDto(row: FinancialYearRow): FinancialYearResponseDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    companyId: row.finance_company_id,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status as FinancialYearStatus,
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

export function toInsertRow(input: FinancialYearCreateRequestDto, companyId: number): InsertFinancialYearRow {
  return {
    finance_company_id: companyId,
    code: input.code,
    name: input.name ?? `Financial Year ${input.code.replace(/^FY-/, "")}`,
    start_date: input.startDate,
    end_date: input.endDate,
    status: input.status,
  };
}
