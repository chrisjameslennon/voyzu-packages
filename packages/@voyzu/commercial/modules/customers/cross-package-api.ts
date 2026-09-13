import Type from "typebox";
import { defineCrossPackageApiMethod, type CrossPackageApiResource } from "@voyzu/types/cross-package-api";
import { CustomerPriceListItemSchema } from "../../business-objects/customer-price-list-item";

export const crossPackageApi = [{
  resource: "@voyzu/commercial/customer-price-list-items",
  methods: {
    get: defineCrossPackageApiMethod({
      input: Type.Object({ id: Type.Number() }, { additionalProperties: false }),
      output: Type.Union([CustomerPriceListItemSchema, Type.Null()]),
      loadHandler: async () => (await import("./server/lib/customer-price-list-item.mock")).get,
    }),
    update: defineCrossPackageApiMethod({
      input: Type.Object({ id: Type.Number(), price: Type.Number() }, { additionalProperties: false }),
      output: CustomerPriceListItemSchema,
      loadHandler: async () => (await import("./server/lib/customer-price-list-item.mock")).update,
    }),
  },
}] as const satisfies readonly CrossPackageApiResource[];
