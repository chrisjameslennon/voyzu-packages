"use client";

import { OrganizationAuditPanel as AuditPanel } from "@voyzu-modules/all-modules/organization-audit/client";


import { DetailBackButton } from "@voyzu/ui-surface/client";
import { getStatusSemanticColor, StandardSettingsReadOnlyAlert, type DetailBackSource } from "@voyzu-modules/all-modules/common/client";
import { AssignTarget } from "@voyzu-modules/all-modules/common/financial-document-defaults/domain/operation-policy";
import type { BankCashAccountResponseDto } from "@voyzu-modules/types/modules/bank-cash-accounts";
import type { FinancialDocumentDefaultPatchRequestDto, FinancialDocumentDefaultResponseDto } from "@voyzu-modules/types/modules/financial-document-defaults";
import type { GlAccountResponseDto } from "@voyzu-modules/types/modules/gl-accounts";
import { useMemo, useState } from "react";
import { Badge, Breadcrumbs, Button, Input, SearchableSelect, Toast, ValidationAlert } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface FinancialDocumentDefaultDetailProps {
  financialDocumentDefault: FinancialDocumentDefaultResponseDto;
  glAccounts: GlAccountResponseDto[];
  bankCashAccounts: BankCashAccountResponseDto[];
  apiPath: string;
  from?: DetailBackSource;
  fromCode?: string;
  routePrefix?: string;
  readOnly?: boolean;
}

export function FinancialDocumentDefaultDetail({
  financialDocumentDefault,
  glAccounts,
  bankCashAccounts,
  apiPath,
  from,
  fromCode,
  routePrefix = "/organization",
  readOnly = false,
}: FinancialDocumentDefaultDetailProps) {
  const [glAccountId, setGlAccountId] = useState(financialDocumentDefault.glAccountId == null ? "" : String(financialDocumentDefault.glAccountId));
  const [bankCashControlAccountId, setBankCashControlAccountId] = useState(financialDocumentDefault.bankCashControlAccountId == null ? "" : String(financialDocumentDefault.bankCashControlAccountId));
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const glAccountOptions = useMemo(() => glAccounts
    .filter((account) => AssignTarget(
      {
        code: financialDocumentDefault.code,
        targetType: financialDocumentDefault.targetType,
        allowedAccountTypes: financialDocumentDefault.allowedAccountTypes,
      },
      { kind: "GENERAL_LEDGER", id: account.id, status: account.status, accountType: account.accountType },
    ).length === 0)
    .map((account) => ({ value: String(account.id), label: account.code })),
  [financialDocumentDefault, glAccounts]);
  const bankCashAccountOptions = useMemo(() => bankCashAccounts
    .filter((account) => AssignTarget(
      {
        code: financialDocumentDefault.code,
        targetType: financialDocumentDefault.targetType,
        allowedAccountTypes: financialDocumentDefault.allowedAccountTypes,
      },
      { kind: "BANK_CASH_ACCOUNT", id: account.id, status: account.status },
    ).length === 0)
    .map((account) => ({ value: String(account.id), label: account.code })),
  [bankCashAccounts, financialDocumentDefault]);

  const save = async () => {
    const targetId = financialDocumentDefault.targetType === "GENERAL_LEDGER" ? glAccountId : bankCashControlAccountId;
    if (!targetId) return;
    setServerError("");
    setSaving(true);
    try {
      const key = `${encodeURIComponent(financialDocumentDefault.documentCode)}~${encodeURIComponent(financialDocumentDefault.code)}`;
      const payload: FinancialDocumentDefaultPatchRequestDto = financialDocumentDefault.targetType === "GENERAL_LEDGER"
        ? { glAccountId: Number(targetId) }
        : { bankCashControlAccountId: Number(targetId) };
      const response = await fetch(`${apiPath}/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setServerError(body?.message ?? body?.error ?? "An unexpected error occurred");
        return;
      }
      setToastVisible(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className={`${layoutStyles.detailView} ${layoutStyles.detailViewWithStatusRail}`}>
      <header className={layoutStyles.detailHeader}>
        <div className={layoutStyles.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layoutStyles.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}>
              <span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>
                webhook
              </span>
            </div>
            <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>
              {financialDocumentDefault.name}
            </h1>
          </div>
        </div>
        <div className={layoutStyles.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={`${routePrefix}/financial-document-defaults`} from={from} fromCode={fromCode} />
            <Button
              variant="primary"
              icon="save"
              disabled={saving || readOnly || !(financialDocumentDefault.targetType === "GENERAL_LEDGER" ? glAccountId : bankCashControlAccountId)}
              onClick={() => { void save(); }}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <div className={layoutStyles.slotAlert}>
          {readOnly ? <StandardSettingsReadOnlyAlert /> : null}
          <ValidationAlert errors={serverError ? [serverError] : []} visible={!!serverError} onDismiss={() => setServerError("")} />
        </div>
      </header>

      <aside className={layoutStyles.statusSection}>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Status</label>
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(financialDocumentDefault.status)}>
              {financialDocumentDefault.status}
            </Badge>
          </div>
        </div>
        <AuditPanel
          id={`${financialDocumentDefault.documentCode}/${financialDocumentDefault.code}`}
          creationDate={financialDocumentDefault.audit.created.date}
          updatedDate={financialDocumentDefault.audit.updated.date}
          creationActorType={financialDocumentDefault.audit.created.actorType}
          creationUser={financialDocumentDefault.audit.created.user}
          updatedActorType={financialDocumentDefault.audit.updated.actorType}
          updatedUser={financialDocumentDefault.audit.updated.user}
          auditHref={`/organization/audit?entityType=financial_document_default&entityCode=${encodeURIComponent(`${financialDocumentDefault.documentCode}/${financialDocumentDefault.code}`)}`}
          mutationId={financialDocumentDefault.audit.updated.mutationId ?? financialDocumentDefault.audit.created.mutationId}
        />
      </aside>

      <main className={layoutStyles.mainSection}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Financial Document Default Details</h2>
          <div className={detailStyles.formGrid}>
            <label className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Document</span>
              <Input value={financialDocumentDefault.documentCode} disabled />
            </label>
            <label className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Code</span>
              <Input value={financialDocumentDefault.code} disabled />
            </label>
            <label className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Name</span>
              <Input value={financialDocumentDefault.name} disabled />
            </label>
            <label className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Target Type</span>
              <Input value={financialDocumentDefault.targetType} disabled />
            </label>
            <label className={detailStyles.fieldGroup}>
              <span className={`${typography.fieldLabel} ${detailStyles.inlineGroup}`}>
                Target Account
                {financialDocumentDefault.targetType === "GENERAL_LEDGER" ? (
                  <Badge variant="soft" size="x-small" color="neutral">
                    {financialDocumentDefault.allowedAccountTypes.join(" / ")}
                  </Badge>
                ) : null}
              </span>
              {financialDocumentDefault.targetType === "GENERAL_LEDGER" ? (
                <SearchableSelect
                  value={glAccountId}
                  onChange={setGlAccountId}
                  options={glAccountOptions}
                  placeholder="Select a GL account"
                  searchPlaceholder="Search GL accounts..."
                  dropdownWidth="auto"
                  disabled={readOnly}
                />
              ) : (
                <SearchableSelect
                  value={bankCashControlAccountId}
                  onChange={setBankCashControlAccountId}
                  options={bankCashAccountOptions}
                  placeholder="Select a bank / cash account"
                  searchPlaceholder="Search bank / cash accounts..."
                  dropdownWidth="auto"
                  disabled={readOnly}
                />
              )}
            </label>
            <label className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Override Scope</span>
              <Input value={financialDocumentDefault.overrideScope} disabled />
            </label>
          </div>
        </section>
      </main>

    </div>
    <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={`Financial document default ${financialDocumentDefault.code} saved`} />
    </>
  );
}
