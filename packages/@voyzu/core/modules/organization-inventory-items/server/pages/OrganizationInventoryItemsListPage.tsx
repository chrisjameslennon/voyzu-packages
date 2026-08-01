import "server-only";

import { OrganizationInventoryItemsListContent } from "../../client";
import { listInventoryCategories } from "@voyzu/core/common/inventory-categories/server";
import { listInventoryItems } from "@voyzu/core/common/inventory-items/server";
import { resolveTemplateSettingsScope } from "@voyzu/core/common/server";

export async function OrganizationInventoryItemsListPage() {
  const { companyId } = await resolveTemplateSettingsScope();
  const [items, categories] = await Promise.all([
    listInventoryItems(companyId),
    listInventoryCategories(companyId),
  ]);
  return <OrganizationInventoryItemsListContent items={items} categories={categories} />;
}
