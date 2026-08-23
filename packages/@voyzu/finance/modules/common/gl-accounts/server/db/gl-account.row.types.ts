import type { AccountType, ActorType, GlAccountPointerReference } from "@voyzu/finance/types/modules/core";
export interface GlAccountRow {
  id: number;
  finance_organization_id: number;
  code: string;
  name: string;
  account_type: AccountType;
  account_category_id: number | null;
  category_code?: string;
  category_name?: string;
  status: string;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
  linked_by: GlAccountPointerReference[];
  has_postings: boolean;
  companies_with_postings: string[];
}

export interface InsertGlAccountRow {
  finance_organization_id: number;
  code: string;
  name: string;
  account_type: AccountType;
  account_category_id: number;
  status?: string;
  creation_user_id?: string | null;
}

export interface UpdateGlAccountRow {
  code: string;
  name: string;
  account_type: AccountType;
  account_category_id: number | null;
  updated_user_id?: string | null;
  updated_actor_type?: ActorType;
  updated_date?: string;
  updated_mutation_id?: string | null;
}

export type PatchGlAccountRow = Partial<UpdateGlAccountRow>;

