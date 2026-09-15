import Type from "typebox";

export const ProductListRowDto = Type.Object({
  id: Type.Integer({ minimum: 1 }),
  code: Type.String(),
  name: Type.String(),
  itemSku: Type.Union([Type.String(), Type.Null()]),
  pricingCategoryCode: Type.Union([Type.String(), Type.Null()]),
  basePrice: Type.Number({ minimum: 0 }),
  type: Type.Union([Type.Literal("Physical"), Type.Literal("Service"), Type.Literal("Other")]),
  numberOfVariants: Type.Integer({ minimum: 1 }),
  category: Type.Union([Type.String(), Type.Null()]),
  brand: Type.Union([Type.String(), Type.Null()]),
  salesUnit: Type.Union([Type.String(), Type.Null()]),
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
}, { additionalProperties: false });

export type ProductListRowDto = Type.Static<typeof ProductListRowDto>;
