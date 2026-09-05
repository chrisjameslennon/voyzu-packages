"use client";

import { CompanyAuditPanel } from "@voyzu/finance/common/client";
import { InventoryProcessingRuleAction, inventoryProcessingRuleActionsFor } from "@voyzu/finance/inventory-processing/domain";
import type { GlAccountResponseDto } from "@voyzu/finance/types/modules/gl-accounts";
import type { FinanceInventoryProcessingRule } from "@voyzu/finance/types/modules/inventory-processing";
import { Breadcrumbs, Button, Input, SearchableSelect, Toast, ValidationAlert } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import { useState } from "react";

const label = (value: string) => value.replaceAll("_", " ");

export function InventoryProcessingRuleDetail({
  rule,
  glAccounts,
  apiPath,
  readOnly,
}: {
  rule: FinanceInventoryProcessingRule;
  glAccounts: GlAccountResponseDto[];
  apiPath: string;
  readOnly: boolean;
}) {
  const [current, setCurrent] = useState(rule);
  const [action, setAction] = useState<InventoryProcessingRuleAction>(rule.action);
  const [accountId, setAccountId] = useState(rule.offsetGlAccountId == null ? "" : String(rule.offsetGlAccountId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  const requiresOffsetAccount = action !== InventoryProcessingRuleAction.WaitForMatchedDocument;
  const changed = action !== current.action || accountId !== String(current.offsetGlAccountId ?? "");
  const canSave = !readOnly && changed && (!requiresOffsetAccount || Boolean(accountId)) && !saving;
  const actionOptions = inventoryProcessingRuleActionsFor(current.inventoryDocumentType).map((value) => ({ value, label: label(value) }));

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(apiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, offsetGlAccountId: requiresOffsetAccount ? Number(accountId) : null }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        setError(body?.message ?? "An unexpected error occurred");
        return;
      }
      const updated = await response.json() as FinanceInventoryProcessingRule;
      setCurrent(updated);
      setAction(updated.action);
      setAccountId(String(updated.offsetGlAccountId ?? ""));
      setToast(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={detail.title}>
            <div className={detail.titleIcon}><span className={`material-symbols-outlined ${detail.titleIconSymbol}`}>rule</span></div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{label(current.inventoryDocumentType)} · {label(current.reasonCode)} · {label(current.direction)}</h1>
          </div>
        </div>
        <div className={layout.slotActions}>
          <div className={detail.headerActions}>
            <DetailBackButton fallbackHref="/finance/integration/inventory-processing/rules" />
            <Button variant="primary" icon="save" disabled={!canSave} onClick={() => void save()}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>
        <div className={layout.slotAlert}><ValidationAlert errors={error ? [error] : []} visible={!!error} onDismiss={() => setError("")} /></div>
      </header>
      <aside className={layout.statusSection}>
        <CompanyAuditPanel id={String(current.id)} creationDate={current.audit.created.date} updatedDate={current.audit.updated.date} creationActorType={current.audit.created.actorType} creationUser={current.audit.created.user} updatedActorType={current.audit.updated.actorType} updatedUser={current.audit.updated.user} auditHref={`/settings/audit?entityType=finance_inventory_processing_rule&entityCode=${current.id}`} mutationId={current.audit.updated.mutationId ?? current.audit.created.mutationId} />
      </aside>
      <main className={layout.mainSection}>
        <section className={detail.card}>
          <h2 className={typography.contentTitle}>Rule Details</h2>
          <div className={detail.formGrid}>
            <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Inventory Document Type</span><Input value={label(current.inventoryDocumentType)} disabled /></label>
            <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Reason Code</span><Input value={label(current.reasonCode)} disabled /></label>
            <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Direction</span><Input value={label(current.direction)} disabled /></label>
            <label className={detail.fieldGroup}>
              <span className={typography.fieldLabel}>Action</span>
              <SearchableSelect
                value={action}
                onChange={(value) => {
                  const next = value as InventoryProcessingRuleAction;
                  setAction(next);
                  if (next === InventoryProcessingRuleAction.WaitForMatchedDocument) setAccountId("");
                }}
                options={actionOptions}
                searchable={false}
                showCode={false}
                codeBadge={false}
                disabled={readOnly}
              />
            </label>
            <label className={detail.fieldGroup}>
              <span className={typography.fieldLabel}>Offset GL Account</span>
              {requiresOffsetAccount
                ? <SearchableSelect value={accountId} onChange={setAccountId} options={glAccounts.map((account) => ({ value: String(account.id), code: account.code, label: account.name }))} placeholder="Select a GL account" searchPlaceholder="Search GL accounts..." disabled={readOnly} />
                : <Input value="Not required" disabled />}
            </label>
          </div>
        </section>
      </main>
      <Toast isVisible={toast} onClose={() => setToast(false)} message="Inventory processing rule saved" />
    </div>
  );
}
