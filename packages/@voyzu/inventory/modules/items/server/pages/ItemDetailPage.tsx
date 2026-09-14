import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";
import { notFound } from "next/navigation";
import { ItemDetail } from "../../client";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import { getItem, listItemCategories } from "../lib/item.service";

export async function ItemDetailPage({ context }: PageProps) {
  const { sku } = pageStringParameters(context.pathParams);
  if (!sku) notFound();
  const organization = await getSelectedOrganization(); if (!organization) notFound();
  const [item, categories] = await Promise.all([
    getItem(organization.id, sku), listItemCategories(organization.id),
  ]);
  if (!item) notFound();
  return <ItemDetail item={item} categories={categories} />;
}
