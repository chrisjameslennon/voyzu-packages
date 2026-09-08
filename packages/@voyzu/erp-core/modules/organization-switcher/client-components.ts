import type { VoyzuClientComponentDefinition } from "@voyzu/ui-surface/types";

export const clientComponents = {
  organizationSwitcher: {
    id: "erp.organization-switcher",
    loadComponent: async () => (await import("./client/OrganizationSwitcher")).OrganizationSwitcher,
  },
} as const satisfies Record<string, VoyzuClientComponentDefinition>;
