import "server-only";
import { internalApi } from "@voyzu/capability/internal-api";
import { ProductConfigurationList } from "../../client/ProductConfigurationList";
import { listProductConfiguration } from "../lib/product-configuration.service";
import type { ProductConfigurationKind } from "../../types/product-configuration.dto";

async function ConfigurationPage({ kind }: { kind: ProductConfigurationKind }) {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  const products = selectedOrganization ? await listProductConfiguration(selectedOrganization.organization_id, kind) : [];
  return <ProductConfigurationList key={`${kind}-${selectedOrganization?.organization_id ?? "none"}`} kind={kind} products={products} hasOrganization={Boolean(selectedOrganization)} />;
}

export function ManageListsPage() { return <ConfigurationPage kind="lists" />; }
export function ProductCategoriesPage() { return <ConfigurationPage kind="categories" />; }
