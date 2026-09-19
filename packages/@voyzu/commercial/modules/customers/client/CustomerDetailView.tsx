"use client";
import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuditPanel } from "@voyzu/ui-business-components";
import { DetailBackButton, detailLinkWithBackContext } from "@voyzu/ui-surface/client";
import { Badge, Breadcrumbs, Button, ConfirmDialog, Toast, ValidationAlert } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { CustomerConfiguration } from "../types/customer-configuration.dto";
import type { Customer, CustomerInput } from "../types/customer.dto";
import { saveCustomerAction, transitionCustomersAction } from "../server/actions/customer.actions";
import { CustomerFields, useCustomerValidation } from "./CustomerFields";
const inputOf = ({ code, name, primaryContactName, email, categoryCode, priceListCode, usePostalAddressForShipping, addresses, notes }: Customer): CustomerInput => ({ code, name, primaryContactName, email, categoryCode, priceListCode, usePostalAddressForShipping, addresses, notes });
export function CustomerDetailView({ initial, categories, priceLists }: { initial: Customer; categories: CustomerConfiguration[]; priceLists: CustomerConfiguration[] }) {
  const router = useRouter(), pathname = usePathname();
  const [record, setRecord] = useState(initial);
  const [value, setValue] = useState(() => inputOf(initial));
  const [error, setError] = useState(""), [toast, setToast] = useState(""), [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  const validation = useCustomerValidation(value);
  const save = () => {
    setError(""); if (!validation.attempt()) return;
    startTransition(async () => {
      try { const result = await saveCustomerAction(value, record.code); if (!result.customer) { setError(result.error ?? "Unable to save customer."); return; } setRecord(result.customer); setValue(inputOf(result.customer)); validation.reset(); setToast("Customer saved"); router.refresh(); }
      catch { setError("Unable to save customer. Please try again."); }
    });
  };
  const transition = (operation: "activate" | "deactivate" | "delete") => {
    setError(""); startTransition(async () => {
      try { const result = await transitionCustomersAction([record.code], operation); if (result.error) { setError(result.error); return; } if (operation === "delete") { router.push("/commercial/customers"); router.refresh(); return; } if (result.customer) setRecord(result.customer); setToast(operation === "activate" ? "Customer activated" : "Customer deactivated"); router.refresh(); }
      catch { setError("Unable to update customer. Please try again."); }
    });
  };
  return <div className={layout.detailView + " " + layout.detailViewWithStatusRail}>
    <header className={layout.detailHeader}>
      <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
      <div className={layout.slotTitle}><div className={detail.title}><div className={detail.titleIcon}><span className={"material-symbols-outlined " + detail.titleIconSymbol}>group</span></div><h1 className={typography.pageTitle + " " + layout.pageTitleResponsive}>{record.name}</h1></div></div>
      <div className={layout.slotActions}><div className={detail.headerActions}><DetailBackButton fallbackHref="/commercial/customers" /><div className={detail.headerActionSeparator} /><Button variant="secondary" icon="check_circle" disabled={pending || record.status === "ACTIVE"} onClick={() => transition("activate")}>Activate</Button><Button variant="secondary" icon="block" disabled={pending || record.status === "INACTIVE"} onClick={() => transition("deactivate")}>Deactivate</Button><div className={detail.headerActionSeparator} /><Button variant="danger" icon="delete" aria-label="Delete customer" disabled={pending} onClick={() => setConfirm(true)} /></div></div>
      <div className={layout.slotAlert}><ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} /></div>
    </header>
    <aside className={layout.statusSection}>
      <section className={detail.card}><span className={typography.fieldLabel}>Status</span><Badge variant="soft" size="x-large" color={record.status === "ACTIVE" ? "success" : "neutral"}>{record.status}</Badge></section>
      <AuditPanel id={record.id} creationDate={new Date(record.createdAt).toISOString()} updatedDate={record.updatedAt ? new Date(record.updatedAt).toISOString() : ""} auditHref={detailLinkWithBackContext("/settings/audit?entityType=customer&entityId=" + record.id, "audit", pathname)} onNavigate={(href) => router.push(href)} />
    </aside>
    <main className={layout.mainSection + " " + detail.stack}><section className={detail.card}>
      <div className={detail.cardHeader}><h2 className={typography.sectionHeading + " " + detail.cardHeaderTitle}>Customer Details</h2><Button variant="secondary" icon="save" disabled={pending} onClick={save}>Save</Button></div>
      <CustomerFields categories={categories} priceLists={priceLists} value={value} onChange={setValue} pending={pending} hasError={validation.hasError} />
    </section></main>
    <ConfirmDialog isOpen={confirm} title="Delete Customer" message={"Permanently delete " + record.name + "?"} confirmLabel="Delete" confirmVariant="danger" onClose={() => setConfirm(false)} onConfirm={() => { setConfirm(false); transition("delete"); }} />
    <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
  </div>;
}
