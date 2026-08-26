import type { VoyzuPackageDefinition } from "@voyzu/types/framework";
import { templateModule } from "./modules/template/module";
import { templateReportsModule } from "./modules/reports/module";
import { install as installSampleData } from "./scripts/sample-data/install";
import { templatesUninstall } from "./uninstall/manifest";

export const templatePackage = {
  modules: [
    templateModule,
    templateReportsModule,
  ],
  install: {
    sql: ["./install/db/sql/template.sql"],
  },
  uninstall: templatesUninstall,
  scripts: {
    sampleData: installSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default templatePackage;
