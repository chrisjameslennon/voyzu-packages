import Type, { type Static } from "typebox";

export const FinanceItemDto = Type.Object({
  id: Type.Number(),
  sku: Type.String(),
  name: Type.String(),
  description: Type.String(),
  quantityTracked: Type.Boolean(),
  itemPostingCodeId: Type.Union([Type.Number(), Type.Null()]),
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
});

export type FinanceItemDto = Static<typeof FinanceItemDto>;

export const ItemPostingCodeUsageDto = Type.Object({
  itemPostingCodeId: Type.Number(),
  sku: Type.String(),
});

export type ItemPostingCodeUsageDto = Static<typeof ItemPostingCodeUsageDto>;
