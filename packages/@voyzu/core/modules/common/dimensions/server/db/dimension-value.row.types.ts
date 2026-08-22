import type { ActorType } from "@voyzu/core/types/modules/core";
export interface DimensionValueRow {
  id: number;
  finance_company_id: number;
  dimension_id: number;
  name: string;
  status: string;
  has_postings: boolean;
  companies_with_postings: string[];
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}

export interface InsertDimensionValueRow {
  finance_company_id: number;
  dimension_id: number;
  name: string;
  status?: string;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export interface PatchDimensionValueRow {
  name?: string;
  status?: string;
  updated_user_id?: string | null;
  updated_actor_type?: ActorType;
  updated_date?: string;
  updated_mutation_id?: string | null;
}
