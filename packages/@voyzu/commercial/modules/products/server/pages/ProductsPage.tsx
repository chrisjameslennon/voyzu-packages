import "server-only";
import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { listPricingCategories } from "../../../product-pricing-categories/server/lib/pricing-category.service";
import { internalApi } from "@voyzu/capability/internal-api";
import { ProductsList } from "../../client/ProductsList";
import { listProductConfiguration } from "../lib/product-configuration.service";
import { listProducts } from "../lib/product.service";

export async function ProductsPage({ context }: PageProps) {
  const query = pageStringParameters(context.queryParams);
  const pricingCategoryCodes = query.pricingCategory?.split(",").filter(Boolean) ?? [];
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  const products = selectedOrganization
    ? await listProducts(selectedOrganization.organization_id)
    : [];
  return <ProductsList inventoryInstalled={internalApi.has("@erp/inventory-item", "byOrganization")} categories={selectedOrganization ? (await listProductConfiguration(selectedOrganization.organization_id, "categories")).filter((row) => row.status === "ACTIVE") : []} pricingCategories={selectedOrganization ? listPricingCategories(selectedOrganization.organization_id) : []} initialPricingCategoryCodes={pricingCategoryCodes} showAllStatuses={query.status === "all"} key={(selectedOrganization?.organization_id ?? "none") + JSON.stringify(query)} products={products} hasOrganization={Boolean(selectedOrganization)} />;
}
