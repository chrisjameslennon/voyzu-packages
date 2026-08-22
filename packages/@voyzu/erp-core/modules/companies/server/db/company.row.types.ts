import type { ActorType } from "@voyzu/erp-core/types/modules/core";
export interface CompanyRow {
  id: number;
  code: string;
  name: string;
  country_code: string;
  country_name?: string;
  base_currency_code: string;
  currency_name?: string;
  status: string;
  organization_id: number;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}

export interface InsertCompanyRow {
  code: string;
  name: string;
  country_code: string;
  base_currency_code: string;
  status?: string;
  organization_id?: number;
  creation_date?: string;
  creation_actor_type?: string;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
  updated_date?: string;
  updated_actor_type?: string;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
}

export interface UpdateCompanyRow {
  code: string;
  name: string;
  country_code: string;
  base_currency_code: string;
  updated_user_id?: string | null;
  updated_date?: string;
  updated_actor_type?: string;
  updated_mutation_id?: string | null;
}

export type PatchCompanyRow = Partial<UpdateCompanyRow>;
