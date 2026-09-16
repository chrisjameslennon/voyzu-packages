import Type from "typebox";
import { ProductListRowDto } from "./product-list.dto";

const text = Type.String({ maxLength: 2000 });
const status = ProductListRowDto.properties.status;
export const ProductOptionDto = Type.Object({
  id: Type.String({ minLength: 1 }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  sourceListCode: Type.Union([Type.String(), Type.Null()]),
  values: Type.Array(Type.String({ minLength: 1, maxLength: 100 }), { minItems: 1, maxItems: 100, uniqueItems: true }),
}, { additionalProperties: false });
export const ProductVariantDto = Type.Object({
  id: Type.String({ minLength: 1 }),
  sku: Type.String({ minLength: 1, maxLength: 100 }),
  basePrice: Type.Optional(Type.Union([Type.Number({ minimum: 0 }), Type.Null()])),
  status,
  options: Type.Record(Type.String(), Type.String()),
  imagePath: text,
}, { additionalProperties: false });
export const ProductEditDto = Type.Object({
  useVariants: Type.Boolean(),
  variantPricing: Type.Union([Type.Literal("BASE_PRICE"), Type.Literal("OWN_PRICES")]),
  name: Type.String({ pattern: "\\S", maxLength: 200 }),
  type: ProductListRowDto.properties.type,
  category: Type.Union([Type.String(), Type.Null()]),
  brand: Type.Union([Type.String(), Type.Null()]),
  manufacturer: Type.String(),
  salesUnit: Type.Union([Type.String(), Type.Null()]),
  status,
  shortDescription: text,
  description: Type.String({ maxLength: 20000 }),
  images: Type.Array(Type.Object({ path: Type.String({ pattern: "\\S", maxLength: 2000 }), primary: Type.Boolean() }, { additionalProperties: false }), { maxItems: 100 }),
  options: Type.Array(ProductOptionDto, { maxItems: 6 }),
  variants: Type.Array(ProductVariantDto, { minItems: 1, maxItems: 500 }),
  basePrice: Type.Number({ minimum: 0 }),
  pricingCategoryCode: Type.Union([Type.String(), Type.Null()]),
  customFields: Type.Array(Type.Object({ name: Type.String({ pattern: "\\S" }), value: text }, { additionalProperties: false }), { maxItems: 100 }),
}, { additionalProperties: false });
export type ProductEditDto = Type.Static<typeof ProductEditDto>;
export type ProductOption = Type.Static<typeof ProductOptionDto>;
export type ProductVariant = Type.Static<typeof ProductVariantDto>;
export type ProductDetail = ProductEditDto & { id: number; code: string; createdAt: number; updatedAt?: number };

export const ProductCreateDto = Type.Object({ code: Type.String({ pattern: "^[A-Za-z0-9][A-Za-z0-9_-]*$", maxLength: 50 }), name: ProductEditDto.properties.name, type: ProductEditDto.properties.type }, { additionalProperties: false });
