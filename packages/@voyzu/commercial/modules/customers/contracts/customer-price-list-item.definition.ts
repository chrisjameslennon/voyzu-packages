import { CustomerPriceListItemSchema, CustomerPriceListItemGetRequestDto, CustomerPriceListItemGetResponseDto, CustomerPriceListItemUpdateRequestDto } from "../types/customer-price-list-item.internal-api.dto";
export { CustomerPriceListItemSchema } from "../types/customer-price-list-item.internal-api.dto";
import type { Static } from "typebox";

export interface CustomerPriceListItem
  extends Static<typeof CustomerPriceListItemSchema> {}

export interface CustomerPriceListItemMethods {
  get(parameters: { id: number }): Promise<CustomerPriceListItem | null>;
  update(parameters: { id: number; price: number }): Promise<CustomerPriceListItem>;
}

export const CustomerPriceListItemDefinition = {
  dataDefinition: CustomerPriceListItemSchema,
  methods: {
    get: {
      input: CustomerPriceListItemGetRequestDto,
      output: CustomerPriceListItemGetResponseDto,
    },
    update: {
      input: CustomerPriceListItemUpdateRequestDto,
      output: CustomerPriceListItemSchema,
    },
  },
} as const;

/** The complete schema definition, including data and method contracts. */
export type CustomerPriceListItemContract = typeof CustomerPriceListItemDefinition;
