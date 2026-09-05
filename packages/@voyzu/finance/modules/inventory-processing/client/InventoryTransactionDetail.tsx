"use client";

import { CompanyAuditPanel, getStatusSemanticColor } from "@voyzu/finance/common/client";
import type { FinanceInventoryActivity } from "@voyzu/finance/types/modules/inventory-processing";
import { Badge, Breadcrumbs, Input } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { DetailBackButton } from "@voyzu/ui-surface/client";

import localStyles from "./inventory-processing.module.css";

const dateTime = (value: string | null) => value ? new Date(value).toLocaleString() : "";
const text = (value: string | number | null) => value == null ? "" : String(value);
const label = (value: string) => value.replaceAll("_", " ");

export function InventoryTransactionDetail({ activity }: { activity: FinanceInventoryActivity }) {
  const fields = [
    { label: "Finance Activity ID", value: activity.id },
    { label: "Inventory Activity ID", value: activity.inventoryFinancialActivityId },
    { label: "Inventory Transaction Line ID", value: activity.inventoryTransactionLineId },
    { label: "Inventory Document", value: activity.inventoryDocumentCode },
    { label: "Movement", value: label(activity.inventoryDocumentType) },
    { label: "Reason", value: activity.reasonCode ? label(activity.reasonCode) : null },
    { label: "Activity Date", value: dateTime(activity.activityDate) },
    { label: "Item ID", value: activity.itemId },
    { label: "Item Code", value: activity.itemCode },
    { label: "Item Name", value: activity.itemName },
    { label: "Quantity Change", value: activity.quantityChange },
  ];
  const financeDocumentFields = [
    { label: "Document Type", value: activity.financeDocumentType },
    { label: "Document ID", value: activity.financeDocumentId },
    { label: "Document Code", value: activity.financeDocumentCode },
    { label: "Processed At", value: dateTime(activity.processedAt) },
  ];

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>sync_alt</span></div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{activity.inventoryDocumentCode}</h1>
          </div>
        </div>
        <div className={layout.slotActions}><div className={detailStyles.headerActions}><DetailBackButton fallbackHref="/finance/integration/inventory-processing/inventory-transactions" /></div></div>
      </header>

      <aside className={layout.statusSection}>
        <div className={localStyles.statusRailStack}>
          <div className={detailStyles.card}>
            <div className={detailStyles.fieldGroup}>
              <label className={typography.fieldLabel}>Processing Status</label>
              <Badge variant="soft" size="x-large" color={getStatusSemanticColor(activity.processingStatus)}>{label(activity.processingStatus)}</Badge>
            </div>
          </div>
          <CompanyAuditPanel
            id={activity.id}
            creationDate={activity.audit.created.date}
            updatedDate={activity.audit.updated.date}
            creationActorType={activity.audit.created.actorType}
            creationUser={activity.audit.created.user}
            updatedActorType={activity.audit.updated.actorType}
            updatedUser={activity.audit.updated.user}
            auditHref={`/settings/audit?entityType=finance_inventory_activity&entityId=${activity.id}`}
            mutationId={activity.audit.updated.mutationId ?? activity.audit.created.mutationId}
          />
        </div>
      </aside>

      <main className={layout.mainSection}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Inventory Activity</h2>
          <div className={detailStyles.formGrid}>
            {fields.map((field) => <label key={field.label} className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>{field.label}</span><Input value={text(field.value)} disabled /></label>)}
          </div>
        </section>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Finance Document</h2>
          <div className={detailStyles.formGrid}>
            {financeDocumentFields.map((field) => <label key={field.label} className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>{field.label}</span><Input value={text(field.value)} disabled /></label>)}
          </div>
        </section>
      </main>
    </div>
  );
}
