"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/modules/company-audit/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { CompanyPageTitleBadges, getStatusSemanticColor } from "@voyzu/modules/common/client";
import { Deactivate, Delete } from "@voyzu/modules/common/inventory-categories/domain/operation-policy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InventoryCategoryDetailsForm } from "../../common/inventory-categories/client";

import type { InventoryCategoryPatchRequestDto, InventoryCategoryResponseDto } from "@voyzu/types/modules/inventory-categories";
import type { ItemPostingProfileResponseDto } from "@voyzu/types/modules/inventory-item-posting-profiles";
import { Badge, Breadcrumbs, Button, pattern, required, Toast, useFormValidation, ValidationAlert } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const TOAST_KEY = "voyzu.inventory-categories.toast";

export function CompanyInventoryCategoryDetail({
  category,
  postingProfiles,
  listPath = "/finance/inventory/categories",
  apiPath = "/api/inventory/categories",
}: {
  category: InventoryCategoryResponseDto;
  postingProfiles: ItemPostingProfileResponseDto[];
  listPath?: string;
  apiPath?: string;
}) {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState(category);
  const [code, setCode] = useState(category.code);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [postingProfileCode, setPostingProfileCode] = useState(category.posting_profile_code);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const postingProfileOptions = postingProfiles
    .filter((profile) => profile.status === "ACTIVE" || profile.profile_code === postingProfileCode)
    .map((profile) => ({ value: profile.profile_code, label: profile.profile_name, code: profile.profile_code }));
  const validation = useFormValidation(() => ({
    code: { label: "code", value: code, rules: [required(), pattern(/^[A-Z0-9_ -]+$/i, "Code must contain letters, numbers, spaces, underscores or hyphens")] },
    name: { label: "name", value: name, rules: [required()] },
    description: { label: "description", value: description, rules: [required()] },
    posting_profile_code: { label: "posting profile", value: postingProfileCode, rules: [required()] },
  }));
  const currentErrors = [...validation.errors, ...(serverError ? [serverError] : [])];

  const apiUrl = (suffix = "") => {
    const [path, query] = apiPath.split("?");
    return `${path}${suffix}${query ? `?${query}` : ""}`;
  };

  const save = async () => {
    setServerError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload: InventoryCategoryPatchRequestDto = { code: code.trim(), name: name.trim(), description: description.trim(), posting_profile_code: postingProfileCode };
      const response = await fetch(apiUrl(`/${encodeURIComponent(currentCategory.code)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setServerError(body?.message ?? "An unexpected error occurred");
        return;
      }
      const updated = await response.json() as InventoryCategoryResponseDto;
      if (updated.code !== currentCategory.code) router.replace(`${listPath}/${encodeURIComponent(updated.code)}`);
      setCurrentCategory(updated);
      setCode(updated.code);
      setPostingProfileCode(updated.posting_profile_code);
      setToastVisible(true);
    } finally {
      setSaving(false);
    }
  };

  const transitionStatus = async (action: "activate" | "deactivate") => {
    setServerError("");
    const response = await fetch(apiUrl(`/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: [currentCategory.code] }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `${action === "activate" ? "Activated" : "Deactivated"} category ${currentCategory.code}`);
    router.push(listPath);
  };

  const deleteCategory = async () => {
    setServerError("");
    const response = await fetch(apiUrl(`/${encodeURIComponent(currentCategory.code)}`), { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `Deleted category ${currentCategory.code}`);
    router.push(listPath);
  };

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>package_2</span></div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{name || currentCategory.name}</h1>
          </div>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={listPath} />
            <Button variant="secondary" icon="check_circle" disabled={currentCategory.status === "ACTIVE"} onClick={() => { void transitionStatus("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={currentCategory.status === "INACTIVE" || Deactivate(currentCategory).length > 0} onClick={() => { void transitionStatus("deactivate"); }}>Deactivate</Button>
            <Button variant="danger" icon="delete" disabled={Delete(currentCategory).length > 0} onClick={() => { void deleteCategory(); }} />
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
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(currentCategory.status)}>{currentCategory.status}</Badge>
          </div>
        </div>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Active Items</label>
            <p className={typography.bodyText}>{currentCategory.numberOfItems.active}</p>
          </div>
        </div>
        <AuditPanel
          id={currentCategory.id}
          creationDate={currentCategory.audit.created.date}
          updatedDate={currentCategory.audit.updated.date}
          creationActorType={currentCategory.audit.created.actorType}
          creationUser={currentCategory.audit.created.user}
          updatedActorType={currentCategory.audit.updated.actorType}
          updatedUser={currentCategory.audit.updated.user}
          auditHref={`/finance/audit?entityType=inventory_category&entityCode=${encodeURIComponent(currentCategory.code)}`}
          mutationId={currentCategory.audit.updated.mutationId ?? currentCategory.audit.created.mutationId}
        />
      </aside>

      <main className={layout.mainSection}>
        <InventoryCategoryDetailsForm
          code={code}
          name={name}
          description={description}
          postingProfileCode={postingProfileCode}
          postingProfileOptions={postingProfileOptions}
          saving={saving}
          codeHasError={validation.hasError("code")}
          nameHasError={validation.hasError("name")}
          descriptionHasError={validation.hasError("description")}
          postingProfileHasError={validation.hasError("posting_profile_code")}
          onCodeChange={(value) => setCode(value.toUpperCase())}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onPostingProfileChange={setPostingProfileCode}
          onSave={() => { void save(); }}
        />
      </main>
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={`Category ${currentCategory.code} saved`} />
    </div>
  );
}
