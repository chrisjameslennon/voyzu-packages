import type { AccountType, ActorType, OperationReference } from "@voyzu/finance/types/modules/core";
export interface InsertGlAccountCategoryRow {
  finance_company_id: number;
  code: string;
  name: string;
  account_type: AccountType;
  sequence: number;
  status?: string;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export interface UpdateGlAccountCategoryRow {
  name: string;
  account_type: AccountType;
  sequence: number;
  updated_user_id?: string | null;
  updated_actor_type?: ActorType;
  updated_date?: string;
  updated_mutation_id?: string | null;
}

export interface PatchGlAccountCategoryRow {
  name?: string;
  account_type?: AccountType;
  sequence?: number;
  status?: string;
  updated_user_id?: string | null;
  updated_actor_type?: ActorType;
  updated_date?: string;
  updated_mutation_id?: string | null;
}

export interface GlAccountCategoryRow {
  id: number;
  finance_company_id: number;
  code: string;
  name: string;
  account_type: AccountType;
  sequence: number;
  status: string;
  has_postings: boolean;
  companies_with_postings: string[];
  linked_by: OperationReference[];
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}
