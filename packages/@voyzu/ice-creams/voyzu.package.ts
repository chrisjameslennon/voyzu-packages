import type { VoyzuPackageDefinition } from "@voyzu/types/framework";
import { iceCreamAuditModule } from "./modules/audit/module";
import { iceCreamsModule } from "./modules/ice-creams/module";
import { iceCreamReportsModule } from "./modules/reports/module";
import { install as installSampleData } from "./scripts/sample-data/install";
import { uninstall } from "./scripts/uninstall/uninstall";

/**
 * Golden Voyzu package manifest.
 *
 **/
export const iceCreamsPackage = {
  dependencies: [],
  modules: [
    iceCreamsModule,
    iceCreamReportsModule,
    iceCreamAuditModule,
  ],
  install: {
    sql: [
      "./install/db/sql/ice-cream-flavor.sql",
      "./install/db/sql/ice-cream.sql",
    ],
    seedSql: [
      "./install/db/seed/ice-cream-flavor.seed.sql",
    ],
  },
  scripts: {
    sampleData: installSampleData,
    uninstall,
  },
} as const satisfies VoyzuPackageDefinition;

export default iceCreamsPackage;
