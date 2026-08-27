import { getDb } from "@voyzu/capability/db";

import type { ItemListRow } from "../../types/item-list.types";
import { ItemRepo } from "../db/item.repo";

export async function listItems(): Promise<ItemListRow[]> {
  return new ItemRepo(getDb()).list();
}
