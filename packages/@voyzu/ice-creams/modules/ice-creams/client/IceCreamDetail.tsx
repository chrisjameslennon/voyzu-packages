"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuditPanel } from "@voyzu/audit/client";
import {
  Badge,
  Breadcrumbs,
  Button,
  ConfirmDialog,
  Input,
  SearchableSelect,
  Toast,
  ValidationAlert,
  required,
  useFormValidation,
} from "@voyzu/ui-components";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import type {
  IceCreamFlavorResponseDto,
  IceCreamPatchRequestDto,
  IceCreamResponseDto,
} from "@voyzu/ice-creams/types";
import styles from "./ice-creams.module.css";

export function IceCreamDetail({
  iceCream,
  flavors,
}: {
  iceCream: IceCreamResponseDto;
  flavors: IceCreamFlavorResponseDto[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(iceCream);
  const [name, setName] = useState(iceCream.name);
  const [flavorCode, setFlavorCode] = useState(iceCream.flavor.code);
  const [supplier, setSupplier] = useState(iceCream.supplier);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saved, setSaved] = useState(false);
  const validation = useFormValidation(() => ({
    name: { label: "name", value: name, rules: [required()] },
    flavorCode: { label: "flavour", value: flavorCode, rules: [required()] },
    supplier: { label: "supplier", value: supplier, rules: [required()] },
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
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload: IceCreamPatchRequestDto = {
        name: name.trim(),
        flavorCode,
        supplier: supplier.trim(),
      };
      const response = await request(`/api/ice-creams/${encodeURIComponent(current.code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response) return;
      const changed = await response.json() as IceCreamResponseDto;
      setCurrent(changed);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const transition = async (action: "activate" | "deactivate") => {
    const response = await request(
      `/api/ice-creams/${encodeURIComponent(current.code)}/activation`,
      { method: action === "activate" ? "PUT" : "DELETE" },
    );
    if (!response) return;
    setCurrent(await response.json() as IceCreamResponseDto);
  };

  const remove = async () => {
    const response = await request(`/api/ice-creams/${encodeURIComponent(current.code)}`, { method: "DELETE" });
    if (!response) return;
    router.push("/ice-creams");
    router.refresh();
  };

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>icecream</span></div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{name}</h1>
          </div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref="/ice-creams" />
            <div className={detailStyles.headerActionSeparator} />
            <Button variant="secondary" icon="check_circle" disabled={current.status === "ACTIVE"} onClick={() => { void transition("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={current.status === "INACTIVE"} onClick={() => { void transition("deactivate"); }}>Deactivate</Button>
            <div className={detailStyles.headerActionSeparator} />
            <Button variant="danger" icon="delete" onClick={() => setShowDelete(true)} />
          </div>
        </div>
        <div className={layout.slotAlert}><ValidationAlert errors={[...validation.errors, ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} /></div>
      </header>

      <aside className={layout.statusSection}>
        <div className={detailStyles.card}>
          <label className={typography.fieldLabel}>Status</label>
          <Badge variant="soft" size="x-large" color={current.status === "ACTIVE" ? "success" : "neutral"}>{current.status}</Badge>
        </div>
        <AuditPanel
          id={current.id}
          creationDate={current.audit.created.date}
          updatedDate={current.audit.updated.date}
          creationActorType={current.audit.created.actorType}
          creationUser={current.audit.created.user}
          updatedActorType={current.audit.updated.actorType}
          updatedUser={current.audit.updated.user}
          auditHref={(() => {
            const mutationId = current.audit.updated.mutationId ?? current.audit.created.mutationId;
            const filter = mutationId
              ? `mutationId=${encodeURIComponent(mutationId)}`
              : `entityType=ice_cream&entityId=${current.id}`;
            return `/ice-creams/audit?${filter}&from=ice-cream&fromCode=${encodeURIComponent(current.code)}`;
          })()}
          onNavigate={(href) => router.push(href)}
        />
      </aside>

      <main className={layout.mainSection}>
        <section className={detailStyles.card}>
          <div className={detailStyles.cardHeader}>
            <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Ice Cream Details</h2>
            <div className={detailStyles.cardHeaderActions}>
              <Button variant="secondary" icon="save" disabled={saving} onClick={() => { void save(); }}>Save</Button>
            </div>
          </div>
          <div className={styles.detailFields}>
            <div className={styles.field}><label className={typography.fieldLabel}>Code</label><Input value={current.code} disabled /></div>
            <div className={styles.field}><label className={typography.fieldLabel}>Name</label><Input value={name} onChange={(event) => setName(event.target.value)} /></div>
            <div className={styles.field}><label className={typography.fieldLabel}>Flavour</label><SearchableSelect value={flavorCode} onChange={setFlavorCode} options={flavors.filter((flavor) => flavor.status === "ACTIVE" || flavor.code === flavorCode).map((flavor) => ({ value: flavor.code, label: flavor.name, code: flavor.code }))} /></div>
            <div className={styles.field}><label className={typography.fieldLabel}>Supplier</label><Input value={supplier} onChange={(event) => setSupplier(event.target.value)} /></div>
          </div>
        </section>
      </main>

      <ConfirmDialog isOpen={showDelete} title="Delete Ice Cream" message={`Permanently delete ${current.code} — ${current.name}?`} confirmLabel="Delete" confirmVariant="danger" onClose={() => setShowDelete(false)} onConfirm={() => { void remove(); }} />
      <Toast isVisible={saved} onClose={() => setSaved(false)} message={`Ice cream ${current.code} saved`} />
    </div>
  );
}
