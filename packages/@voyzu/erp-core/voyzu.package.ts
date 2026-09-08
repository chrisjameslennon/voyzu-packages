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
import { masterDataCompositions } from "./contracts/master-data/composition-map";
import { capabilityContracts } from "./contracts/capability/capability-map";

export const erpCorePackage = {
   contracts: {
    defines: {
      masterData: masterDataContracts,
      compositions: masterDataCompositions,
      capabilities: capabilityContracts,
    },
    implements: {
      capabilities: {
        "platform.organization-directory": {
          load: () => import("./modules/organizations/server/lib/organization-directory.provider"),
        },
        "erp.organization-context": {
          load: () => import("./modules/organization-switcher/server/organization-context.provider"),
        },
      },
      masterData: {
        "erp.organization": {
          get: (id: number) => import("./modules/organizations/server/lib/organization.service").then((module) => module.getOrganizationMasterData(id)),
          list: () => import("./modules/organizations/server/lib/organization.service").then((module) => module.listOrganizations()),
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
