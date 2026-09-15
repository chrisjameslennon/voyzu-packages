import "server-only";
import { internalApi } from "@voyzu/capability/internal-api";
import { listProductConfiguration } from "../lib/product-configuration.service";
import { ProductConfigurationList } from "../../client/ProductConfigurationList";

export async function ProductOptionListsPage() {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  const products = selectedOrganization ? await listProductConfiguration(selectedOrganization.organization_id, "optionLists") : [];
  return <ProductConfigurationList key={selectedOrganization?.organization_id ?? "none"} kind="optionLists" products={products} hasOrganization={Boolean(selectedOrganization)} />;
}
