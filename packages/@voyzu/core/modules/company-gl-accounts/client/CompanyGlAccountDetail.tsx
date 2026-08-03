"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/core/company-audit/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { CompanySettingsTitleBadges, financeApiUrl } from "@voyzu/core/common/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getHasPostingsColor, getStatusSemanticColor } from "@voyzu/core/common/client";
import { ChangeCodeAvailability, Deactivate, Delete } from "@voyzu/core/common/gl-accounts/domain/operation-policy";
import type { GlAccountCategoryResponseDto } from "@voyzu/core/types/modules/gl-account-categories";
import type { GlAccountResponseDto, GlAccountUpdateRequestDto } from "@voyzu/core/types/modules/gl-accounts";
import { Badge, Breadcrumbs, Button, ConfirmDialog, pattern, required, Toast, useFormValidation, ValidationAlert } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import {
    GL_ACCOUNT_CODE_PATTERN,
    GL_ACCOUNT_TYPE_OPTIONS,
    GlAccountMainForm,
    type GlAccountFormAccountType,
} from "../../common/gl-accounts/client";

const LIST_PATH = "/finance/settings/gl-accounts";
const TOAST_KEY = "voyzu:company-gl-accounts:toast";

interface CompanyGlAccountDetailProps {
  account: GlAccountResponseDto;
  categories: GlAccountCategoryResponseDto[];
  readOnly?: boolean;
  usesOrganizationStandardSettings?: boolean;
  isArchived?: boolean;
}

export function CompanyGlAccountDetail({ account, categories, readOnly = false, usesOrganizationStandardSettings = false, isArchived = false }: CompanyGlAccountDetailProps) {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState(account);
  const [code, setCode] = useState(account.code);
  const [name, setName] = useState(account.name);
  const [accountType, setAccountType] = useState<GlAccountFormAccountType>(account.accountType);
  const [accountCategoryId, setAccountCategoryId] = useState(account.accountCategoryId ? String(account.accountCategoryId) : "");
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const codeBlockers = ChangeCodeAvailability(currentAccount);
  const deactivateBlockers = Deactivate(currentAccount);
  const deleteBlockers = Delete(currentAccount);
  const validation = useFormValidation(() => ({
    code: { label: "code", value: code, rules: [required(), pattern(GL_ACCOUNT_CODE_PATTERN, "Code can only contain uppercase letters, numbers, underscores or hyphens")] },
    name: { label: "name", value: name, rules: [required()] },
  }));
  const currentErrors = [...validation.errors, ...(serverError ? [serverError] : [])];
  const categoryOptions = useMemo(() => categories
    .filter((category) => category.status === "ACTIVE" && category.accountType === accountType)
    .map((category) => ({ value: String(category.id), label: category.name, code: category.code })),
  [accountType, categories]);

  useEffect(() => {
    if (!accountCategoryId) return;
    if (!categoryOptions.some((option) => option.value === accountCategoryId)) {
      setAccountCategoryId("");
    }
  }, [accountCategoryId, categoryOptions]);

  const save = async () => {
    if (readOnly) return;
    setServerError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload: GlAccountUpdateRequestDto = {
        code: code.trim(),
        name: name.trim(),
        accountType: accountType as GlAccountUpdateRequestDto["accountType"],
        ...(accountCategoryId ? { accountCategoryId: Number(accountCategoryId) } : {}),
      };
      const response = await fetch(await financeApiUrl(`/gl-accounts/${encodeURIComponent(currentAccount.code)}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setServerError(body?.message ?? "An unexpected error occurred");
        return;
      }
      const updated = await response.json() as GlAccountResponseDto;
      if (updated.code !== currentAccount.code) router.replace(`${LIST_PATH}/${encodeURIComponent(updated.code)}`);
      setCurrentAccount(updated);
      setToastMessage(`General ledger account ${updated.code} saved`);
      setToastVisible(true);
    } finally {
      setSaving(false);
    }
  };

  const transitionStatus = async (action: "activate" | "deactivate") => {
    if (readOnly) return;
    setServerError("");
    const response = await fetch(await financeApiUrl(`/gl-accounts/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: [currentAccount.code] }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `${action === "activate" ? "Activated" : "Deactivated"} general ledger account ${currentAccount.code}`);
    router.push(LIST_PATH);
  };

  const deleteAccount = async () => {
    setIsDeleteOpen(false);
    if (readOnly) return;
    setServerError("");
    const response = await fetch(await financeApiUrl(`/gl-accounts/${encodeURIComponent(currentAccount.code)}`), { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `Deleted general ledger account ${currentAccount.code}`);
    router.push(LIST_PATH);
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
              <span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>account_balance</span>
            </div>
            <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>{name || currentAccount.name}</h1>
          </div>
          <div className={layoutStyles.slotTitleMeta}>
            <CompanySettingsTitleBadges showOrganizationBaseSettings={usesOrganizationStandardSettings} showArchived={isArchived} showReadOnly={readOnly} />
          </div>
        </div>
        <div className={layoutStyles.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={LIST_PATH} />
            <Button variant="secondary" icon="check_circle" disabled={readOnly || currentAccount.status === "ACTIVE"} onClick={() => { void transitionStatus("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={readOnly || currentAccount.status === "INACTIVE" || deactivateBlockers.length > 0} onClick={() => { void transitionStatus("deactivate"); }}>Deactivate</Button>
            <Button variant="danger" icon="delete" disabled={readOnly || deleteBlockers.length > 0} onClick={() => setIsDeleteOpen(true)} />
          </div>
        </div>
        <div className={layoutStyles.slotAlert}>
          <ValidationAlert errors={currentErrors} visible={validation.showErrors || !!serverError} onDismiss={() => { validation.dismiss(); setServerError(""); }} />
        </div>
      </header>

      <aside className={layoutStyles.statusSection}>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Status</label>
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(currentAccount.status)}>
              {currentAccount.status}
            </Badge>
          </div>
          {currentAccount.hasPostings ? (
            <div className={detailStyles.fieldGroup}>
              <Badge variant="soft" size="medium" customColors={getHasPostingsColor(currentAccount.hasPostings)}>
                HAS POSTINGS
              </Badge>
            </div>
          ) : null}
        </div>
        <div className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Linked By</h2>
          <div className={detailStyles.systemBody}>
            {currentAccount.linkedBy.length === 0 ? (
              <p className={typography.bodyText}>No linked controls</p>
            ) : currentAccount.linkedBy.map((link) => (
              <p key={`${link.type}-${link.code}`} className={typography.bodyText}>
                {link.type}: {link.code}
              </p>
            ))}
          </div>
        </div>
        <AuditPanel
          id={currentAccount.id}
          creationDate={currentAccount.audit.created.date}
          updatedDate={currentAccount.audit.updated.date}
          creationActorType={currentAccount.audit.created.actorType}
          creationUser={currentAccount.audit.created.user}
          updatedActorType={currentAccount.audit.updated.actorType}
          updatedUser={currentAccount.audit.updated.user}
          auditHref={readOnly ? undefined : `/finance/audit?entityType=gl_account&entityCode=${encodeURIComponent(currentAccount.code)}`}
          mutationId={currentAccount.audit.updated.mutationId ?? currentAccount.audit.created.mutationId}
        />
      </aside>

      <main className={layoutStyles.mainSection}>
        <GlAccountMainForm
          sectionTitle="General Ledger Account Details"
          accountTypeOptions={GL_ACCOUNT_TYPE_OPTIONS}
          categoryOptions={categoryOptions}
          code={code}
          name={name}
          accountType={accountType}
          accountCategoryId={accountCategoryId}
          codeHasError={validation.hasError("code")}
          nameHasError={validation.hasError("name")}
          codeDisabled={codeBlockers.length > 0}
          readOnly={readOnly}
          onCodeChange={(value) => setCode(value.toUpperCase())}
          onNameChange={setName}
          onAccountTypeChange={setAccountType}
          onAccountCategoryIdChange={setAccountCategoryId}
          saving={saving}
          onSave={() => { void save(); }}
        />
      </main>
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete General Ledger Account"
        message={`Are you sure you want to permanently delete general ledger account ${currentAccount.code}?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => { void deleteAccount(); }}
      />
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={toastMessage} />
    </div>
  );
}

