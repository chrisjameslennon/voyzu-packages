import Type, { type Static } from "typebox";
import { CustomerPriceListItemSchema, type CustomerPriceListItem } from "./customer-price-list-item.definition";

export const CustomerPriceListSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    items: Type.Array(CustomerPriceListItemSchema),
  },
  { additionalProperties: false },
);

export interface CustomerPriceList
  extends Static<typeof CustomerPriceListSchema> {}

export interface CustomerPriceListMethods {
  get(parameters: { id: number }): Promise<CustomerPriceList | null>;
  update(parameters: {
    id: number;
    changes: { name?: string; items?: CustomerPriceListItem[] };
  }): Promise<CustomerPriceList>;
}

export const CustomerPriceListDefinition = {
  dataDefinition: CustomerPriceListSchema,
  methods: {
    get: {
      input: Type.Object({ id: Type.Number() }, { additionalProperties: false }),
      output: Type.Union([CustomerPriceListSchema, Type.Null()]),
    },
    update: {
      input: Type.Object({
        id: Type.Number(),
        changes: Type.Object({
          name: Type.Optional(Type.String()),
          items: Type.Optional(Type.Array(CustomerPriceListItemSchema)),
        }, { additionalProperties: false }),
      }, { additionalProperties: false }),
      output: CustomerPriceListSchema,
    },
  },
} as const;
