import "server-only";

import { ItemsList } from "../../client";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import { listItems } from "../lib/item.service";
import { listItemCategories, generateItemSku } from "../lib/item.service";

export async function ItemsListPage() {
  const organization = await getSelectedOrganization();
  if (!organization) return <ItemsList items={[]} categories={[]} nextSku="SKU-000001" />;
  const [items, categories, nextSku] = await Promise.all([
    listItems(organization.id), listItemCategories(organization.id), generateItemSku(organization.id),
  ]);
  return <ItemsList items={items} categories={categories} nextSku={nextSku} />;
}
