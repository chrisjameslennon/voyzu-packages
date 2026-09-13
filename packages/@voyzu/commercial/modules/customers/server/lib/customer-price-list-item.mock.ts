import type { CustomerPriceListItem } from "../../../../business-objects/customer-price-list-item";

/** Mock data only: updates return a response but do not persist changes. */
export async function get({ id }: { id: number }): Promise<CustomerPriceListItem | null> {
  return id === 1 ? { id: 1, code: "ITEM-001", name: "Example Item", price: 25 } : null;
}

export async function update({ id, price }: { id: number; price: number }): Promise<CustomerPriceListItem> {
  if (id !== 1) throw new Error("Mock customer price list item not found");
  return { id: 1, code: "ITEM-001", name: "Example Item", price };
}
