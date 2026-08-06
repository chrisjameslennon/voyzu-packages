"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/core/company-audit/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { CompanySettingsTitleBadges, getStatusSemanticColor } from "@voyzu/core/common/client";
import { AssignGLAccount, Deactivate, Delete, PostingAccountEnabled, PostingAccountRequired } from "@voyzu/core/common/inventory-item-posting-profiles/domain/operation-policy";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ItemPostingProfileDetailsForm } from "../../common/inventory-item-posting-profiles/client";

import type { GlAccountResponseDto } from "@voyzu/core/types/modules/gl-accounts";
import type { ItemPostingProfilePatchRequestDto, ItemPostingProfileResponseDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";
import { Badge, Breadcrumbs, Button, ConfirmDialog, pattern, required, useFormValidation, ValidationAlert } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const TOAST_KEY = "voyzu.item-posting-profiles.toast";
const CODE_PATTERN = /^[A-Z0-9_ -]+$/;

export function CompanyInventoryItemPostingProfileDetail({
  profile,
  glAccounts,
  listPath = "/finance/inventory/item-posting-profiles",
  apiPath = "/api/inventory/item-posting-profiles",
  showOrganizationBaseSettings = false,
  showArchived = false,
  readOnly = false,
}: {
  profile: ItemPostingProfileResponseDto;
  glAccounts: GlAccountResponseDto[];
  listPath?: string;
  apiPath?: string;
  showOrganizationBaseSettings?: boolean;
  showArchived?: boolean;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [profileCode, setProfileCode] = useState(profile.profile_code);
  const [profileName, setProfileName] = useState(profile.profile_name);
  const [description, setDescription] = useState(profile.description);
  const [isSold, setIsSold] = useState(profile.is_sold);
  const [isPurchased, setIsPurchased] = useState(profile.is_purchased);
  const [isConsumed, setIsConsumed] = useState(profile.is_consumed);
  const [revenueCode, setRevenueCode] = useState(profile.revenue_code?.code ?? "");
  const [cogsCode, setCogsCode] = useState(profile.cogs_code?.code ?? "");
  const [purchaseExpenseCode, setPurchaseExpenseCode] = useState(profile.purchase_expense_code?.code ?? "");
  const [consumptionCode, setConsumptionCode] = useState(profile.consumption_code?.code ?? "");
  const [adjustmentGainCode, setAdjustmentGainCode] = useState(profile.adjustment_gain_code?.code ?? "");
  const [adjustmentLossCode, setAdjustmentLossCode] = useState(profile.adjustment_loss_code?.code ?? "");
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isCodeChangeOpen, setIsCodeChangeOpen] = useState(false);

  const validation = useFormValidation(() => ({
    profileCode: { label: "profile code", value: profileCode, rules: [required(), pattern(CODE_PATTERN, "Profile code can only contain letters, numbers, spaces, underscores or hyphens")] },
    profileName: { label: "profile name", value: profileName, rules: [required()] },
    description: { label: "description", value: description, rules: [required()] },
    revenueCode: { label: "revenue code", value: revenueCode, enabled: PostingAccountRequired("revenue_code", { is_sold: isSold, is_purchased: isPurchased, is_consumed: isConsumed }), rules: [required()] },
    cogsCode: { label: "COGS code", value: cogsCode, enabled: PostingAccountRequired("cogs_code", { is_sold: isSold, is_purchased: isPurchased, is_consumed: isConsumed }), rules: [required()] },
    purchaseExpenseCode: { label: "purchase expense code", value: purchaseExpenseCode, enabled: PostingAccountRequired("purchase_expense_code", { is_sold: isSold, is_purchased: isPurchased, is_consumed: isConsumed }), rules: [required()] },
    consumptionCode: { label: "consumption code", value: consumptionCode, enabled: PostingAccountRequired("consumption_code", { is_sold: isSold, is_purchased: isPurchased, is_consumed: isConsumed }), rules: [required()] },
  }));
  const currentErrors = [...validation.errors, ...(serverError ? [serverError] : [])];
  const revenueAccountOptions = useMemo(
    () => glAccounts
      .filter((account) => AssignGLAccount(account, "REVENUE").length === 0)
      .map((account) => ({ value: account.code, label: account.name, code: account.code })),
    [glAccounts],
  );
  const expenseAccountOptions = useMemo(
    () => glAccounts
      .filter((account) => AssignGLAccount(account, "EXPENSE").length === 0)
      .map((account) => ({ value: account.code, label: account.name, code: account.code })),
    [glAccounts],
  );
  const apiUrl = (suffix = "") => {
    const [path, query] = apiPath.split("?");
    return `${path}${suffix}${query ? `?${query}` : ""}`;
  };

  const executeSave = async () => {
    setIsCodeChangeOpen(false);
    if (readOnly) return;
    setServerError("");
    setSaving(true);
    try {
      const payload: ItemPostingProfilePatchRequestDto = {
        profile_code: profileCode,
        profile_name: profileName.trim(),
        description: description.trim(),
        is_sold: isSold,
        is_purchased: isPurchased,
        is_consumed: isConsumed,
        revenue_code: revenueCode || null,
        cogs_code: cogsCode || null,
        purchase_expense_code: purchaseExpenseCode || null,
        consumption_code: consumptionCode || null,
        adjustment_gain_code: adjustmentGainCode || null,
        adjustment_loss_code: adjustmentLossCode || null,
      };
      const response = await fetch(apiUrl(`/${encodeURIComponent(profile.profile_code)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setServerError(body?.message ?? "An unexpected error occurred");
        return;
      }
      sessionStorage.setItem(TOAST_KEY, `Posting profile ${profileCode.trim().toUpperCase().replaceAll(" ", "_")} saved`);
      router.push(listPath);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (readOnly) return;
    setServerError("");
    if (!validation.attempt()) return;
    const normalizedCode = profileCode.trim().toUpperCase().replaceAll(" ", "_");
    if (normalizedCode !== profile.profile_code) {
      setIsCodeChangeOpen(true);
      return;
    }
    void executeSave();
  };

  const transitionStatus = async (action: "activate" | "deactivate") => {
    if (readOnly) return;
    setServerError("");
    const response = await fetch(apiUrl(`/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: [profile.profile_code] }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `${action === "activate" ? "Activated" : "Deactivated"} posting profile ${profile.profile_code}`);
    router.push(listPath);
  };

  const deleteProfile = async () => {
    if (readOnly) return;
    setServerError("");
    const response = await fetch(apiUrl(`/${encodeURIComponent(profile.profile_code)}`), { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `Deleted posting profile ${profile.profile_code}`);
    router.push(listPath);
  };

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>webhook</span></div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{profile.profile_name}</h1>
          </div>
          <div className={layout.slotTitleMeta}>
            <CompanySettingsTitleBadges
              showOrganizationBaseSettings={showOrganizationBaseSettings}
              showArchived={showArchived}
              showReadOnly={readOnly}
            />
          </div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={listPath} />
            <Button variant="secondary" icon="check_circle" disabled={readOnly || profile.status === "ACTIVE"} onClick={() => { void transitionStatus("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={readOnly || profile.status === "INACTIVE" || Deactivate({ code: profile.profile_code, linkedBy: profile.linkedBy }).length > 0} onClick={() => { void transitionStatus("deactivate"); }}>Deactivate</Button>
            <Button variant="danger" icon="delete" disabled={readOnly || Delete({ code: profile.profile_code, linkedBy: profile.linkedBy }).length > 0} onClick={() => { void deleteProfile(); }} />
          </div>
        </div>
        <div className={layout.slotAlert}>
          <ValidationAlert errors={currentErrors} visible={validation.showErrors || !!serverError} onDismiss={() => { validation.dismiss(); setServerError(""); }} />
        </div>
      </header>

      <aside className={layout.statusSection}>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Status</label>
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(profile.status)}>{profile.status}</Badge>
          </div>
        </div>
        <AuditPanel
          id={profile.id}
          creationDate={profile.audit.created.date}
          updatedDate={profile.audit.updated.date}
          creationActorType={profile.audit.created.actorType}
          creationUser={profile.audit.created.user}
          updatedActorType={profile.audit.updated.actorType}
          updatedUser={profile.audit.updated.user}
          auditHref={`/finance/audit?entityType=item_posting_profile&entityCode=${encodeURIComponent(profile.profile_code)}`}
          mutationId={profile.audit.updated.mutationId ?? profile.audit.created.mutationId}
        />
      </aside>

      <main className={layout.mainSection}>
        <ItemPostingProfileDetailsForm
          profileCode={profileCode}
          profileName={profileName}
          description={description}
          isSold={isSold}
          isPurchased={isPurchased}
          isConsumed={isConsumed}
          revenueCode={revenueCode}
          cogsCode={cogsCode}
          purchaseExpenseCode={purchaseExpenseCode}
          consumptionCode={consumptionCode}
          adjustmentGainCode={adjustmentGainCode}
          adjustmentLossCode={adjustmentLossCode}
          revenueAccountOptions={revenueAccountOptions}
          expenseAccountOptions={expenseAccountOptions}
          saving={saving}
          readOnly={readOnly}
          revenueCodeDisabled={!PostingAccountEnabled("revenue_code", { is_sold: isSold, is_purchased: isPurchased, is_consumed: isConsumed })}
          cogsCodeDisabled={!PostingAccountEnabled("cogs_code", { is_sold: isSold, is_purchased: isPurchased, is_consumed: isConsumed })}
          purchaseExpenseCodeDisabled={!PostingAccountEnabled("purchase_expense_code", { is_sold: isSold, is_purchased: isPurchased, is_consumed: isConsumed })}
          consumptionCodeDisabled={!PostingAccountEnabled("consumption_code", { is_sold: isSold, is_purchased: isPurchased, is_consumed: isConsumed })}
          fieldErrors={{
            profileCode: validation.hasError("profileCode"),
            profileName: validation.hasError("profileName"),
            description: validation.hasError("description"),
            revenueCode: validation.hasError("revenueCode"),
            cogsCode: validation.hasError("cogsCode"),
            purchaseExpenseCode: validation.hasError("purchaseExpenseCode"),
            consumptionCode: validation.hasError("consumptionCode"),
          }}
          onProfileCodeChange={(value) => setProfileCode(value.toUpperCase())}
          onProfileNameChange={setProfileName}
          onDescriptionChange={setDescription}
          onIsSoldChange={(checked) => { setIsSold(checked); if (!checked) { setRevenueCode(""); setCogsCode(""); } }}
          onIsPurchasedChange={(checked) => { setIsPurchased(checked); if (!checked) setPurchaseExpenseCode(""); }}
          onIsConsumedChange={(checked) => { setIsConsumed(checked); if (!checked) setConsumptionCode(""); }}
          onRevenueCodeChange={setRevenueCode}
          onCogsCodeChange={setCogsCode}
          onPurchaseExpenseCodeChange={setPurchaseExpenseCode}
          onConsumptionCodeChange={setConsumptionCode}
          onAdjustmentGainCodeChange={setAdjustmentGainCode}
          onAdjustmentLossCodeChange={setAdjustmentLossCode}
          onSave={handleSave}
        />
      </main>
      <ConfirmDialog
        isOpen={isCodeChangeOpen}
        title="Change Posting Profile Code"
        message="You are about to change the posting profile code. External integrations may need to be updated."
        confirmLabel="Proceed"
        confirmVariant="primary"
        onClose={() => setIsCodeChangeOpen(false)}
        onConfirm={executeSave}
      />
    </div>
  );
}

