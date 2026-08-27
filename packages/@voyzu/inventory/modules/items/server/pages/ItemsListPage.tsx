import "server-only";

import { ItemsList } from "../../client";
import { listItems } from "../lib/item.service";

export async function ItemsListPage() {
  return <ItemsList items={await listItems()} />;
}
