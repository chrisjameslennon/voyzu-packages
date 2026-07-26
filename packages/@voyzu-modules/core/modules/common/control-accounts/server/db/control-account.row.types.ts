import type { ActorType } from "@voyzu/types/modules/core";
export interface ControlAccountRow {
  company_id: number;
  ledger: "ACCOUNTS_RECEIVABLE" | "ACCOUNTS_PAYABLE";
  code: string;
  name: string;
  gl_account_id: number;
  gl_account_code?: string;
  gl_account_name?: string;
  gl_account_type?: string;
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
