import Type, { type Static } from "typebox";

export const CustomerPriceListItemSchema = Type.Object(
  {
    id: Type.Number(),
    code: Type.String(),
    name: Type.String(),
    price: Type.Number(),
  },
  { additionalProperties: false },
);

export interface CustomerPriceListItem
  extends Static<typeof CustomerPriceListItemSchema> {}

export interface CustomerPriceListItemMethods {
  get(parameters: { id: number }): Promise<CustomerPriceListItem | null>;
  update(parameters: { id: number; price: number }): Promise<CustomerPriceListItem>;
}
