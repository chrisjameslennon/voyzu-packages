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
  id: "voyzu.ice-creams",
  name: "Ice Creams",
  version: "0.1.0",
  description: "A best-practice, self-contained ice-cream management package.",
  dependencies: ["@voyzu/audit"],
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
