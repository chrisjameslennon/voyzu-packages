import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { organizationsModule } from "./modules/organizations/module";
import { organizationSwitcherModule } from "./modules/organization-switcher/module";
import { organizationAccessModule } from "./modules/organization-access/module";
import { organizationReportsModule } from "./modules/organization-reports/module";
import { sampleData } from "./scripts/sample-data";

export const organizationModules = [
  organizationsModule,
  organizationAccessModule,
  organizationReportsModule,
] as const;


import { masterDataContracts } from "./contracts/master-data/master-data-map";
import { capabilityContracts } from "./contracts/capability/capability-map";

export const erpCorePackage = {
   contracts: {
    defines: {
      masterData: masterDataContracts,
      capabilities: capabilityContracts,
    },
    implements: {
      masterData: {
        "erp.organization": {
          get: (id: number) => import("./modules/organizations/server/lib/organization.service").then((module) => module.getOrganizationMasterData(id)),
        },
      },
    },
  },
  modules: [
    organizationsModule,
    organizationAccessModule,
    organizationReportsModule,
    organizationSwitcherModule,
  ],
  install: {
    sql: [
      "./install/db/objects/table.organization.create.sql",
      "./install/db/objects/table.organization-user-access.create.sql",
      "./install/db/objects/table.document-link.create.sql",
      "./install/db/objects/audit-organization-reference.attach.sql",
      "./install/db/objects/audit-triggers.attach.sql"
    ],
    seedSql: [
      "./install/db/seed/home-page.seed.sql"
    ]
  },
  scripts: {
    sampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default erpCorePackage;
