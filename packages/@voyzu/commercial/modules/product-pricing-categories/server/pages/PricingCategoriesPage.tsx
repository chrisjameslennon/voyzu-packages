import "server-only";
import { internalApi } from "@voyzu/capability/internal-api";
import { listPricingCategories } from "../lib/pricing-category.service";
import { PricingCategoriesList } from "../../client/PricingCategoriesList";
export async function PricingCategoriesPage() {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  return <PricingCategoriesList key={selectedOrganization?.organization_id ?? "none"} initialRows={selectedOrganization ? listPricingCategories(selectedOrganization.organization_id) : []} hasOrganization={!!selectedOrganization} />;
}
