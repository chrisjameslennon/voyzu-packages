import "server-only";
import { notFound } from "next/navigation";
import { internalApi } from "@voyzu/capability/internal-api";
import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { listCustomerConfiguration } from "../lib/customer-configuration.service";
import { getCustomer } from "../lib/customer.service";
import { CustomerDetailView } from "../../client/CustomerDetailView";
export async function CustomerDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!code || !selectedOrganization) notFound();
  const customer = getCustomer(selectedOrganization.organization_id, code);
  if (!customer) notFound();
  return <CustomerDetailView key={selectedOrganization.organization_id + "-" + customer.id} categories={listCustomerConfiguration(selectedOrganization.organization_id, "categories")} priceLists={listCustomerConfiguration(selectedOrganization.organization_id, "priceLists")} initial={customer} />;
}
