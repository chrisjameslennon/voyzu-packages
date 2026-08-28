import "server-only";

import { ItemsList } from "../../client";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import { listItems } from "../lib/item.service";
import { listItemCategories, generateItemSku } from "../lib/item.service";
import { listPostingProfileOptions } from "../lib/posting-profile-options";

export async function ItemsListPage() {
  const organization = await getSelectedOrganization();
  if (!organization) return <ItemsList items={[]} categories={[]} postingProfiles={[]} nextSku="SKU-000001" />;
  const [items, categories, postingProfiles, nextSku] = await Promise.all([
    listItems(organization.id), listItemCategories(organization.id), listPostingProfileOptions(), generateItemSku(organization.id),
  ]);
  return <ItemsList items={items} categories={categories} postingProfiles={postingProfiles} nextSku={nextSku} />;
}
