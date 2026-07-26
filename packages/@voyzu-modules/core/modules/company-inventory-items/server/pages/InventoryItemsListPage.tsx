import "server-only";

import { InventoryItemsListContent } from "../../client";
import { getSelectedCompany } from "@voyzu-modules/core/journals/server";
import { listInventoryCategories } from "@voyzu-modules/core/common/inventory-categories/server";
import { listInventoryItems } from "@voyzu-modules/core/common/inventory-items/server";

export async function InventoryItemsListPage() {
  const company = await getSelectedCompany();
  const items = company ? await listInventoryItems(company.id) : [];
  const categories = company ? await listInventoryCategories(company.id) : [];
  return <InventoryItemsListContent items={items} categories={categories} />;
}
