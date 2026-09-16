import "server-only";
import { getCustomer } from "./customer.service";
import { getCustomerConfiguration } from "./customer-configuration.service";
/** Apply the customer's current price-list rule to a resolved product/variant base price without changing it. */
export function calculateCustomerPrice(organizationId: number, customerCode: string, basePrice: number): number {
  if (!Number.isFinite(basePrice) || basePrice < 0) throw new Error("Supply a valid base price.");
  const customer = getCustomer(organizationId, customerCode);
  if (!customer || customer.status !== "ACTIVE") throw new Error("Select an active customer.");
  if (!customer.priceListCode) return Math.round((basePrice + Number.EPSILON) * 100) / 100;
  const list = getCustomerConfiguration(organizationId, "priceLists", customer.priceListCode);
  if (!list || list.status !== "ACTIVE") throw new Error("The customer's price list is unavailable.");
  const adjustment = list.method === "percentage" ? basePrice * list.value / 100 : list.value;
  const price = basePrice + (list.direction === "increase" ? adjustment : -adjustment);
  if (!Number.isFinite(price) || price < 0) throw new Error("The customer price-list adjustment would produce an invalid price.");
  return Math.round((price + Number.EPSILON) * 100) / 100;
}
