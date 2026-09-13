import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";
import { apiDefinitions } from "./api.routes";
import { CustomerPriceListDefinition } from "./contracts/customer-price-list.definition";
import { CustomerPriceListItemDefinition } from "./contracts/customer-price-list-item.definition";

const defines = {
  "@voyzu/commercial/customer-price-lists": CustomerPriceListDefinition,
  "@voyzu/commercial/customer-price-list-items": CustomerPriceListItemDefinition,
} as const;

const implementations = {
  "@core/customer/account": () => import("./server/lib/customer-account.implementation")
    .then(module => module.customerAccountMethods),
  "@voyzu/commercial/customer-price-lists": () => import("./server/lib/customer-price-list.implementation")
    .then(module => module.customerPriceListMethods),
  "@voyzu/commercial/customer-price-list-items": () => import("./server/lib/customer-price-list-item.implementation")
    .then(module => module.customerPriceListItemMethods),
} as const;

export const customersModule = {
  pageRoutes,
  apiDefinitions,
  defines,
  implements: implementations,
} as const satisfies VoyzuPackageModuleDefinition;
export default customersModule;
