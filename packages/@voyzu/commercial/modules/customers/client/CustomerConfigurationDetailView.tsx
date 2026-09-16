"use client";
import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuditPanel } from "@voyzu/ui-business-components";
import { DetailBackButton, detailLinkWithBackContext } from "@voyzu/ui-surface/client";
import { Badge, Breadcrumbs, Button, ConfirmDialog, Toast, ValidationAlert } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { customerConfigurationMeta, type CustomerConfiguration, type CustomerConfigurationInput, type CustomerConfigurationKind } from "../types/customer-configuration.dto";
import { saveCustomerConfigurationAction, transitionCustomerConfigurationAction } from "../server/actions/customer-configuration.actions";
import { CustomerConfigurationFields, useConfigurationValidation } from "./CustomerConfigurationFields";
const inputOf = ({ code, name, description, direction, method, value }: CustomerConfiguration): CustomerConfigurationInput => ({ code, name, description, direction, method, value });
export function CustomerConfigurationDetailView({ initial, kind }: { initial: CustomerConfiguration; kind: CustomerConfigurationKind }) {
  const meta = customerConfigurationMeta[kind];
  const router = useRouter(), pathname = usePathname();
  const [record, setRecord] = useState(initial);
  const [value, setValue] = useState(() => inputOf(initial));
  const [error, setError] = useState(""), [toast, setToast] = useState(""), [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  const validation = useConfigurationValidation(value);
  const save = () => {
    setError(""); if (!validation.attempt()) return;
    startTransition(async () => {
      try { const result = await saveCustomerConfigurationAction(kind, value, record.code); if (!result.record) { setError(result.error ?? "Unable to save."); return; } setRecord(result.record); setValue(inputOf(result.record)); validation.reset(); setToast(meta.singular + " saved"); router.refresh(); }
      catch { setError("Unable to save. Please try again."); }
    });
  };
  const transition = (operation: "activate" | "deactivate" | "delete") => {
    setError(""); startTransition(async () => {
      try { const result = await transitionCustomerConfigurationAction(kind, [record.code], operation); if (result.error) { setError(result.error); return; } if (operation === "delete") { router.push(meta.href); router.refresh(); return; } if (result.record) setRecord(result.record); setToast(operation === "activate" ? meta.singular + " activated" : meta.singular + " deactivated"); router.refresh(); }
      catch { setError("Unable to update. Please try again."); }
    });
  };
  return <div className={layout.detailView + " " + layout.detailViewWithStatusRail}>
    <header className={layout.detailHeader}>
      <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
      <div className={layout.slotTitle}><div className={detail.title}><div className={detail.titleIcon}><span className={"material-symbols-outlined " + detail.titleIconSymbol}>group</span></div><h1 className={typography.pageTitle + " " + layout.pageTitleResponsive}>{record.name}</h1></div></div>
      <div className={layout.slotActions}><div className={detail.headerActions}><DetailBackButton fallbackHref={meta.href} /><div className={detail.headerActionSeparator} /><Button variant="secondary" icon="check_circle" disabled={pending || record.status === "ACTIVE"} onClick={() => transition("activate")}>Activate</Button><Button variant="secondary" icon="block" disabled={pending || record.status === "INACTIVE"} onClick={() => transition("deactivate")}>Deactivate</Button><div className={detail.headerActionSeparator} /><Button variant="danger" icon="delete" aria-label={"Delete " + meta.singular} disabled={pending} onClick={() => setConfirm(true)} /></div></div>
      <div className={layout.slotAlert}><ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} /></div>
    </header>
    <aside className={layout.statusSection}>
      <section className={detail.card}><span className={typography.fieldLabel}>Status</span><Badge variant="soft" size="x-large" color={record.status === "ACTIVE" ? "success" : "neutral"}>{record.status}</Badge>{record.count > 0 && <><span className={typography.fieldLabel}>Usage</span><Badge variant="soft" size="large" color="info">IN USE</Badge></>}</section>
      <AuditPanel id={record.id} creationDate={new Date(record.createdAt).toISOString()} updatedDate={record.updatedAt ? new Date(record.updatedAt).toISOString() : ""} auditHref={detailLinkWithBackContext("/settings/audit?entityType=customer-" + kind + "&entityId=" + record.id, "audit", pathname)} onNavigate={(href) => router.push(href)} />
    </aside>
    <main className={layout.mainSection + " " + detail.stack}><section className={detail.card}>
      <div className={detail.cardHeader}><h2 className={typography.sectionHeading + " " + detail.cardHeaderTitle}>{meta.singular} Details</h2><Button variant="secondary" icon="save" disabled={pending} onClick={save}>Save</Button></div>
      <CustomerConfigurationFields kind={kind} value={value} onChange={setValue} pending={pending} hasError={validation.hasError} />
    </section>
      <section className={detail.card}><div className={detail.cardHeader}><h2 className={typography.sectionHeading + " " + detail.cardHeaderTitle}>Customers ({record.count})</h2></div><div className={detail.tableWrap}><table className={detail.table}><thead><tr><th>Customer Code</th><th>Name</th></tr></thead><tbody>{record.usedBy.map((customer) => <tr key={customer.id}><td><a className={typography.link} href={"/commercial/customers/" + encodeURIComponent(customer.code)}>{customer.code}</a></td><td>{customer.name}</td></tr>)}{!record.usedBy.length && <tr><td colSpan={2} className={detail.emptyCell}>No customers linked.</td></tr>}</tbody></table></div></section>
    </main>
    <ConfirmDialog isOpen={confirm} title={"Delete " + meta.singular} message={"Permanently delete " + record.name + "?"} confirmLabel="Delete" confirmVariant="danger" onClose={() => setConfirm(false)} onConfirm={() => { setConfirm(false); transition("delete"); }} />
    <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
  </div>;
}
