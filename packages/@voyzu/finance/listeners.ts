import type { VoyzuEventContext } from "@voyzu/capability/events";

import { deleteFinanceCompanyForErpOrganization } from "./modules/finance-companies/server/lib/finance-company.service";

type OrganizationDeletedPayload = {
  id: number;
};

async function handleOrganizationDeleted(
  organization: OrganizationDeletedPayload,
  context: VoyzuEventContext,
): Promise<void> {
  await deleteFinanceCompanyForErpOrganization(organization.id, context.transaction);
}

export const listeners = [
  {
    event: "@voyzu/erp-core.organizations.organizationDeleted",
    handler: handleOrganizationDeleted,
  },
] as const;

export default listeners;
