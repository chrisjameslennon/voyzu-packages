import type { ActorType } from "@voyzu/finance/types/modules/core";
export interface FinancialYearRow {
  id: number;
  finance_company_id: number;
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

export interface InsertFinancialYearRow {
  finance_company_id: number;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  creation_date?: string;
  creation_actor_type?: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export type PatchFinancialYearRow = {
  code?: string;
  name?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  updated_user_id?: string | null;
  updated_actor_type?: ActorType;
  updated_date?: string;
  updated_mutation_id?: string;
};
