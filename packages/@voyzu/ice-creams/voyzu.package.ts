import type { VoyzuPackageDefinition } from "@voyzu/types/framework";
import { iceCreamAuditModule } from "./modules/audit/module";
import { iceCreamsModule } from "./modules/ice-creams/module";
import { iceCreamReportsModule } from "./modules/reports/module";
import { install as installSampleData } from "./scripts/sample-data/install";
import { iceCreamsUninstall } from "./uninstall/manifest";

/**
 * Golden Voyzu package manifest.
 *
 **/
export const iceCreamsPackage = {
  modules: [
    iceCreamAuditModule,
    iceCreamsModule,
    iceCreamReportsModule,
  ],
  install: {
    sql: [
      "./install/db/sql/ice-cream-flavor.sql",
      "./install/db/sql/ice-cream.sql",
    ],
    seedSql: [
      "./install/db/seed/ice-cream-flavor.seed.sql",
      "./install/db/seed/ice-cream.seed.sql",
    ],
  },
  uninstall: iceCreamsUninstall,
  scripts: {
    sampleData: installSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default iceCreamsPackage;
