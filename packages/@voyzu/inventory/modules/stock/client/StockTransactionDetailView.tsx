"use client";

import { Textarea } from "@voyzu/ui-components";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clientComponent } from "@voyzu/ui-surface/client";
const AuditPanel = clientComponent.use("audit.panel");
import {
  Badge,
  Breadcrumbs,
  Button,
  EditableGrid,
  Input,
  TabGroup,
  type EditableGridColumn,
  type TabDef,
} from "@voyzu/ui-components";
import { DetailBackButton, detailLinkWithBackContext } from "@voyzu/ui-surface/client";
import reportLayout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { StockActivityDetail, StockTransactionLine } from "../types/stock.types";
import type { StockCountOrganization } from "./StockCountReportTemplate";
import {
  StockTransactionReportTemplate,
  stockTransactionTypeLabel,
} from "./StockTransactionReportTemplate";
import {
  STOCK_ADJUSTMENT_REASONS,
  STOCK_ISSUE_REASONS,
  STOCK_RECEIPT_REASONS,
} from "../../core/types";

const reasonLabels = new Map<string, string>(
  [...STOCK_ADJUSTMENT_REASONS, ...STOCK_ISSUE_REASONS, ...STOCK_RECEIPT_REASONS]
    .map(({ code, label }) => [code, label]),
);

function detectMMDD(): boolean {
  try {
    const parts = new Intl.DateTimeFormat(undefined, { month: "numeric", day: "numeric" })
      .formatToParts(new Date(2000, 2, 15));
    return parts.findIndex((part) => part.type === "month")
      < parts.findIndex((part) => part.type === "day");
  } catch {
    return false;
  }
}

function formatDate(value: string, isMMDD: boolean): string {
  const date = new Date(value);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return isMMDD ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
}

const columns: EditableGridColumn<StockTransactionLine>[] = [
  { key: "sku", label: "SKU", type: "text", readOnly: true, width: 140 },
  { key: "itemName", label: "Item Name", type: "text", readOnly: true, width: 250 },
  { key: "warehouse", label: "Warehouse", type: "text", readOnly: true, width: 190 },
  {
    key: "quantityChange", label: "Quantity Change", type: "number", readOnly: true,
    align: "right", width: 128,
    format: (value) => `${Number(value) > 0 ? "+" : ""}${value}`,
  },
  {
    key: "reasonCode", label: "Reason", type: "text", readOnly: true, width: 180,
    format: (value) => value == null ? "—" : (reasonLabels.get(String(value)) ?? String(value)),
  },
];

export function StockTransactionDetailView({
  record,
  organization,
  backHref = "/inventory/stock-activity",
  printablePath: printablePathOverride,
}: {
  record: StockActivityDetail;
  organization: StockCountOrganization;
  backHref?: string;
  printablePath?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMMDD, setIsMMDD] = useState(false);
  const [generatedAt, setGeneratedAt] = useState("");
  useEffect(() => {
    setIsMMDD(detectMMDD());
    setGeneratedAt(new Date().toLocaleString(undefined, {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }));
  }, []);
  const mutationId = record.audit.updated.mutationId ?? record.audit.created.mutationId;
  const auditFilter = mutationId
    ? `mutationId=${encodeURIComponent(mutationId)}`
    : `entityType=inventory_transaction&entityId=${record.id}`;
  const documentType = stockTransactionTypeLabel(record.type);
  const printablePath = printablePathOverride
    ?? `/inventory/stock-activity/${encodeURIComponent(record.code)}/printable`;
  const pdfParams = new URLSearchParams({
    orientation: "portrait",
    path: printablePath,
    filename: `${record.type.toLowerCase().replaceAll("_", "-")}-${record.code}`,
  });
  const pdfViewPath = `/api/capability/pdf-view?${pdfParams.toString()}`;
  const pdfDownloadPath = `/api/capability/pdf?${pdfParams.toString()}`;

  const details = (
    <div className={reportLayout.detailsTab}>
      <main className={reportLayout.detailsMain}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Transaction Details</h2>
          <div className={detailStyles.formGrid}>
            <div className={detailStyles.fieldGroup}>
              <label className={typography.fieldLabel}>Code</label>
              <Input value={record.code} disabled />
            </div>
            <div className={detailStyles.fieldGroup}>
              <label className={typography.fieldLabel}>Date</label>
              <Input value={new Date(record.date).toLocaleString()} disabled />
            </div>
            <div className={detailStyles.fieldGroup}>
              <label className={typography.fieldLabel}>Reference</label>
              <Input value={record.reference ?? ""} disabled />
            </div>
            {record.notes ? (
              <div className={`${detailStyles.fieldGroup} ${detailStyles.fieldFull}`}>
                <label className={typography.fieldLabel}>Notes</label>
                <Textarea rows={2} value={record.notes} disabled readOnly />
              </div>
            ) : null}
          </div>
        </section>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Transaction Lines</h2>
          <EditableGrid columns={columns} initialRows={record.lines} emptyText="This transaction has no lines" ariaLabel="Stock transaction lines" />
        </section>
      </main>
      <aside className={reportLayout.detailsRail}>
        <div className={detailStyles.card}>
          <label className={typography.fieldLabel}>Activity Type</label>
          <Badge variant="soft" size="x-large" color="info">{documentType.toUpperCase()}</Badge>
        </div>
        <div className={`${detailStyles.card} ${detailStyles.stack}`}>
          <h2 className={typography.sectionHeading}>Linked Documents</h2>
          {record.linkedDocuments.length ? (
            <div className={detailStyles.stack}>
              {record.linkedDocuments.map((document) => (
                <div className={detailStyles.card} key={`${document.documentType}-${document.documentId}`}>
                  <div className={detailStyles.fieldHelp}>{document.documentType.replaceAll("_", " ")}</div>
                  <div className={detailStyles.summaryRow}>
                    {document.href ? <Link className={detailStyles.link} href={document.href}>{document.documentCode}</Link> : <span>{document.documentCode}</span>}
                    <span>{formatDate(document.creationDate, isMMDD)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className={detailStyles.fieldHelp}>No linked documents.</p>}
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
    </div>
  );

  const tabs: TabDef[] = [
    {
      key: "document",
      label: "Document",
      content: (
        <div className={reportLayout.tabContent}>
          <div className={reportLayout.toolbar}>
            <Button variant="secondary" icon="open_in_new" title="Printable Page" onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")} />
            <Button variant="secondary" icon="picture_as_pdf" title="View PDF" onClick={() => window.open(pdfViewPath, "_blank", "noopener,noreferrer")} />
            <Button variant="secondary" icon="download" title="Download PDF" onClick={() => { window.location.href = pdfDownloadPath; }} />
          </div>
          <div className={reportLayout.documentShell}>
            <div className={`${reportLayout.document} ${reportLayout.portraitDocument}`}>
              <StockTransactionReportTemplate record={record} organization={organization} generatedAt={generatedAt} />
            </div>
          </div>
        </div>
      ),
    },
    { key: "details", label: "Details", content: details },
  ];

  return (
    <div className={reportLayout.reportView}>
      <header className={reportLayout.reportHeader}>
        <div className={reportLayout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={reportLayout.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>history</span>
          </div>
          <div className={reportLayout.slotTitleText}>
            <h1 className={`${typography.pageTitle} ${reportLayout.pageTitleResponsive}`}>{documentType} {record.code}</h1>
          </div>
        </div>
        <div className={reportLayout.slotTitleActions}><DetailBackButton fallbackHref={backHref} /></div>
      </header>
      <div className={reportLayout.slotDocument}><TabGroup tabs={tabs} defaultKey="document" /></div>
    </div>
  );
}
