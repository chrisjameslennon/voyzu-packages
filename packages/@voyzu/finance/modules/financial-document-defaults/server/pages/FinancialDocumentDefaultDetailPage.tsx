import "server-only";

import { notFound } from "next/navigation";

import { decodeFinancialDocumentDefaultKey, getFinancialDocumentDefault } from "../index";
import { listBankCashAccounts } from "../../../bank-cash-accounts/server/index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { normalizeDetailBackSource } from "../../../common/server/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";
import { FinancialDocumentDefaultDetail } from "../../client/index";

export async function FinancialDocumentDefaultDetailPage({ code, surface }: { code?: string; surface?: { searchParams?: Record<string, string> } }) {
  if (!code) notFound();
  const key = decodeFinancialDocumentDefaultKey(code);
  if (!key) notFound();
  const scope = await resolveServerSettingsScope();
  const [financialDocumentDefault, glAccounts, bankCashAccounts, settingsUiState, companyApiContext] = await Promise.all([
    getFinancialDocumentDefault(key.documentCode, key.code, scope.companyId),
    listGlAccounts(scope.companyId),
    listBankCashAccounts(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
    resolveServerCompanyApiContext(),
  ]);
  if (!financialDocumentDefault) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <FinancialDocumentDefaultDetail
      financialDocumentDefault={financialDocumentDefault}
      glAccounts={glAccounts}
      bankCashAccounts={bankCashAccounts}
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/financial-document-defaults`}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
      routePrefix="/finance/integration"
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
