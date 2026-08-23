import type { VoyzuEventContext } from "@voyzu/capability/events";

import { deleteFinanceCompanyForErpCompany } from "./modules/finance-companies/server/lib/finance-company.service";

type CompanyDeletedPayload = {
  id: number;
};

async function handleCompanyDeleted(
  company: CompanyDeletedPayload,
  context: VoyzuEventContext,
): Promise<void> {
  await deleteFinanceCompanyForErpCompany(company.id, context.transaction);
}

export const listeners = [
  {
    event: "@voyzu/erp-core.companies.companyDeleted",
    handler: handleCompanyDeleted,
  },
] as const;

export default listeners;
