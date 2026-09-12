"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuditPanel } from "@voyzu/components/audit-panel";
import { Badge, Breadcrumbs, Button, EditableGrid, Input, TabGroup, type EditableGridColumn, type TabDef } from "@voyzu/ui-components";
import reportLayout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { DetailBackButton, detailLinkWithBackContext } from "@voyzu/ui-surface/client";

import styles from "./inventory-processing.module.css";
import type { InventoryTransactionProjection, InventoryTransactionProjectionLine, InventoryTransactionProjectionOrganization } from "./inventory-transaction-projection.types";
import { InventoryTransactionReportTemplate, inventoryTransactionTypeLabel } from "./InventoryTransactionReportTemplate";

const reasonLabels: Record<string, string> = {
  STOCK_VARIANCE: "Stock variance", DAMAGED: "Damaged stock", MISSING: "Missing stock", FOUND: "Found stock",
  DATA_CORRECTION: "Data correction", OTHER: "Other", SALE: "Sale / customer fulfilment",
  INTERNAL_CONSUMPTION: "Internal consumption", WRITE_OFF_DAMAGED: "Write-off - damaged",
  WRITE_OFF_OTHER: "Write-off - other", SUPPLIER_RETURN: "Return to supplier", SAMPLE: "Sample / promotional use",
  PURCHASE: "Purchase / supplier receipt", CUSTOMER_RETURN: "Customer return", OPENING_STOCK: "Opening stock",
  PRODUCTION: "Produced / manufactured stock",
};

function detectMMDD(): boolean {
  try {
    const parts = new Intl.DateTimeFormat(undefined, { month: "numeric", day: "numeric" }).formatToParts(new Date(2000, 2, 15));
    return parts.findIndex((part) => part.type === "month") < parts.findIndex((part) => part.type === "day");
  } catch { return false; }
}

function formatDate(value: string, isMMDD: boolean): string {
  const date = new Date(value);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return isMMDD ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
}

const columns: EditableGridColumn<InventoryTransactionProjectionLine>[] = [
  { key: "sku", label: "SKU", type: "text", readOnly: true, width: 140 },
  { key: "itemName", label: "Item Name", type: "text", readOnly: true, width: 250 },
  { key: "warehouse", label: "Warehouse", type: "text", readOnly: true, width: 190 },
  { key: "quantityChange", label: "Quantity Change", type: "number", readOnly: true, align: "right", width: 128, format: (value) => `${Number(value) > 0 ? "+" : ""}${value}` },
  { key: "reasonCode", label: "Reason", type: "text", readOnly: true, width: 180, format: (value) => value == null ? "—" : (reasonLabels[String(value)] ?? String(value)) },
];

export function InventoryTransactionDetail({ record, organization, financeActivityId }: {
  record: InventoryTransactionProjection;
  organization: InventoryTransactionProjectionOrganization;
  financeActivityId: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMMDD, setIsMMDD] = useState(false);
  const [generatedAt, setGeneratedAt] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  useEffect(() => {
    setIsMMDD(detectMMDD());
    setGeneratedAt(new Date().toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }));
    setDisplayDate(new Date(record.date).toLocaleString());
  }, [record.date]);

  const mutationId = record.audit.updated.mutationId ?? record.audit.created.mutationId;
  const auditFilter = mutationId ? `mutationId=${encodeURIComponent(mutationId)}` : `entityType=inventory_transaction&entityId=${record.id}`;
  const documentType = inventoryTransactionTypeLabel(record.type);
  const printablePath = `/finance/integration/inventory-processing/inventory-transactions/${financeActivityId}/printable`;
  const pdfParams = new URLSearchParams({ orientation: "portrait", path: printablePath, filename: `${record.type.toLowerCase().replaceAll("_", "-")}-${record.code}` });

  const details = <div className={styles.detailsTab}>
    <main className={styles.detailsMain}>
      <section className={detailStyles.card}>
        <h2 className={typography.sectionHeading}>Transaction Details</h2>
        <div className={styles.fields}>
          <div className={styles.field}><label className={typography.fieldLabel}>Code</label><Input value={record.code} disabled /></div>
          <div className={styles.field}><label className={typography.fieldLabel}>Date</label><Input value={displayDate} disabled /></div>
          <div className={styles.field}><label className={typography.fieldLabel}>Reference</label><Input value={record.reference ?? ""} disabled /></div>
          {record.notes ? <div className={`${styles.field} ${styles.wide}`}><label className={typography.fieldLabel}>Notes</label><textarea className={styles.textarea} rows={2} value={record.notes} disabled readOnly /></div> : null}
        </div>
      </section>
      <section className={detailStyles.card}><h2 className={typography.sectionHeading}>Transaction Lines</h2><EditableGrid className={styles.gridWithoutHeaderIcons} columns={columns} initialRows={record.lines} emptyText="This transaction has no lines" ariaLabel="Stock transaction lines" /></section>
    </main>
    <aside className={styles.detailsRail}>
      <div className={detailStyles.card}><label className={typography.fieldLabel}>Activity Type</label><Badge variant="soft" size="x-large" color="info">{documentType.toUpperCase()}</Badge></div>
      <div className={`${detailStyles.card} ${styles.linkedDocumentsCard}`}>
        <h2 className={typography.sectionHeading}>Linked Documents</h2>
        {record.linkedDocuments.length ? <div className={styles.linkedDocumentList}>{record.linkedDocuments.map((document) => <div className={styles.linkedDocumentEntry} key={`${document.documentType}-${document.documentId}`}><div className={styles.linkedDocumentType}>{document.documentType.replaceAll("_", " ")}</div><div className={styles.linkedDocumentDetails}>{document.href ? <Link className={styles.documentLink} href={document.href}>{document.documentCode}</Link> : <span>{document.documentCode}</span>}<span>{formatDate(document.creationDate, isMMDD)}</span></div></div>)}</div> : <p className={styles.emptyLinkedDocuments}>No linked documents.</p>}
      </div>
      <AuditPanel id={record.id} creationDate={record.audit.created.date} updatedDate={record.audit.updated.date} creationActorType={record.audit.created.actorType} creationUser={record.audit.created.user} updatedActorType={record.audit.updated.actorType} updatedUser={record.audit.updated.user} auditHref={detailLinkWithBackContext(`/settings/audit?${auditFilter}`, "audit", pathname)} onNavigate={(href) => router.push(href)} />
    </aside>
  </div>;

  const tabs: TabDef[] = [
    { key: "document", label: "Document", content: <div className={styles.tabContent}><div className={styles.toolbar}><Button variant="secondary" icon="open_in_new" title="Printable Page" onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")} /><Button variant="secondary" icon="picture_as_pdf" title="View PDF" onClick={() => window.open(`/api/capability/pdf-view?${pdfParams.toString()}`, "_blank", "noopener,noreferrer")} /><Button variant="secondary" icon="download" title="Download PDF" onClick={() => { window.location.href = `/api/capability/pdf?${pdfParams.toString()}`; }} /></div><div className={styles.documentShell}><div className={`${reportLayout.document} ${styles.portraitDocument}`}><InventoryTransactionReportTemplate record={record} organization={organization} generatedAt={generatedAt} /></div></div></div> },
    { key: "details", label: "Details", content: details },
  ];

  return <div className={reportLayout.reportView}><header className={reportLayout.reportHeader}><div className={reportLayout.slotBreadcrumb}><Breadcrumbs /></div><div className={reportLayout.slotTitle}><div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>history</span></div><div className={reportLayout.slotTitleText}><h1 className={`${typography.pageTitle} ${reportLayout.pageTitleResponsive}`}>{documentType} {record.code}</h1></div></div><div className={reportLayout.slotTitleActions}><DetailBackButton fallbackHref="/finance/integration/inventory-processing/inventory-transactions" /></div></header><div className={reportLayout.slotDocument}><TabGroup tabs={tabs} defaultKey="document" /></div></div>;
}
