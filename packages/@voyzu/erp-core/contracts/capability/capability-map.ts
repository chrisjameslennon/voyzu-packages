import { organizationFinanceCapability } from "./organization-finance";
import { organizationContextCapability } from "./organization-context";
import { inventoryFinanceCapability } from "./inventory-finance";
import { inventoryCatalogCapability } from "./inventory-catalog";
import { inventoryActivityCapability } from "./inventory-activity";
export const capabilityContracts = {
  "erp.inventory-catalog": inventoryCatalogCapability,
  "erp.inventory-activity": inventoryActivityCapability,
  "erp.inventory-finance": inventoryFinanceCapability,
  "erp.organization-finance": organizationFinanceCapability,
  "erp.organization-context": organizationContextCapability,
} as const;
