import Type, { type Static } from "typebox";

export const CustomerPriceListItemSchema = Type.Object({
  id: Type.Number(),
  code: Type.String(),
  name: Type.String(),
  price: Type.Number(),
}, { additionalProperties: false });

export interface CustomerPriceListItem extends Static<typeof CustomerPriceListItemSchema> {}
