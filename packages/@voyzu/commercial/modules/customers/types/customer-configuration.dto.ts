import Type, { type Static } from "typebox";
export type CustomerConfigurationKind = "categories" | "priceLists";
export const customerConfigurationMeta = {
  categories: { title: "Customer Categories", singular: "Customer Category", href: "/commercial/customers/customer-categories" },
  priceLists: { title: "Customer Price Lists", singular: "Customer Price List", href: "/commercial/customers/price-lists" },
} as const;
export const CustomerConfigurationInputDto = Type.Object({
  code: Type.String({ minLength: 1, maxLength: 50, pattern: "^[A-Za-z0-9][A-Za-z0-9_-]*$" }),
  name: Type.String({ maxLength: 100, pattern: "\\S" }), description: Type.String({ maxLength: 2000 }),
  direction: Type.Union([Type.Literal("increase"), Type.Literal("decrease")]),
  method: Type.Union([Type.Literal("percentage"), Type.Literal("amount")]),
  value: Type.Number({ minimum: 0 }),
}, { additionalProperties: false });
export type CustomerConfigurationInput = Static<typeof CustomerConfigurationInputDto>;
export type CustomerConfiguration = CustomerConfigurationInput & { id: number; status: "ACTIVE" | "INACTIVE"; createdAt: number; updatedAt?: number; count: number; usedBy: { id: number; code: string; name: string }[] };
