import { CustomerPriceListSchema, CustomerPriceListGetRequestDto, CustomerPriceListGetResponseDto, CustomerPriceListUpdateRequestDto } from "../types/customer-price-list.internal-api.dto";
export { CustomerPriceListSchema } from "../types/customer-price-list.internal-api.dto";
import type { Static } from "typebox";
import { type CustomerPriceListItem } from "./customer-price-list-item.definition";

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
      input: CustomerPriceListGetRequestDto,
      output: CustomerPriceListGetResponseDto,
    },
    update: {
      input: CustomerPriceListUpdateRequestDto,
      output: CustomerPriceListSchema,
    },
  },
} as const;

/** The complete schema definition, including data and method contracts. */
export type CustomerPriceListContract = typeof CustomerPriceListDefinition;
