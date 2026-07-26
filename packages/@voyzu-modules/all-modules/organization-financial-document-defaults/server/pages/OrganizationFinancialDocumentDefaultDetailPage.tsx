import "server-only";

import { notFound } from "next/navigation";

import { decodeFinancialDocumentDefaultKey, getFinancialDocumentDefault } from "@voyzu-modules/all-modules/common/financial-document-defaults/server";
import { listBankCashAccounts } from "@voyzu-modules/all-modules/common/bank-cash-accounts/server";
import { listGlAccounts } from "@voyzu-modules/all-modules/common/gl-accounts/server";
import { normalizeDetailBackSource } from "@voyzu-modules/all-modules/common/server";
import { resolveServerSettingsScope } from "@voyzu-modules/all-modules/common/server";
import { OrganizationFinancialDocumentDefaultDetail } from "../../client";

export async function OrganizationFinancialDocumentDefaultDetailPage({ code, surface }: { code?: string; surface?: { searchParams?: Record<string, string> } }) {
  if (!code) notFound();
  const key = decodeFinancialDocumentDefaultKey(code);
  if (!key) notFound();
  const scope = await resolveServerSettingsScope("template");
  const [financialDocumentDefault, glAccounts, bankCashAccounts] = await Promise.all([
    getFinancialDocumentDefault(key.documentCode, key.code, scope.companyId),
    listGlAccounts(scope.companyId),
    listBankCashAccounts(scope.companyId),
  ]);
  if (!financialDocumentDefault) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <OrganizationFinancialDocumentDefaultDetail
      financialDocumentDefault={financialDocumentDefault}
      glAccounts={glAccounts}
      bankCashAccounts={bankCashAccounts}
      apiPath="/api/organization/financial-document-defaults"
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
      routePrefix="/organization"
    />
  );
}
