import Type from "typebox";
import { CustomerPriceListItemSchema } from "./customer-price-list-item.internal-api.dto";

export const CustomerPriceListSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    items: Type.Array(CustomerPriceListItemSchema),
  },
  { additionalProperties: false },
);

export const CustomerPriceListGetRequestDto = Type.Object({ id: Type.Number() }, { additionalProperties: false });

export const CustomerPriceListGetResponseDto = Type.Union([CustomerPriceListSchema, Type.Null()]);

export const CustomerPriceListUpdateRequestDto = Type.Object({
        id: Type.Number(),
        changes: Type.Object({
          name: Type.Optional(Type.String()),
          items: Type.Optional(Type.Array(CustomerPriceListItemSchema)),
        }, { additionalProperties: false }),
      }, { additionalProperties: false });
