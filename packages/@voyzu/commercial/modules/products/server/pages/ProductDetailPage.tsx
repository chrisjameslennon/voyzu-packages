import "server-only";
import { notFound } from "next/navigation";
import { internalApi } from "@voyzu/capability/internal-api";
import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { loadInventoryItems, getInventoryLinks } from "../lib/product-inventory.service";
import { listPricingCategories } from "../../../product-pricing-categories/server/lib/pricing-category.service";
import { getProduct } from "../lib/product.service";
import { listProductConfiguration } from "../lib/product-configuration.service";
import { ProductDetailView } from "../../client/ProductDetailView";

export async function ProductDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!code || !selectedOrganization) notFound();
  const organizationId = selectedOrganization.organization_id;
  const product = await getProduct(organizationId, code);
  if (!product) notFound();
  const [lists, categories, optionLists] = await Promise.all([
    listProductConfiguration(organizationId, "lists"),
    listProductConfiguration(organizationId, "categories"),
    listProductConfiguration(organizationId, "optionLists"),
  ]);
  const inventoryItems = await loadInventoryItems(organizationId);
  const inventoryAvailability = inventoryItems === null ? [] : await internalApi.call("@erp/inventory-item", "availabilityByOrganization", { organization_id: organizationId });
  return <ProductDetailView pricingCategories={listPricingCategories(organizationId)} inventoryAvailability={inventoryAvailability} inventoryItems={inventoryItems} initialInventoryLinks={getInventoryLinks(organizationId, code)} key={organizationId + "-" + product.id} initial={product} lists={lists} categories={categories} optionLists={optionLists} />;
}
