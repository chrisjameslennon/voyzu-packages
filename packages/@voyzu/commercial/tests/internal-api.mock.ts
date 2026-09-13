import type { Customer } from "@voyzu/types/business-objects/customer";
import parties from "../modules/customers/mock-data/parties.json" with { type: "json" };
import * as accounts from "../modules/customers/server/lib/customer-account.implementation";
import * as priceListItems from "../modules/customers/server/lib/customer-price-list-item.implementation";
import * as priceLists from "../modules/customers/server/lib/customer-price-list.implementation";
import { resetCustomerData } from "../modules/customers/server/lib/customer-data.implementation";

// Test-only simulation of platform Party storage and distributed Customer assembly.
// This does not register resources or modify the platform internal API engine.
let mockParties = structuredClone(parties);

export function resetMockData(): void {
  mockParties = structuredClone(parties);
  resetCustomerData();
}

async function getCustomer({ id }: { id: number }): Promise<Customer | null> {
  const party = mockParties.find(party => party.id === id);
  const account = await accounts.get({ id });
  if (!party || !account) return null;
  return { ...party, account } satisfies Customer;
}

async function updateCustomer({ id, changes }: {
  id: number;
  changes: { code?: string; name?: string };
}): Promise<void> {
  const party = mockParties.find(party => party.id === id);
  if (!party) throw new Error("Mock customer not found");
  if (changes.code !== undefined) party.code = changes.code;
  if (changes.name !== undefined) party.name = changes.name;
}

const routes = {
  "@core/customer": { get: getCustomer, update: updateCustomer },
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
