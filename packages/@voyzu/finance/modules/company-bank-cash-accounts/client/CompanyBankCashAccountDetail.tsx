"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/finance/common/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { CompanySettingsTitleBadges, getHasPostingsColor, getStatusSemanticColor, type DetailBackSource } from "@voyzu/finance/common/client";
import { ChangeCodeAvailability, ChangeTypeAvailability, Deactivate, Delete, UpdateGLAccount } from "@voyzu/finance/common/bank-cash-accounts/domain/operation-policy";
import type { BankCashAccountPatchRequestDto, BankCashAccountResponseDto } from "@voyzu/finance/types/modules/bank-cash-accounts";
import type { GlAccountResponseDto } from "@voyzu/finance/types/modules/gl-accounts";
import { Badge, Breadcrumbs, Button, pattern, required, useFormValidation, ValidationAlert } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { BankCashAccountDetailsForm } from "../../common/bank-cash-accounts/client";

const TOAST_KEY = "voyzu:bank-cash-accounts:toast";
const CODE_PATTERN = /^[A-Z0-9_-]+$/;

interface CompanyBankCashAccountDetailProps {
  account: BankCashAccountResponseDto;
  glAccounts: GlAccountResponseDto[];
  listPath?: string;
  auditPath?: string;
  apiPath?: string;
  readOnly?: boolean;
  usesFinanceTemplateSettings?: boolean;
  isArchived?: boolean;
  from?: DetailBackSource;
  fromCode?: string;
}

export function CompanyBankCashAccountDetail({
  account,
  glAccounts,
  listPath = "/organization/bank-cash-accounts",
  auditPath = "/settings/audit",
  apiPath = "/api/organization/bank-cash-accounts",
  readOnly = false,
  usesFinanceTemplateSettings = false,
  isArchived = false,
  from,
  fromCode,
}: CompanyBankCashAccountDetailProps) {
  const router = useRouter();
  const [code, setCode] = useState(account.code);
  const [type, setType] = useState(account.type);
  const [glAccountId, setGlAccountId] = useState(String(account.glAccountId));
  const [bankName, setBankName] = useState(account.bankName ?? "");
  const [bankBranchName, setBankBranchName] = useState(account.bankBranchName ?? "");
  const [bankAccountIdentifier, setBankAccountIdentifier] = useState(account.bankAccountIdentifier ?? "");
  const [cashAccountIdentifier, setCashAccountIdentifier] = useState(account.cashAccountIdentifier ?? "");
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const deactivateBlockers = Deactivate(account);
  const deleteBlockers = Delete(account);
  const codeBlockers = ChangeCodeAvailability(account);
  const typeBlockers = ChangeTypeAvailability(account);
  const glAccountOptions = useMemo(() => glAccounts
    .filter((target) => UpdateGLAccount(account, target).length === 0)
    .map((target) => ({ value: String(target.id), label: target.name, code: target.code })),
  [account, glAccounts]);
  const glAccountDisabled = !glAccountOptions.some((option) => option.value !== String(account.glAccountId));
  const validation = useFormValidation(() => ({
    code: { label: "code", value: code, rules: [required(), pattern(CODE_PATTERN, "Code can only contain uppercase letters, numbers, underscores or hyphens")] },
  }));
  const currentErrors = [...validation.errors, ...(serverError ? [serverError] : [])];

  const apiUrl = (suffix = "") => {
    const [path, query] = apiPath.split("?");
    return `${path}${suffix}${query ? `?${query}` : ""}`;
  };

  const save = async () => {
    if (readOnly) return;
    setServerError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload: BankCashAccountPatchRequestDto = {
        code: code.trim(),
        type,
        glAccountId: Number(glAccountId),
        bankName: bankName.trim() || null,
        bankBranchName: bankBranchName.trim() || null,
        bankAccountIdentifier: bankAccountIdentifier.trim() || null,
        cashAccountIdentifier: cashAccountIdentifier.trim() || null,
      };
      const response = await fetch(apiUrl(`/${encodeURIComponent(account.code)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setServerError(body?.message ?? "An unexpected error occurred");
        return;
      }
      sessionStorage.setItem(TOAST_KEY, `Bank / cash account ${code.trim()} saved`);
      router.push(listPath);
    } finally {
      setSaving(false);
    }
  };

  const transitionStatus = async (action: "activate" | "deactivate") => {
    if (readOnly) return;
    setServerError("");
    const response = await fetch(apiUrl(`/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: [account.code] }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `${action === "activate" ? "Activated" : "Deactivated"} bank / cash account ${account.code}`);
    router.push(listPath);
  };

  const deleteAccount = async () => {
    if (readOnly) return;
    setServerError("");
    const response = await fetch(apiUrl(`/${encodeURIComponent(account.code)}`), { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `Deleted bank / cash account ${account.code}`);
    router.push(listPath);
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
            <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>
              {account.code}
            </h1>
          </div>
          <div className={layoutStyles.slotTitleMeta}>
            <CompanySettingsTitleBadges showFinanceTemplateSettings={usesFinanceTemplateSettings} showArchived={isArchived} showReadOnly={readOnly} />
          </div>
        </div>
        <div className={layoutStyles.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={listPath} from={from} fromCode={fromCode} />
            <Button variant="secondary" icon="check_circle" disabled={readOnly || account.status === "ACTIVE"} onClick={() => { void transitionStatus("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={readOnly || account.status === "INACTIVE" || deactivateBlockers.length > 0} onClick={() => { void transitionStatus("deactivate"); }}>Deactivate</Button>
            <Button variant="danger" icon="delete" disabled={readOnly || deleteBlockers.length > 0} onClick={() => { void deleteAccount(); }} />
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
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(account.status)}>
              {account.status}
            </Badge>
          </div>
          {account.hasPostings ? (
            <div className={detailStyles.fieldGroup}>
              <Badge variant="soft" size="medium" customColors={getHasPostingsColor(account.hasPostings)}>
                HAS POSTINGS
              </Badge>
            </div>
          ) : null}
        </div>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Linked By</label>
            {account.linkedBy.length === 0 ? (
              <p className={typography.bodyText}>No linked financial document defaults</p>
            ) : account.linkedBy.map((link) => (
              <p key={`${link.type}:${link.code}`} className={typography.bodyText}>{link.type}: {link.code}</p>
            ))}
          </div>
        </div>
        <AuditPanel
          id={account.id}
          creationDate={account.audit.created.date}
          updatedDate={account.audit.updated.date}
          creationActorType={account.audit.created.actorType}
          creationUser={account.audit.created.user}
          updatedActorType={account.audit.updated.actorType}
          updatedUser={account.audit.updated.user}
          auditHref={`${auditPath}?entityType=bank_cash_control_account&entityCode=${encodeURIComponent(account.code)}`}
          mutationId={account.audit.updated.mutationId ?? account.audit.created.mutationId}
        />
      </aside>

      <main className={layoutStyles.mainSection}>
        <BankCashAccountDetailsForm
          code={code}
          type={type}
          glAccountId={glAccountId}
          glAccountOptions={glAccountOptions}
          glAccountTypeBadge="ASSET"
          glAccountDisabled={glAccountDisabled}
          bankName={bankName}
          bankBranchName={bankBranchName}
          bankAccountIdentifier={bankAccountIdentifier}
          cashAccountIdentifier={cashAccountIdentifier}
          saving={saving}
          codeDisabled={codeBlockers.length > 0}
          typeDisabled={typeBlockers.length > 0}
          codeHasError={validation.hasError("code")}
          readOnly={readOnly}
          onCodeChange={(value) => setCode(value.toUpperCase())}
          onTypeChange={setType}
          onGlAccountChange={setGlAccountId}
          onBankNameChange={setBankName}
          onBankBranchNameChange={setBankBranchName}
          onBankAccountIdentifierChange={setBankAccountIdentifier}
          onCashAccountIdentifierChange={setCashAccountIdentifier}
          onSave={() => { void save(); }}
        />
      </main>

    </div>
  );
}

