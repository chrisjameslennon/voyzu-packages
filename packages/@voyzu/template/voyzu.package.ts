import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as reportsPageRoutes } from "./modules/reports/pages.routes";
import { pageRoutes as templatePageRoutes } from "./modules/template/pages.routes";
import { httpApiRouting, httpApiDocumentation } from "./http-api.contracts";
import type { VoyzuPackageDefinition } from "@voyzu/types/framework";
import { templateModule } from "./modules/template/module";
import { templateReportsModule } from "./modules/reports/module";
import { install as installSampleData } from "./scripts/sample-data/install";
import { templatesUninstall } from "./uninstall/manifest";

export const templatePackage = {
  contracts: {
    pageRouting: {
      roots: ["/template"],
      routes: mergePageRoutes(
        reportsPageRoutes,
        templatePageRoutes,
      ),
    }, httpApiRouting, httpApiDocumentation },
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
