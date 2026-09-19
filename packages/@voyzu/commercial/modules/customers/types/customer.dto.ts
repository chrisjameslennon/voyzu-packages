import Type, { type Static } from "typebox";
const text = (maxLength: number) => Type.String({ maxLength });
export const addressTypes = ["POSTAL", "SHIPPING"] as const;
export const CustomerAddressDto = Type.Object({
  address_type: Type.Union([Type.Literal("SHIPPING"), Type.Literal("POSTAL")]),
  address_line_1: text(200), address_line_2: text(200), city: text(100),
  region_or_state: text(100), postal_code: text(20), country_code: Type.String({ pattern: "^([A-Z]{2})?$" }),
}, { additionalProperties: false });
export type CustomerAddress = Static<typeof CustomerAddressDto>;
export const CustomerInputDto = Type.Object({
  code: Type.String({ minLength: 1, maxLength: 50, pattern: "^[A-Za-z0-9][A-Za-z0-9_-]*$" }),
  name: Type.String({ minLength: 1, maxLength: 200, pattern: "\\S" }),
  primaryContactName: text(200), email: text(254),
  categoryCode: Type.Union([Type.String({ minLength: 1 }), Type.Null()]), priceListCode: Type.Union([Type.String({ minLength: 1 }), Type.Null()]),
  usePostalAddressForShipping: Type.Boolean(),
  addresses: Type.Array(CustomerAddressDto, { maxItems: 2 }), notes: text(5000),
}, { additionalProperties: false });
export type CustomerInput = Static<typeof CustomerInputDto>;
export type Customer = CustomerInput & { id: number; status: "ACTIVE" | "INACTIVE"; createdAt: number; updatedAt?: number };
export const emptyAddress = (address_type: CustomerAddress["address_type"]): CustomerAddress => ({ address_type, address_line_1: "", address_line_2: "", city: "", region_or_state: "", postal_code: "", country_code: "" });
export const emptyCustomer = (): CustomerInput => ({ code: "", name: "", primaryContactName: "", email: "", categoryCode: null, priceListCode: null, usePostalAddressForShipping: false, addresses: addressTypes.map(emptyAddress), notes: "" });

export function synchronizeCustomerAddresses(value: CustomerInput): CustomerInput {
  const postal = value.addresses.find((address) => address.address_type === "POSTAL") ?? emptyAddress("POSTAL");
  const shipping = value.usePostalAddressForShipping
    ? { ...postal, address_type: "SHIPPING" as const }
    : value.addresses.find((address) => address.address_type === "SHIPPING") ?? emptyAddress("SHIPPING");
  return { ...value, addresses: [postal, shipping] };
}
