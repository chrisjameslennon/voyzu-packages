import "server-only";

import { OrganizationInventoryItemsListContent } from "../../client";
import { listInventoryCategories } from "@voyzu-modules/all-modules/common/inventory-categories/server";
import { listInventoryItems } from "@voyzu-modules/all-modules/common/inventory-items/server";
import { resolveTemplateSettingsScope } from "@voyzu-modules/all-modules/common/server";

export async function OrganizationInventoryItemsListPage() {
  const { companyId } = await resolveTemplateSettingsScope();
  const [items, categories] = await Promise.all([
    listInventoryItems(companyId),
    listInventoryCategories(companyId),
  ]);
  return <OrganizationInventoryItemsListContent items={items} categories={categories} />;
}
