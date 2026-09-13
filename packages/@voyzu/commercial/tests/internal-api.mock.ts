import { createCustomerMethods } from "../../../../../voyzu/packages/@voyzu/business-objects/modules/customers/server/lib/customer.implementation";
import { resetPartyData } from "../../../../../voyzu/packages/@voyzu/business-objects/modules/parties/server/lib/party.implementation";
import * as accounts from "../modules/customers/server/lib/customer-account.implementation";
import * as priceListItems from "../modules/customers/server/lib/customer-price-list-item.implementation";
import * as priceLists from "../modules/customers/server/lib/customer-price-list.implementation";
import { resetCustomerData } from "../modules/customers/server/lib/customer-data.implementation";

// Test-only routing: implementations are real module exports, backed by fixtures.
// This does not register resources or modify the platform internal API engine.
const customerMethods = createCustomerMethods(accounts.customerAccountMethods);

export function resetMockData(): void {
  resetPartyData();
  resetCustomerData();
}

const routes = {
  "@core/customer": customerMethods,
  "@core/customer/account": accounts.customerAccountMethods,
  "@voyzu/commercial/customer-price-list-items": priceListItems.customerPriceListItemMethods,
  "@voyzu/commercial/customer-price-lists": priceLists.customerPriceListMethods,
};

type Resource = keyof typeof routes;
type Handler<R extends Resource, M extends keyof typeof routes[R]> =
  Extract<typeof routes[R][M], (...args: any[]) => Promise<any>>;

export const internalApi = {
  async call<R extends Resource, M extends keyof typeof routes[R]>(
    resource: R,
    method: M,
    parameters: Parameters<Handler<R, M>>[0],
  ): Promise<Awaited<ReturnType<Handler<R, M>>>> {
    const handler = routes[resource][method] as (parameters: unknown) => Promise<unknown>;
    return await handler(parameters) as Awaited<ReturnType<Handler<R, M>>>;
  },
};
