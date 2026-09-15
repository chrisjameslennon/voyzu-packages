import Type from "typebox";

export const ProductConfigurationRowDto = Type.Object({
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
