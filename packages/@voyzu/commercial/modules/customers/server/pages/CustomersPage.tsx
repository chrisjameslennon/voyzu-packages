import "server-only";
import { internalApi } from "@voyzu/capability/internal-api";
import { CustomersList } from "../../client/CustomersList";
import { listCustomerConfiguration } from "../lib/customer-configuration.service";
import { listCustomers } from "../lib/customer.service";
export async function CustomersPage() {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  return <CustomersList key={selectedOrganization?.organization_id ?? "none"} categories={selectedOrganization ? listCustomerConfiguration(selectedOrganization.organization_id, "categories") : []} priceLists={selectedOrganization ? listCustomerConfiguration(selectedOrganization.organization_id, "priceLists") : []} customers={selectedOrganization ? listCustomers(selectedOrganization.organization_id) : []} hasOrganization={!!selectedOrganization} />;
}
