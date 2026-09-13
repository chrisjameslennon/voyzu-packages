import accounts from "../../mock-data/customer-accounts.json" with { type: "json" };
import priceLists from "../../mock-data/price-lists.json" with { type: "json" };

// Mutable copies of the data. Imported fixtures and files remain unchanged.
export const customerData = {
  accounts: structuredClone(accounts),
  priceLists: structuredClone(priceLists),
};

export function resetCustomerData(): void {
  customerData.accounts = structuredClone(accounts);
  customerData.priceLists = structuredClone(priceLists);
}
