import { organizationFinanceCapability } from "./organization-finance";
import { organizationContextCapability } from "./organization-context";
export const capabilityContracts = {
  "erp.organization-finance": organizationFinanceCapability,
  "erp.organization-context": organizationContextCapability,
} as const;
