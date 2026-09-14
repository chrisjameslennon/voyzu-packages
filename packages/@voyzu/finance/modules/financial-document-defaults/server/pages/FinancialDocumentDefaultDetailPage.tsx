import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { decodeFinancialDocumentDefaultKey, getFinancialDocumentDefault } from "../index";
import { listBankCashAccounts } from "../../../bank-cash-accounts/server/index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { normalizeDetailBackSource } from "../../../common/server/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyHttpApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";
import { FinancialDocumentDefaultDetail } from "../../client/index";

export async function FinancialDocumentDefaultDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const key = decodeFinancialDocumentDefaultKey(code);
  if (!key) notFound();
  const scope = await resolveServerSettingsScope();
  const [financialDocumentDefault, glAccounts, bankCashAccounts, settingsUiState, companyHttpApiContext] = await Promise.all([
    getFinancialDocumentDefault(key.documentCode, key.code, scope.companyId),
    listGlAccounts(scope.companyId),
    listBankCashAccounts(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
    resolveServerCompanyHttpApiContext(),
  ]);
  if (!financialDocumentDefault) notFound();
  const searchParams = pageStringParameters(context.queryParams);
  return (
    <FinancialDocumentDefaultDetail
      financialDocumentDefault={financialDocumentDefault}
      glAccounts={glAccounts}
      bankCashAccounts={bankCashAccounts}
      httpApiPath={`/api/finance/${encodeURIComponent(companyHttpApiContext.companyCode)}/financial-document-defaults`}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
      routePrefix="/finance/integration"
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
