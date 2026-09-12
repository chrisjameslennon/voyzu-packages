import "server-only";

import { notFound } from "next/navigation";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../finance-companies/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../finance-companies/server/lib/settings-scope";
import { InventoryProcessingRuleDetail } from "../../client/index";
import { getFinanceInventoryProcessingRule } from "../lib/inventory-processing.service";

export async function InventoryProcessingRuleDetailPage({ id }: { id?: string }) {
  const ruleId = Number(id);
  if (!Number.isInteger(ruleId)) notFound();
  const [scope, apiContext] = await Promise.all([resolveServerSettingsScope(), resolveServerCompanyApiContext()]);
  const [rule, glAccounts, settingsState] = await Promise.all([getFinanceInventoryProcessingRule(scope.companyId, ruleId), listGlAccounts(scope.companyId), getCompanySettingsUiState(scope.companyId)]);
  if (!rule) notFound();
  return <InventoryProcessingRuleDetail rule={rule} glAccounts={glAccounts.filter((account) => account.status === "ACTIVE" || account.id === rule.offsetGlAccountId)} apiPath={`/api/finance/${encodeURIComponent(apiContext.companyCode)}/inventory-processing/rules/${rule.id}`} readOnly={settingsState.readOnly} />;
}
