import Type, { type Static } from "typebox";
import { CustomerPriceListItemSchema } from "./customer-price-list-item";

export const CustomerPriceListSchema = Type.Array(CustomerPriceListItemSchema);

export type CustomerPriceList = Static<typeof CustomerPriceListSchema>;
