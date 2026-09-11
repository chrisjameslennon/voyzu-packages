import { organizationFinanceCapability } from "./organization-finance";
import { organizationContextCapability } from "./organization-context";
import { inventoryFinanceCapability } from "./inventory-finance";
export const capabilityContracts = {
  "erp.inventory-finance": { functions: inventoryFinanceCapability },
  "erp.organization-finance": { functions: organizationFinanceCapability },
  "erp.organization-context": { functions: organizationContextCapability },
} as const;
