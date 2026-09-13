// Exercise the composed dispatcher, not a test-only routing implementation.
export { internalApi } from "../../../../../voyzu-packages/.run/internal-api/index";
import { resetPartyData } from "../../../../../voyzu-packages/.run/voyzu/packages/@voyzu/business-objects/modules/parties/server/lib/party.implementation";
import { resetCustomerData } from "../../../../../voyzu-packages/.run/packages/@voyzu/commercial/modules/customers/server/lib/customer-data.implementation";

export function resetMockData(): void {
  resetPartyData();
  resetCustomerData();
}
