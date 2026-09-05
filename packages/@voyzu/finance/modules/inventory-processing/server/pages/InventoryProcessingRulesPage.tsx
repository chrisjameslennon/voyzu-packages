import "server-only";

import { resolveServerSettingsScope } from "../../../common/server/settings-scope";
import { InventoryProcessingRulesList } from "../../client";
import { listFinanceInventoryProcessingRules } from "../lib/inventory-processing.service";

export async function InventoryProcessingRulesPage() {
  const scope = await resolveServerSettingsScope();
  return <InventoryProcessingRulesList rules={await listFinanceInventoryProcessingRules(scope.companyId)} />;
}
