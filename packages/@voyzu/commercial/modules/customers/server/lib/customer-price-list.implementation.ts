import type { CustomerPriceList, CustomerPriceListMethods } from "../../contracts/customer-price-list.definition";
import { customerData } from "./customer-data.implementation";

export async function get({ id }: { id: number }): Promise<CustomerPriceList | null> {
  const list = customerData.priceLists.find(list => list.id === id);
  if (!list) return null;
  return {
    id: list.id,
    name: list.name,
    items: list.items.map(item => ({ ...item })),
  } satisfies CustomerPriceList;
}

export async function update({ id, changes }: Parameters<CustomerPriceListMethods["update"]>[0]): Promise<CustomerPriceList> {
  const list = customerData.priceLists.find(list => list.id === id);
  if (!list) throw new Error("Customer price list not found");
  if (changes.name !== undefined) list.name = changes.name;
  if (changes.items !== undefined) {
    list.items = changes.items.map(({ id, code, name, price }) => ({ id, code, name, price }));
  }
  return (await get({ id }))!;
}

export const customerPriceListMethods = { get, update } satisfies CustomerPriceListMethods;
