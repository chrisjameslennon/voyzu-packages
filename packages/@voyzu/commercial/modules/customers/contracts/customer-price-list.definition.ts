import Type, { type Static } from "typebox";
import { CustomerPriceListItemSchema, type CustomerPriceListItem } from "./customer-price-list-item.definition";

export const CustomerPriceListSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    items: Type.Array(CustomerPriceListItemSchema),
  },
  { additionalProperties: false },
);

export interface CustomerPriceList
  extends Static<typeof CustomerPriceListSchema> {}

export interface CustomerPriceListMethods {
  get(parameters: { id: number }): Promise<CustomerPriceList | null>;
  update(parameters: {
    id: number;
    changes: { name?: string; items?: CustomerPriceListItem[] };
  }): Promise<CustomerPriceList>;
}
