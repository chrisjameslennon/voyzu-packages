"use client";
import { LinkButton } from "@voyzu/ui-components";

import { AdjustPricingModal } from "./AdjustPricingModal";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuditPanel } from "@voyzu/ui-business-components";
import { DetailBackButton, detailLinkWithBackContext } from "@voyzu/ui-surface/client";
import { Badge, Breadcrumbs, Button, ConfirmDialog, Input, Toast, ValidationAlert, useFormValidation, required, maxLength } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import styles from "./pricing-categories.module.css";
import type { PricingCategory } from "../types/pricing-category.dto";
import { savePricingCategoryAction, transitionPricingCategoriesAction } from "../server/actions/pricing-category.actions";

const listHref = "/commercial/products/pricing-categories";
export function PricingCategoryDetail({ initial }: { initial: PricingCategory }) {
  const router = useRouter();
  const [adjusting, setAdjusting] = useState(false);
  const pathname = usePathname();
  const [record, setRecord] = useState(initial);
  const [name, setName] = useState(initial.name);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  const validation = useFormValidation(() => ({ name: { label: "name", value: name, rules: [required(), maxLength(100)] } }));
  const save = () => {
    setError("");
    if (!validation.attempt()) return;
    startTransition(async () => {
      try {
        const result = await savePricingCategoryAction({ code: record.code, name: name.trim() }, record.code);
        if (result.error) { setError(result.error); return; }
        const updated = result.rows?.find((row) => row.code === record.code);
        if (!updated) { setError("Pricing category was not found."); return; }
        setRecord(updated); setName(updated.name); validation.reset(); setToast("Pricing category saved"); router.refresh();
      } catch { setError("Pricing category could not be saved. Please try again."); }
    });
  };
  const transition = (operation: "activate" | "deactivate" | "delete") => {
    setError("");
    startTransition(async () => {
      try {
        const result = await transitionPricingCategoriesAction([record.code], operation);
        if (result.error) { setError(result.error); return; }
        if (operation === "delete") { router.push(listHref); router.refresh(); return; }
        const updated = result.rows?.find((row) => row.code === record.code);
        if (updated) setRecord(updated);
        setToast(operation === "activate" ? "Pricing category activated" : "Pricing category deactivated"); router.refresh();
      } catch { setError("The operation could not be completed. Please try again."); }
    });
  };
  return <div className={layout.detailView + " " + layout.detailViewWithStatusRail}>
    <header className={layout.detailHeader}>
      <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
      <div className={layout.slotTitle}><div className={detail.title}>
        <div className={detail.titleIcon}><span className={"material-symbols-outlined " + detail.titleIconSymbol}>inventory_2</span></div>
        <h1 className={typography.pageTitle + " " + layout.pageTitleResponsive}>{name}</h1>
      </div></div>
      <div className={layout.slotActions}><div className={detail.headerActions}>
        <DetailBackButton fallbackHref={listHref} /><div className={detail.headerActionSeparator} />
        <Button variant="secondary" icon="price_change" disabled={pending || !record.count} onClick={() => setAdjusting(true)}>Adjust Pricing</Button>
        <Button variant="secondary" icon="check_circle" disabled={pending || record.status === "ACTIVE"} onClick={() => transition("activate")}>Activate</Button>
        <Button variant="secondary" icon="block" disabled={pending || record.status === "INACTIVE"} onClick={() => transition("deactivate")}>Deactivate</Button>
        <div className={detail.headerActionSeparator} /><Button variant="danger" icon="delete" aria-label="Delete pricing category" disabled={pending} onClick={() => setConfirm(true)} />
      </div></div>
      <div className={layout.slotAlert}><ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} /></div>
    </header>
    <aside className={layout.statusSection}>
      <section className={detail.card}><span className={typography.fieldLabel}>Status</span><Badge variant="soft" size="x-large" color={record.status === "ACTIVE" ? "success" : "neutral"}>{record.status}</Badge>
        {record.count > 0 && <><span className={typography.fieldLabel}>Usage</span><Badge variant="soft" size="large" color="info">IN USE</Badge></>}
      </section>
      <AuditPanel id={record.id} creationDate={record.createdAt ? new Date(record.createdAt).toISOString() : ""} updatedDate={record.updatedAt ? new Date(record.updatedAt).toISOString() : ""} auditHref={detailLinkWithBackContext("/settings/audit?entityType=product-pricing-category&entityId=" + record.id, "audit", pathname)} onNavigate={(href) => router.push(href)} />
    </aside>
    <main className={layout.mainSection + " " + detail.stack}>
      <section className={detail.card}>
        <div className={detail.cardHeader}><h2 className={typography.sectionHeading + " " + detail.cardHeaderTitle}>Pricing Category Details</h2><Button variant="secondary" icon="save" disabled={pending} onClick={save}>Save</Button></div>
        <div className={detail.formGrid}>
          <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="pricing-code">Code</label><Input id="pricing-code" value={record.code} disabled /></div>
          <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="pricing-name">Name</label><Input id="pricing-name" value={name} disabled={pending} invalid={validation.hasError("name")} onChange={(event) => setName(event.target.value)} /></div>
        </div>
      </section>
      <section className={detail.card}>
        <div className={detail.cardHeader}><h2 className={typography.sectionHeading + " " + detail.cardHeaderTitle}>Products</h2><LinkButton href={"/commercial/products?" + new URLSearchParams({ pricingCategory: record.code, status: "all" })}>View Products</LinkButton></div>
        <div className={detail.fieldGroup}><span className={typography.fieldLabel}>Number of Products</span><span className={typography.bodyText}>{record.count}</span></div>
      </section>
    </main>
    {adjusting && <AdjustPricingModal categories={[record]} initialCodes={[record.code]} onClose={() => setAdjusting(false)} onAdjusted={(message) => { setAdjusting(false); setToast(message); router.refresh(); }} />}
    <ConfirmDialog isOpen={confirm} title="Delete Pricing Category" message={"Permanently delete " + record.name + "?"} confirmLabel="Delete" confirmVariant="danger" onClose={() => setConfirm(false)} onConfirm={() => { setConfirm(false); transition("delete"); }} />
    <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
  </div>;
}
