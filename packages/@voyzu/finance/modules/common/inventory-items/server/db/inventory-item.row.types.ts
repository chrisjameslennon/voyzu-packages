import type { ActorType } from "@voyzu/finance/types/modules/core";

export interface InventoryItemRow {
  id: number;
  finance_organization_id: number;
  item_code: string;
  item_name: string;
  description: string;
  item_type: "INVENTORY" | "NON_INVENTORY" | "SERVICE";
  category_code: string;
  unit_code: string;
  status: "ACTIVE" | "INACTIVE";
  has_postings: boolean;
  quantity_on_hand_derived: number | null;
  book_value_derived: number | null;
  avg_unit_book_value_derived: number | null;
  creation_date?: string;
  creation_actor_type?: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
  updated_user_id?: string | null;
  updated_actor_type?: ActorType | null;
  updated_date?: string | null;
  updated_mutation_id?: string | null;
}

export interface InsertInventoryItemRow {
  finance_organization_id: number;
  code: string;
  name: string;
  description: string;
  item_type: "INVENTORY" | "NON_INVENTORY" | "SERVICE";
  category_code: string;
  unit_code: string;
  status: "ACTIVE" | "INACTIVE";
  quantity_on_hand_derived: number | null;
  book_value_derived: number | null;
  avg_unit_book_value_derived: number | null;
  creation_date?: string;
  creation_actor_type?: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export interface UpdateInventoryItemRow extends Omit<InsertInventoryItemRow, "finance_organization_id" | "code" | "status" | "creation_user_id" | "creation_mutation_id"> {
  updated_user_id?: string | null;
  updated_actor_type?: ActorType;
  updated_date?: string;
  updated_mutation_id?: string;
}
export type PatchInventoryItemRow = Partial<UpdateInventoryItemRow> & {
  code?: string;
  status?: "ACTIVE" | "INACTIVE";
};
