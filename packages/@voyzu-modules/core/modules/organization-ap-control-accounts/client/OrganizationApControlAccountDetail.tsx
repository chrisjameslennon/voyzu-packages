"use client";

import { OrganizationAuditPanel as AuditPanel } from "@voyzu-modules/core/organization-audit/client";


import { DetailBackButton } from "@voyzu/ui-surface/client";
import { getHasPostingsColor } from "@voyzu-modules/core/common/client";
import { UpdateGLAccount } from "@voyzu-modules/core/common/control-accounts/domain/operation-policy";
import type { ControlAccountResponseDto } from "@voyzu-modules/core/types/modules/control-accounts";
import type { GlAccountResponseDto } from "@voyzu-modules/core/types/modules/gl-accounts";
import { Badge, Breadcrumbs, Button, Toast, ValidationAlert } from "@voyzu/ui-components";
import { useState } from "react";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { OrganizationApControlAccountDetailsForm } from "./OrganizationApControlAccountDetailsForm";

interface OrganizationApControlAccountDetailProps {
  account: ControlAccountResponseDto;
  glAccounts: GlAccountResponseDto[];
  apiPath: string;
  listPath?: string;
  auditPath?: string;
}

export function OrganizationApControlAccountDetail({
  account,
  glAccounts,
  apiPath,
  listPath = "/organization/control-accounts/ap",
  auditPath = "/organization/audit",
}: OrganizationApControlAccountDetailProps) {
  const [currentAccount, setCurrentAccount] = useState(account);
  const [glAccountId, setGlAccountId] = useState(String(account.glAccountId));
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const selectedGlAccount = glAccounts.find((glAccount) => String(glAccount.id) === glAccountId);
  const currentPolicyInput = {
    code: currentAccount.code,
    glAccountId: currentAccount.glAccountId,
    hasPostings: currentAccount.hasPostings,
  };
  const requirements = { requiredAccountType: "LIABILITY" as const };
  const blockers = selectedGlAccount
    ? UpdateGLAccount(currentPolicyInput, {
      id: selectedGlAccount.id,
      status: selectedGlAccount.status,
      accountType: selectedGlAccount.accountType,
    }, requirements)
    : [];
  const selectableGlAccounts = glAccounts.filter((glAccount) => (
    glAccount.id === currentAccount.glAccountId
    || UpdateGLAccount(currentPolicyInput, {
      id: glAccount.id,
      status: glAccount.status,
      accountType: glAccount.accountType,
    }, requirements).length === 0
  ));
  const hasChange = selectedGlAccount != null && selectedGlAccount.id !== currentAccount.glAccountId;
  const canSelectAlternative = selectableGlAccounts.some((glAccount) => glAccount.id !== currentAccount.glAccountId);

  const save = async () => {
    if (!hasChange || blockers.length > 0 || saving) return;
    setServerError("");
    setSaving(true);
    try {
      const response = await fetch(`${apiPath}/${encodeURIComponent(currentAccount.code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ glAccountId: Number(glAccountId) }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        setServerError(body?.message ?? "An unexpected error occurred");
        return;
      }
      setCurrentAccount(await response.json() as ControlAccountResponseDto);
      setToastVisible(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${layoutStyles.detailView} ${layoutStyles.detailViewWithStatusRail}`}>
      <header className={layoutStyles.detailHeader}>
        <div className={layoutStyles.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layoutStyles.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}>
              <span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>account_tree</span>
            </div>
            <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>{currentAccount.name}</h1>
          </div>
        </div>
        <div className={layoutStyles.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={listPath} />
            <Button variant="primary" icon="save" disabled={saving || !hasChange || blockers.length > 0} onClick={() => { void save(); }}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <div className={layoutStyles.slotAlert}>
          <ValidationAlert errors={serverError ? [serverError] : []} visible={!!serverError} onDismiss={() => setServerError("")} />
        </div>
      </header>

      <aside className={layoutStyles.statusSection}>
        <div className={detailStyles.card}>
          {currentAccount.hasPostings ? (
            <div className={detailStyles.fieldGroup}>
              <Badge variant="soft" size="medium" customColors={getHasPostingsColor(currentAccount.hasPostings)}>
                HAS POSTINGS
              </Badge>
            </div>
          ) : null}
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Companies with postings</label>
            <p className={typography.bodyText}>{currentAccount.companiesWithPostings.length > 0 ? currentAccount.companiesWithPostings.join(", ") : "None"}</p>
          </div>
        </div>
        <AuditPanel
          id={currentAccount.code}
          creationDate={currentAccount.audit.created.date}
          updatedDate={currentAccount.audit.updated.date}
          creationActorType={currentAccount.audit.created.actorType}
          creationUser={currentAccount.audit.created.user}
          updatedActorType={currentAccount.audit.updated.actorType}
          updatedUser={currentAccount.audit.updated.user}
          auditHref={`${auditPath}?entityType=control_account&entityCode=${encodeURIComponent(currentAccount.code)}`}
          mutationId={currentAccount.audit.updated.mutationId ?? currentAccount.audit.created.mutationId}
        />
      </aside>

      <main className={layoutStyles.mainSection}>
        <OrganizationApControlAccountDetailsForm
          account={currentAccount}
          glAccounts={selectableGlAccounts}
          glAccountId={glAccountId}
          disabled={!canSelectAlternative}
          onGlAccountChange={setGlAccountId}
        />
      </main>
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={`Control account ${currentAccount.code} saved`} />
    </div>
  );
}
