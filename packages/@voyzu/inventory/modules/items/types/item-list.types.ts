export type ItemStatus = "ACTIVE" | "INACTIVE";

import type { ItemListCustomFieldDto } from "./item.types";

export interface ItemListRow {
  id: number;
  sku: string;
  name: string;
  category: string | null;
  unit: Unit | null;
  quantityTracked: boolean;
  unitsOnHand: number;
  customFields: ItemListCustomFieldDto[];
  status: ItemStatus;
}
import type { Unit } from "../../core/types";
