"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuditPanel } from "@voyzu/audit/client";
import { Badge, Breadcrumbs, Button, ConfirmDialog, Input, Toast, ValidationAlert, maxLength, useFormValidation } from "@voyzu/ui-components";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import type { TemplatePatchRequestDto, TemplateResponseDto } from "../../types";
import styles from "./template.module.css";

const TOAST_KEY = "voyzu.template.toast";

export function TemplateDetail({ template }: { template: TemplateResponseDto }) {
  const router = useRouter();
  const [current, setCurrent] = useState(template);
  const [description, setDescription] = useState(template.description ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const validation = useFormValidation(() => ({
    description: { label: "description", value: description, rules: [maxLength(200)] },
  }));

  const request = async (path: string, init: RequestInit) => {
    setError("");
    const response = await fetch(path, init);
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string } | null;
      setError(body?.message ?? "The operation could not be completed");
      return null;
    }
    return response;
  };

  const save = async () => {
    setError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload: TemplatePatchRequestDto = { description: description.trim() || null };
      const response = await request(`/api/template/${encodeURIComponent(current.code)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response) return;
      setCurrent(await response.json() as TemplateResponseDto);
      setToastMessage(`Template ${current.code} saved`);
    } finally {
      setSaving(false);
    }
  };

  const transition = async (action: "activate" | "deactivate") => {
    const response = await request(`/api/template/${encodeURIComponent(current.code)}/activation`, { method: action === "activate" ? "PUT" : "DELETE" });
    if (!response) return;
    setCurrent(await response.json() as TemplateResponseDto);
    setToastMessage(`Template ${current.code} ${action === "activate" ? "activated" : "deactivated"}`);
  };

  const remove = async () => {
    const response = await request(`/api/template/${encodeURIComponent(current.code)}`, { method: "DELETE" });
    if (!response) return;
    sessionStorage.setItem(TOAST_KEY, `Template ${current.code} deleted`);
    router.push("/template");
  };

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}><div className={detailStyles.title}><div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>description</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{current.code}</h1></div></div>
        <div className={layout.slotActions}><div className={detailStyles.headerActions}><DetailBackButton fallbackHref="/template" /><div className={detailStyles.headerActionSeparator} /><Button variant="secondary" icon="check_circle" disabled={current.status === "ACTIVE"} onClick={() => { void transition("activate"); }}>Activate</Button><Button variant="secondary" icon="block" disabled={current.status === "INACTIVE"} onClick={() => { void transition("deactivate"); }}>Deactivate</Button><div className={detailStyles.headerActionSeparator} /><Button variant="danger" icon="delete" title="Delete template" onClick={() => setShowDelete(true)} /></div></div>
        <div className={layout.slotAlert}><ValidationAlert errors={[...validation.errors, ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} /></div>
      </header>
      <aside className={layout.statusSection}>
        <div className={detailStyles.card}><label className={typography.fieldLabel}>Status</label><Badge variant="soft" size="x-large" color={current.status === "ACTIVE" ? "success" : "neutral"}>{current.status}</Badge></div>
        <AuditPanel id={current.id} creationDate={current.audit.created.date} updatedDate={current.audit.updated.date} creationActorType={current.audit.created.actorType} creationUser={current.audit.created.user} updatedActorType={current.audit.updated.actorType} updatedUser={current.audit.updated.user} auditHref={(() => {
          const mutationId = current.audit.updated.mutationId ?? current.audit.created.mutationId;
          const filter = mutationId
            ? `mutationId=${encodeURIComponent(mutationId)}`
            : `entityType=template&entityId=${current.id}`;
          return `/template/audit?${filter}&from=template&fromCode=${encodeURIComponent(current.code)}`;
        })()} onNavigate={(href) => router.push(href)} />
      </aside>
      <main className={layout.mainSection}><section className={detailStyles.card}><div className={detailStyles.cardHeader}><h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Template Details</h2><div className={detailStyles.cardHeaderActions}><Button variant="secondary" icon="save" disabled={saving} onClick={() => { void save(); }}>Save</Button></div></div><div className={styles.detailFields}><div className={styles.field}><label className={typography.fieldLabel}>Code</label><Input value={current.code} disabled /></div><div className={styles.field}><label className={typography.fieldLabel}>Description</label><Input value={description} maxLength={200} onChange={(event) => setDescription(event.target.value)} /></div></div></section></main>
      <ConfirmDialog isOpen={showDelete} title="Delete Template" message={`Permanently delete ${current.code}?`} confirmLabel="Delete" confirmVariant="danger" onClose={() => setShowDelete(false)} onConfirm={() => { void remove(); }} />
      <Toast isVisible={!!toastMessage} onClose={() => setToastMessage("")} message={toastMessage} />
    </div>
  );
}
