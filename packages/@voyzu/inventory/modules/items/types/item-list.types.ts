export type ItemStatus = "ACTIVE" | "INACTIVE";
export type ItemType = "SINGLE_ITEM" | "ASSEMBLY";

export interface ItemListRow {
  id: number;
  sku: string;
  name: string;
  category: string | null;
  itemType: ItemType;
  unit: Unit | null;
  quantityTracked: boolean;
  status: ItemStatus;
}
import type { Unit } from "../../core/types";
