import "server-only";
import { notFound } from "next/navigation";
import { internalApi } from "@voyzu/capability/internal-api";
import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { listCustomerConfiguration, getCustomerConfiguration } from "../lib/customer-configuration.service";
import type { CustomerConfigurationKind } from "../../types/customer-configuration.dto";
import { CustomerConfigurationList } from "../../client/CustomerConfigurationList";
import { CustomerConfigurationDetailView } from "../../client/CustomerConfigurationDetailView";
async function list(kind: CustomerConfigurationKind) {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  return <CustomerConfigurationList key={kind + "-" + (selectedOrganization?.organization_id ?? "none")} kind={kind} customers={selectedOrganization ? listCustomerConfiguration(selectedOrganization.organization_id, kind) : []} hasOrganization={!!selectedOrganization} />;
}
async function detail({ context }: PageProps, kind: CustomerConfigurationKind) {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  const { code } = pageStringParameters(context.pathParams);
  if (!selectedOrganization || !code) notFound();
  const record = getCustomerConfiguration(selectedOrganization.organization_id, kind, code);
  if (!record) notFound();
  return <CustomerConfigurationDetailView key={kind + "-" + selectedOrganization.organization_id + "-" + record.id} initial={record} kind={kind} />;
}
export const CustomerCategoriesPage = () => list("categories");
export const CustomerPriceListsPage = () => list("priceLists");
export const CustomerCategoryDetailPage = (props: PageProps) => detail(props, "categories");
export const CustomerPriceListDetailPage = (props: PageProps) => detail(props, "priceLists");
