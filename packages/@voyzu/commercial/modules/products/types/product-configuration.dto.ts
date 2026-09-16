import Type from "typebox";

export const ProductConfigurationRowDto = Type.Object({
  createdAt: Type.Optional(Type.Number()),
  updatedAt: Type.Optional(Type.Number()),
  id: Type.Integer({ minimum: 1 }),
  code: Type.String(),
  name: Type.String(),
  description: Type.String(),
  values: Type.Array(Type.String()),
  count: Type.Integer({ minimum: 0 }),
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
}, { additionalProperties: false });
export type ProductConfigurationRowDto = Type.Static<typeof ProductConfigurationRowDto>;
export type ProductConfigurationKind = "lists" | "categories" | "optionLists";

export const ProductConfigurationInputDto = Type.Object({ code: Type.String({ pattern: "^[A-Za-z0-9][A-Za-z0-9_-]*$", maxLength: 50 }), name: Type.String({ pattern: "\\S", maxLength: 100 }), description: Type.String({ maxLength: 2000 }), values: Type.Array(Type.String({ pattern: "\\S", maxLength: 100 }), { maxItems: 100, uniqueItems: true }) }, { additionalProperties: false });
export type ProductConfigurationInput = Type.Static<typeof ProductConfigurationInputDto>;
export const configurationMeta = {
 lists: { title: "Manage Lists", singular: "List", href: "/commercial/products/manage-lists" },
 categories: { title: "Product Categories", singular: "Product Category", href: "/commercial/products/product-categories" },
 optionLists: { title: "Product Option Lists", singular: "Product Option List", href: "/commercial/products/option-lists" },
} as const;

export type ProductConfigurationDetail = ProductConfigurationRowDto & { usedBy: { id: number; code: string; name: string }[]; valueUsage: Record<string, number> };
