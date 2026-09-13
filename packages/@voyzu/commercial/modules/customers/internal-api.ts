import Type from "typebox";
import { defineInternalApiMethod, type InternalApiResource } from "@voyzu/types/internal-api";
import { CustomerPriceListItemSchema } from "../../business-objects/customer-price-list-item";

export const internalApi = [{
  resource: "@voyzu/commercial/customer-price-list-items",
  methods: {
    get: defineInternalApiMethod({
      input: Type.Object({ id: Type.Number() }, { additionalProperties: false }),
      output: Type.Union([CustomerPriceListItemSchema, Type.Null()]),
      loadHandler: async () => (await import("./server/lib/customer-price-list-item.mock")).get,
    }),
    update: defineInternalApiMethod({
      input: Type.Object({ id: Type.Number(), price: Type.Number() }, { additionalProperties: false }),
      output: CustomerPriceListItemSchema,
      loadHandler: async () => (await import("./server/lib/customer-price-list-item.mock")).update,
    }),
  },
}] as const satisfies readonly InternalApiResource[];
