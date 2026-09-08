import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";

const Id = Type.Integer({ minimum: 1 });
const Status = Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]);
const NullableText = Type.Union([Type.String(), Type.Null()]);

export const inventoryCatalogCapability = {
  listItems: {
    input: StrictObject({ organizationId: Id }),
    output: StrictObject({ items: Type.Array(StrictObject({
      id: Id, sku: Type.String(), name: Type.String(), category: NullableText,
      unit: NullableText, quantityTracked: Type.Boolean(), status: Status,
    })) }),
  },
  getOperationalItems: {
    input: StrictObject({ organizationId: Id, skus: Type.Array(Type.String()) }),
    output: StrictObject({ items: Type.Array(StrictObject({
      id: Id, sku: Type.String(), name: Type.String(), description: Type.String(),
      quantityTracked: Type.Boolean(), status: Status,
    })) }),
  },
} as const;
