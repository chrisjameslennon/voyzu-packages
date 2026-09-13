import Type from "typebox";

export const CustomerPriceListItemSchema = Type.Object(
  {
    id: Type.Number(),
    code: Type.String(),
    name: Type.String(),
    price: Type.Number(),
  },
  { additionalProperties: false },
);

export const CustomerPriceListItemGetRequestDto = Type.Object({ id: Type.Number() }, { additionalProperties: false });

export const CustomerPriceListItemGetResponseDto = Type.Union([CustomerPriceListItemSchema, Type.Null()]);

export const CustomerPriceListItemUpdateRequestDto = Type.Object({ id: Type.Number(), price: Type.Number() }, { additionalProperties: false });
