import type { CustomerPriceListItem, CustomerPriceListItemMethods } from "../../contracts/customer-price-list-item.definition";
import { customerData } from "./customer-data.implementation";

/** JSON-backed data; changes persist in memory only. */
export async function get({ id }: { id: number }): Promise<CustomerPriceListItem | null> {
  const item = customerData.priceLists.flatMap(list => list.items).find(item => item.id === id);
  if (!item) return null;
  return { ...item } satisfies CustomerPriceListItem;
}

export async function update({ id, price }: { id: number; price: number }): Promise<CustomerPriceListItem> {
  const item = customerData.priceLists.flatMap(list => list.items).find(item => item.id === id);
  if (!item) throw new Error("Customer price list item not found");
  if (!Number.isFinite(price)) throw new Error("Price must be finite");
  item.price = price;
  return { ...item } satisfies CustomerPriceListItem;
}

export const customerPriceListItemMethods = { get, update } satisfies CustomerPriceListItemMethods;
