import type { ActorType } from "@voyzu/finance/types/modules/core";
export interface FinancialPeriodRow {
  id: number;
  finance_organization_id: number;
  fiscal_year_id: number;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  has_postings: boolean;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}

export interface InsertFinancialPeriodRow {
  finance_organization_id: number;
  fiscal_year_id: number;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}
