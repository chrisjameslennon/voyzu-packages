import "server-only";

import { resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";
import { InventoryProcessingRulesList } from "../../client/index";
import { listFinanceInventoryProcessingRules } from "../lib/inventory-processing.service";

export async function InventoryProcessingRulesPage() {
  const scope = await resolveServerSettingsScope();
  return <InventoryProcessingRulesList rules={await listFinanceInventoryProcessingRules(scope.companyId)} />;
}
