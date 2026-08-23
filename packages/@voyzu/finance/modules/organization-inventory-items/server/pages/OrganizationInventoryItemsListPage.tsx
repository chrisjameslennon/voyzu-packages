import "server-only";

import { OrganizationInventoryItemsListContent } from "../../client";
import { listInventoryCategories } from "@voyzu/finance/common/inventory-categories/server";
import { listInventoryItems } from "@voyzu/finance/common/inventory-items/server";
import { resolveTemplateSettingsScope } from "@voyzu/finance/common/server";

export async function OrganizationInventoryItemsListPage() {
  const { companyId } = await resolveTemplateSettingsScope();
  const [items, categories] = await Promise.all([
    listInventoryItems(companyId),
    listInventoryCategories(companyId),
  ]);
  return <OrganizationInventoryItemsListContent items={items} categories={categories} />;
}
