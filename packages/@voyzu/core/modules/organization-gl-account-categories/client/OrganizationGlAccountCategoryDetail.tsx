"use client";

import { AuditPanel } from "@voyzu/audit/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { getHasPostingsColor, getStatusSemanticColor } from "@voyzu/core/common/client";
import type { GlAccountCategoryPatchRequestDto, GlAccountCategoryResponseDto } from "@voyzu/core/types/modules/gl-account-categories";
import { Badge, Breadcrumbs, Button, required, useFormValidation, ValidationAlert } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { GlAccountCategoryDetailsForm } from "../../common/gl-account-categories/client";

const TOAST_KEY = "voyzu:gl-account-categories:toast";

interface OrganizationGlAccountCategoryDetailProps {
  category: GlAccountCategoryResponseDto;
  listPath?: string;
  auditPath?: string;
  apiPath?: string;
}

export function OrganizationGlAccountCategoryDetail({
  category,
  listPath = "/organization/chart-of-accounts/reporting-categories",
  auditPath = "/organization/audit",
  apiPath = "/api/organization/gl-account-categories",
}: OrganizationGlAccountCategoryDetailProps) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const validation = useFormValidation(() => ({
    name: { label: "name", value: name, rules: [required()] },
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
      const payload: GlAccountCategoryPatchRequestDto = { name: name.trim() };
      const response = await fetch(apiUrl(`/${encodeURIComponent(category.code)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setServerError(body?.message ?? "An unexpected error occurred");
        return;
      }
      sessionStorage.setItem(TOAST_KEY, `Reporting category ${category.code} saved`);
      router.push(listPath);
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
              <span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>
                account_balance
              </span>
            </div>
            <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>
              {category.name}
            </h1>
          </div>
        </div>
        <div className={layoutStyles.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={listPath} />
            <Button variant="primary" icon="save" disabled={saving} onClick={() => { void save(); }}>
              {saving ? "Saving..." : "Save"}
            </Button>
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
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(category.status)}>
              {category.status}
            </Badge>
          </div>
          {category.hasPostings ? (
            <div className={detailStyles.fieldGroup}>
              <Badge variant="soft" size="medium" customColors={getHasPostingsColor(category.hasPostings)}>
                HAS POSTINGS
              </Badge>
            </div>
          ) : null}
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Companies with postings</label>
            <p className={typography.bodyText}>{category.companiesWithPostings.length > 0 ? category.companiesWithPostings.join(", ") : "None"}</p>
          </div>
        </div>
        <AuditPanel
          id={category.id}
          creationDate={category.audit.created.date}
          updatedDate={category.audit.updated.date}
          creationActorType={category.audit.created.actorType}
          creationUser={category.audit.created.user}
          updatedActorType={category.audit.updated.actorType}
          updatedUser={category.audit.updated.user}
          auditHref={`${auditPath}?entityType=gl_account_category&entityCode=${encodeURIComponent(category.code)}`}
          mutationId={category.audit.updated.mutationId ?? category.audit.created.mutationId}
        />
      </aside>

      <main className={layoutStyles.mainSection}>
        <GlAccountCategoryDetailsForm
          code={category.code}
          name={name}
          accountType={category.accountType}
          sequence={category.sequence}
          nameHasError={validation.hasError("name")}
          onNameChange={setName}
        />
      </main>
    </div>
  );
}

