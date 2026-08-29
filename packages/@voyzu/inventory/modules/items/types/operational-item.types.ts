import Type, { type Static } from "typebox";

export const OperationalItemDto = Type.Object({
  id: Type.Number(),
  sku: Type.String(),
  name: Type.String(),
  description: Type.String(),
  quantityTracked: Type.Boolean(),
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
});

export type OperationalItemDto = Static<typeof OperationalItemDto>;
