"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/finance/common/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { useState } from "react";
import { CompanySettingsTitleBadges, getHasPostingsColor } from "@voyzu/finance/common/client";
import { UpdateGLAccount } from "@voyzu/finance/common/control-accounts/domain/operation-policy";
import type { ControlAccountResponseDto } from "@voyzu/finance/types/modules/control-accounts";
import type { GlAccountResponseDto } from "@voyzu/finance/types/modules/gl-accounts";
import { Badge, Breadcrumbs, Button, Toast, ValidationAlert } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { CompanyArControlAccountDetailsForm } from "./CompanyArControlAccountDetailsForm";

interface Props { account: ControlAccountResponseDto; glAccounts: GlAccountResponseDto[]; apiPath: string; listPath?: string; auditPath?: string; readOnly?: boolean; isArchived?: boolean; }

export function CompanyArControlAccountDetail({ account, glAccounts, apiPath, listPath = "/finance/settings/control-accounts/ar", auditPath = "/settings/audit", readOnly = false, isArchived = false }: Props) {
  const [currentAccount, setCurrentAccount] = useState(account);
  const [glAccountId, setGlAccountId] = useState(String(account.glAccountId));
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const selectedGlAccount = glAccounts.find((glAccount) => String(glAccount.id) === glAccountId);
  const currentPolicyInput = { code: currentAccount.code, glAccountId: currentAccount.glAccountId, hasPostings: currentAccount.hasPostings };
  const requirements = { requiredAccountType: "ASSET" as const };
  const blockers = selectedGlAccount ? UpdateGLAccount(currentPolicyInput, selectedGlAccount, requirements) : [];
  const selectableGlAccounts = glAccounts.filter((glAccount) => glAccount.id === currentAccount.glAccountId || UpdateGLAccount(currentPolicyInput, glAccount, requirements).length === 0);
  const hasChange = selectedGlAccount != null && selectedGlAccount.id !== currentAccount.glAccountId;
  const canSelectAlternative = selectableGlAccounts.some((glAccount) => glAccount.id !== currentAccount.glAccountId);

  const save = async () => {
    if (readOnly || !hasChange || blockers.length > 0 || saving) return;
    setServerError(""); setSaving(true);
    try {
      const response = await fetch(`${apiPath}/${encodeURIComponent(currentAccount.code)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ glAccountId: Number(glAccountId) }) });
      if (!response.ok) { const body = await response.json().catch(() => null) as { message?: string } | null; setServerError(body?.message ?? "An unexpected error occurred"); return; }
      setCurrentAccount(await response.json() as ControlAccountResponseDto); setToastVisible(true);
    } finally { setSaving(false); }
  };

  return (
    <div className={`${layoutStyles.detailView} ${layoutStyles.detailViewWithStatusRail}`}>
      <header className={layoutStyles.detailHeader}>
        <div className={layoutStyles.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layoutStyles.slotTitle}><div className={detailStyles.title}><div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>account_tree</span></div><h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>{currentAccount.name}</h1></div><div className={layoutStyles.slotTitleMeta}><CompanySettingsTitleBadges showArchived={isArchived} showReadOnly={readOnly} /></div></div>
        <div className={layoutStyles.slotActions}><div className={detailStyles.headerActions}><DetailBackButton fallbackHref={listPath} /><Button variant="primary" icon="save" disabled={saving || readOnly || !hasChange || blockers.length > 0} onClick={() => { void save(); }}>{saving ? "Saving..." : "Save"}</Button></div></div>
        <div className={layoutStyles.slotAlert}><ValidationAlert errors={serverError ? [serverError] : []} visible={!!serverError} onDismiss={() => setServerError("")} /></div>
      </header>
      <aside className={layoutStyles.statusSection}>
        {currentAccount.hasPostings ? <div className={detailStyles.card}><div className={detailStyles.fieldGroup}><Badge variant="soft" size="medium" customColors={getHasPostingsColor(true)}>HAS POSTINGS</Badge></div></div> : null}
        <AuditPanel id={currentAccount.code} creationDate={currentAccount.audit.created.date} updatedDate={currentAccount.audit.updated.date} creationActorType={currentAccount.audit.created.actorType} creationUser={currentAccount.audit.created.user} updatedActorType={currentAccount.audit.updated.actorType} updatedUser={currentAccount.audit.updated.user} auditHref={`${auditPath}?entityType=control_account&entityCode=${encodeURIComponent(currentAccount.code)}`} mutationId={currentAccount.audit.updated.mutationId ?? currentAccount.audit.created.mutationId} />
      </aside>
      <main className={layoutStyles.mainSection}><CompanyArControlAccountDetailsForm account={currentAccount} glAccounts={selectableGlAccounts} glAccountId={glAccountId} disabled={readOnly || !canSelectAlternative} onGlAccountChange={setGlAccountId} /></main>
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={`Control account ${currentAccount.code} saved`} />
    </div>
  );
}

