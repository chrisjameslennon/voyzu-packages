export type ItemStatus = "ACTIVE" | "INACTIVE";

export interface ItemListRow {
  id: number;
  sku: string;
  name: string;
  category: string | null;
  unit: Unit | null;
  quantityTracked: boolean;
  unitsOnHand: number;
  status: ItemStatus;
}
import type { Unit } from "../../core/types";
