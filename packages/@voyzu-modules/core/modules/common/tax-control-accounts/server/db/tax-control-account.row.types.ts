import type { AccountType, Status } from "@voyzu/types/modules/core";
import type { ActorType } from "@voyzu/types/modules/core";
export interface TaxControlAccountRow {
  company_id: number;
  code: string;
  ledger: "TAX";
  name: string;
  description: string;
  tax_family_code: string;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  gl_account_type: AccountType;
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

export interface GlAccountLookupRow {
  id: number;
  account_type: AccountType;
  status: Status;
}
