import type { VoyzuPackageDefinition } from "@voyzu/types/framework";
import { customersModule } from "./modules/customers/module";
import { suppliersModule } from "./modules/suppliers/module";
import { salesModule } from "./modules/sales/module";
import { purchasingModule } from "./modules/purchasing/module";
import { productsModule } from "./modules/products/module";
import { settingsModule } from "./modules/settings/module";

export const commercialPackage = {
  contracts: {
    defines: { ...customersModule.defines },
    implements: { ...customersModule.implements },
  },
  modules: [customersModule, suppliersModule, salesModule, purchasingModule, productsModule, settingsModule],
} as const satisfies Omit<VoyzuPackageDefinition, "contracts"> & {
  contracts: {
    defines: typeof customersModule.defines;
    implements: typeof customersModule.implements;
  };
};

export default commercialPackage;
