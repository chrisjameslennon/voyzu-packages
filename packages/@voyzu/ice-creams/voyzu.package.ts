import { httpApiRouting, httpApiDocumentation } from "./http-api.contracts";
import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { install } from "./install/manifest";
import { iceCreamsModule } from "./modules/ice-creams/module";
import { iceCreamReportsModule } from "./modules/reports/module";
import { install as installSampleData } from "./scripts/sample-data/install";
import { uninstall } from "./uninstall/manifest";

/**
 * Golden Voyzu package manifest.
 *
 **/
export const iceCreamsPackage = {
  contracts: { httpApiRouting, httpApiDocumentation },
  modules: [
    iceCreamsModule,
    iceCreamReportsModule,
  ],
  install,
  uninstall,
  scripts: {
    sampleData: installSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default iceCreamsPackage;
