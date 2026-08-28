import type { ItemStatus, ItemType } from "../../types/item-list.types";
import type { ActorType } from "@voyzu/types/modules/core";
import type { Unit } from "../../../core/types";

export interface ItemRow {
  id: number; organization_id: number; sku: string; name: string; description: string;
  item_category_id: number | null; category_code: string | null; category_name: string | null;
  unit: Unit | null; item_type: ItemType; quantity_tracked: boolean; item_posting_code_id: number | null;
  status: ItemStatus; in_use: boolean; creation_date: string; creation_actor_type: ActorType;
  creation_user_id: string | null; creation_mutation_id: string | null; updated_date: string;
  updated_actor_type: ActorType; updated_user_id: string | null; updated_mutation_id: string | null;
}

export interface ItemComponentRow {
  component_item_id: number; sku: string; name: string; quantity: number; unit: Unit | null; item_type: ItemType;
}
