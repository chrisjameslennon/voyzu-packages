import "server-only";

import { notFound } from "next/navigation";

import { InventoryItemDetail } from "../../client";
import { getSelectedCompany } from "@voyzu-modules/all-modules/journals/server";
import { listInventoryItems } from "@voyzu-modules/all-modules/common/inventory-items/server";
import { listInventoryCategories } from "@voyzu-modules/all-modules/common/inventory-categories/server";

export async function InventoryItemDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const [items, categories] = await Promise.all([listInventoryItems(company.id), listInventoryCategories(company.id)]);
  const item = items.find((candidate) => candidate.item_code === decodeURIComponent(code));
  if (!item) notFound();
  return <InventoryItemDetail item={item} categories={categories} />;
}
