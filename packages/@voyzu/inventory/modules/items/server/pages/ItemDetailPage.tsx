import "server-only";
import { notFound } from "next/navigation";
import { ItemDetail } from "../../client";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import { getItem, listItemCategories, listItems } from "../lib/item.service";

export async function ItemDetailPage({ sku }: { sku?: string }) {
  if (!sku) notFound();
  const organization = await getSelectedOrganization(); if (!organization) notFound();
  const [item, categories, items] = await Promise.all([
    getItem(organization.id, decodeURIComponent(sku)), listItemCategories(organization.id), listItems(organization.id),
  ]);
  if (!item) notFound();
  return <ItemDetail item={item} categories={categories} itemOptions={items} />;
}
