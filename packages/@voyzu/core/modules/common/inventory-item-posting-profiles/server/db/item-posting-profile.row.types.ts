import type { ActorType } from "@voyzu/core/types/modules/core";
import type { OperationReference } from "@voyzu/core/types/modules/core";

export interface ItemPostingProfileRow {
  id: number;
  finance_company_id: number;
  profile_code: string;
  profile_name: string;
  description: string;
  is_sold: boolean;
  is_purchased: boolean;
  is_consumed: boolean;
  revenue_code: string | null;
  revenue_name: string | null;
  cogs_code: string | null;
  cogs_name: string | null;
  purchase_expense_code: string | null;
  purchase_expense_name: string | null;
  consumption_code: string | null;
  consumption_name: string | null;
  adjustment_gain_code: string | null;
  adjustment_gain_name: string | null;
  adjustment_loss_code: string | null;
  adjustment_loss_name: string | null;
  status: "ACTIVE" | "INACTIVE";
  linked_by: OperationReference[];
  creation_date?: string;
  creation_actor_type?: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
  updated_date?: string;
  updated_actor_type?: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
}

export interface InsertItemPostingProfileRow {
  finance_company_id: number;
  code: string;
  name: string;
  description: string;
  is_sold: boolean;
  is_purchased: boolean;
  is_consumed: boolean;
  revenue_code: string | null;
  cogs_code: string | null;
  purchase_expense_code: string | null;
  consumption_code: string | null;
  adjustment_gain_code: string | null;
  adjustment_loss_code: string | null;
  status: "ACTIVE" | "INACTIVE";
  creation_date?: string;
  creation_actor_type?: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export interface UpdateItemPostingProfileRow {
  code: string;
  name: string;
  description: string;
  is_sold: boolean;
  is_purchased: boolean;
  is_consumed: boolean;
  revenue_code: string | null;
  cogs_code: string | null;
  purchase_expense_code: string | null;
  consumption_code: string | null;
  adjustment_gain_code: string | null;
  adjustment_loss_code: string | null;
  updated_date?: string;
  updated_actor_type?: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
}

export type PatchItemPostingProfileRow = Partial<UpdateItemPostingProfileRow> & {
  status?: "ACTIVE" | "INACTIVE";
};
