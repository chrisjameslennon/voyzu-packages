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


import { semanticDataContracts } from "./contracts/master-data/master-data-map";
import { semanticData } from "@voyzu/capability/contracts";
import { capabilityContracts } from "./contracts/capability/capability-map";

export const erpCorePackage = {
  contracts: {
    semanticDataDefinition: {
      defines: semanticDataContracts,
      implements: {
        organization: {
          get: (id: number) => import("./modules/organizations/server/lib/organization.service").then(m => m.getOrganizationMasterData(id)),
          queries: { all: (_input: Record<string, never>) => import("./modules/organizations/server/lib/organization.service").then(m => m.listOrganizations()) },
        },
        organizationDirectory: {
          get: (id: number) => import("./modules/organizations/server/lib/organization-directory.provider").then(async m => (await m.list()).organizations.find(o => o.id === id) ?? null),
          queries: { all: (_input: Record<string, never>) => import("./modules/organizations/server/lib/organization-directory.provider").then(async m => (await m.list()).organizations) },
        },
        "country.withFinance": { get: (code: string): Promise<any> => semanticData.compose("country.withFinance", code) },
        "organization.withFinance": { get: (id: number): Promise<any> => semanticData.compose("organization.withFinance", id) },
      },
    },
    semanticCapabilityDefinition: {
      defines: capabilityContracts,
      implements: {
        "erp.organization-context": {
          getSavedOrganizationId: (input: Record<string, never>) => import("./modules/organization-switcher/server/organization-context.provider").then(m => m.getSavedOrganizationId(input)),
          getAvailableOrganizations: (input: Record<string, never>) => import("./modules/organization-switcher/server/organization-context.provider").then(m => m.getAvailableOrganizations(input)),
          getActiveOrganization: (input: Record<string, never>) => import("./modules/organization-switcher/server/organization-context.provider").then(m => m.getActiveOrganization(input)),
          setActiveOrganization: (input: { organizationId: number }) => import("./modules/organization-switcher/server/organization-context.provider").then(m => m.setActiveOrganization(input)),
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
