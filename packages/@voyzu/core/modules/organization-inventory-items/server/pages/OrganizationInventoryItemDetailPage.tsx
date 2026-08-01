import "server-only";

import { notFound } from "next/navigation";

import { listInventoryCategories } from "@voyzu/core/common/inventory-categories/server";
import { listInventoryItems } from "@voyzu/core/common/inventory-items/server";
import { resolveTemplateSettingsScope } from "@voyzu/core/common/server";
import { OrganizationInventoryItemDetail } from "../../client";

export async function OrganizationInventoryItemDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const { companyId } = await resolveTemplateSettingsScope();
  const [items, categories] = await Promise.all([listInventoryItems(companyId), listInventoryCategories(companyId)]);
  const item = items.find((candidate) => candidate.item_code === decodeURIComponent(code));
  if (!item) notFound();
  return <OrganizationInventoryItemDetail item={item} categories={categories} />;
}
