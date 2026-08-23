import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { companiesModule } from "./modules/companies/module";
import { companySwitcherModule } from "./modules/company-switcher/module";
import { companyAccessModule } from "./modules/company-access/module";
import { organizationReportsModule } from "./modules/organization-reports/module";

export const organizationModules = [
  companiesModule,
  companyAccessModule,
  organizationReportsModule,
] as const;

export const erpCorePackage = {
  modules: [
    companiesModule,
    companyAccessModule,
    organizationReportsModule,
    companySwitcherModule,
  ],
  install: {
    sql: [
      "./install/db/objects/table.company.create.sql",
      "./install/db/objects/table.company-user-access.create.sql",
      "./install/db/objects/audit-company-reference.attach.sql",
      "./install/db/objects/audit-triggers.attach.sql"
    ],
    seedSql: [
      "./install/db/seed/home-page.seed.sql"
    ]
  }
} as const satisfies VoyzuPackageDefinition;

export default erpCorePackage;
