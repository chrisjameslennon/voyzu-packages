import type { ActorType } from "@voyzu/types/modules/core";

import type { OperationReference } from "@voyzu/types/modules/core";

export interface InventoryCategoryRow {
  id: number;
  company_id: number;
  code: string;
  name: string;
  description: string;
  posting_profile_code: string;
  status: "ACTIVE" | "INACTIVE";
  number_of_items: {
    total: number;
    active: number;
    inactive: number;
  };
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

export interface InsertInventoryCategoryRow {
  company_id: number;
  code: string;
  name: string;
  description: string;
  posting_profile_code: string;
  status: "ACTIVE" | "INACTIVE";
  creation_date?: string;
  creation_actor_type?: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export interface UpdateInventoryCategoryRow {
  name: string;
  description: string;
  posting_profile_code: string;
  updated_date?: string;
  updated_actor_type?: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
}
export type PatchInventoryCategoryRow = Partial<UpdateInventoryCategoryRow> & {
  code?: string;
  updated_date?: string;
  updated_actor_type?: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
};
