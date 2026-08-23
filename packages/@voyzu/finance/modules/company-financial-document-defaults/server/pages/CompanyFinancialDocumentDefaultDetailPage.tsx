import "server-only";

import { notFound } from "next/navigation";

import { decodeFinancialDocumentDefaultKey, getFinancialDocumentDefault } from "@voyzu/finance/common/financial-document-defaults/server";
import { listBankCashAccounts } from "@voyzu/finance/common/bank-cash-accounts/server";
import { listGlAccounts } from "@voyzu/finance/common/gl-accounts/server";
import { normalizeDetailBackSource } from "@voyzu/finance/common/server";
import { getCompanySettingsUiState } from "@voyzu/finance/common/server";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "@voyzu/finance/common/server";
import { CompanyFinancialDocumentDefaultDetail } from "../../client";

export async function CompanyFinancialDocumentDefaultDetailPage({ code, surface }: { code?: string; surface?: { searchParams?: Record<string, string> } }) {
  if (!code) notFound();
  const key = decodeFinancialDocumentDefaultKey(code);
  if (!key) notFound();
  const scope = await resolveServerSettingsScope("selected");
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
    <CompanyFinancialDocumentDefaultDetail
      financialDocumentDefault={financialDocumentDefault}
      glAccounts={glAccounts}
      bankCashAccounts={bankCashAccounts}
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/financial-document-defaults`}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
      routePrefix="/finance/integration"
      readOnly={settingsUiState.readOnly}
      showOrganizationBaseSettings={settingsUiState.usesOrganizationStandardSettings}
      showArchived={settingsUiState.isArchived}
    />
  );
}
