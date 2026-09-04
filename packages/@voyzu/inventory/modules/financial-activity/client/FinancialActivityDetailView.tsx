"use client";
import { usePathname, useRouter } from "next/navigation";
import { AuditPanel } from "@voyzu/audit/client";
import { Badge, Breadcrumbs, Input } from "@voyzu/ui-components";
import { DetailBackButton, detailLinkWithBackContext } from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { FinancialActivityDetail } from "../types/financial-activity.types";
import styles from "./financial-activity.module.css";

const label = (value: string) => value.replaceAll("_", " ");

export function FinancialActivityDetailView({ record }: { record: FinancialActivityDetail }) {
  const router = useRouter();
  const pathname = usePathname();
  const mutationId = record.audit.updated.mutationId ?? record.audit.created.mutationId;
  const auditFilter = mutationId
    ? `mutationId=${encodeURIComponent(mutationId)}`
    : `entityType=inventory_financial_activity&entityId=${record.id}`;

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={styles.titleTextBlock}>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{label(record.movementType)} {record.transactionCode}</h1>
          </div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref="/inventory/financial-activity" />
          </div>
        </div>
      </header>
      <aside className={layout.statusSection}>
        <div className={detailStyles.card}>
          <label className={typography.fieldLabel}>Status</label>
          <Badge variant="soft" size="x-large" color={record.status === "PROCESSED" ? "success" : "neutral"}>{label(record.status)}</Badge>
        </div>
        <AuditPanel
          id={record.id}
          creationDate={record.audit.created.date}
          updatedDate={record.audit.updated.date}
          creationActorType={record.audit.created.actorType}
          creationUser={record.audit.created.user}
          updatedActorType={record.audit.updated.actorType}
          updatedUser={record.audit.updated.user}
          auditHref={detailLinkWithBackContext(`/settings/audit?${auditFilter}`, "audit", pathname)}
          onNavigate={(href) => router.push(href)}
        />
      </aside>
      <main className={`${layout.mainSection} ${styles.stack}`}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Financial Activity Details</h2>
          <div className={styles.fields}>
            <div className={styles.field}><label className={typography.fieldLabel}>Movement Type</label><Input value={label(record.movementType)} disabled /></div>
            <div className={styles.field}><label className={typography.fieldLabel}>Original Reason Code</label><Input value={record.reasonCode} disabled /></div>
          </div>
        </section>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Inventory Movement</h2>
          <div className={styles.fields}>
            <div className={styles.field}><label className={typography.fieldLabel}>Item Code</label><Input value={record.itemCode} disabled /></div>
            <div className={styles.field}><label className={typography.fieldLabel}>Item Name</label><Input value={record.itemName} disabled /></div>
            <div className={styles.field}><label className={typography.fieldLabel}>Warehouse</label><Input value={record.warehouseName} disabled /></div>
            <div className={styles.field}><label className={typography.fieldLabel}>Quantity Change</label><Input value={String(record.quantityChange)} disabled /></div>
          </div>
        </section>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Inventory Transaction</h2>
          <div className={styles.fields}>
            <div className={styles.field}><label className={typography.fieldLabel}>Transaction Code</label><Input value={record.transactionCode} disabled /></div>
            <div className={styles.field}><label className={typography.fieldLabel}>Transaction Date</label><Input value={new Date(record.transactionDate).toLocaleString("en-NZ")} disabled /></div>
            <div className={styles.field}><label className={typography.fieldLabel}>Reference</label><Input value={record.reference ?? ""} disabled /></div>
            <div className={styles.field} style={{ gridColumn: "1 / -1" }}><label className={typography.fieldLabel}>Notes</label><textarea className={styles.textarea} value={record.notes} disabled /></div>
          </div>
        </section>
      </main>
    </div>
  );
}
