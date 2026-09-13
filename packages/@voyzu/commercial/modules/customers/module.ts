import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";
import { apiDefinitions } from "./api.routes";
import { CustomerPriceListSchema } from "./contracts/customer-price-list.definition";
import { CustomerPriceListItemSchema } from "./contracts/customer-price-list-item.definition";

const defines = {
  "@voyzu/commercial/customer-price-lists": { dataDefinition: CustomerPriceListSchema },
  "@voyzu/commercial/customer-price-list-items": { dataDefinition: CustomerPriceListItemSchema },
} as const;

const implementations = {
  "@core/customer/account": () => import("./server/lib/customer-account.implementation")
    .then(module => module.customerAccountMethods),
  "@voyzu/commercial/customer-price-lists": () => import("./server/lib/customer-price-list.implementation")
    .then(module => module.customerPriceListMethods),
  "@voyzu/commercial/customer-price-list-items": () => import("./server/lib/customer-price-list-item.implementation")
    .then(module => module.customerPriceListItemMethods),
} as const;

// Declaration shape only; composition/runtime support is a separate step.
export const customersModule = {
  pageRoutes,
  apiDefinitions,
  defines,
  implements: implementations,
} as const satisfies VoyzuPackageModuleDefinition & {
  defines: typeof defines;
  implements: typeof implementations;
};
export default customersModule;
