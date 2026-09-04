"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuditPanel } from "@voyzu/audit/client";
import {
  Badge,
  Breadcrumbs,
  EditableGrid,
  Input,
  type EditableGridColumn,
} from "@voyzu/ui-components";
import {
  DetailBackButton,
  detailLinkWithBackContext,
} from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  StockActivityDetail,
  StockTransactionLine,
} from "../types/stock.types";
import styles from "./stock.module.css";
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
    const parts = new Intl.DateTimeFormat(undefined, {
      month: "numeric",
      day: "numeric",
    }).formatToParts(new Date(2000, 2, 15));
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
  {
    key: "sku",
    label: "SKU",
    type: "text",
    readOnly: true,
    width: 150,
  },
  {
    key: "itemName",
    label: "Item Name",
    type: "text",
    readOnly: true,
    width: 288,
  },
  {
    key: "warehouse",
    label: "Warehouse",
    type: "text",
    readOnly: true,
    width: 220,
  },
  {
    key: "quantityChange",
    label: "Quantity Change",
    type: "number",
    readOnly: true,
    align: "right",
    width: 112,
    format: (value) => `${Number(value) > 0 ? "+" : ""}${value}`,
  },
  {
    key: "reasonCode",
    label: "Reason",
    type: "text",
    readOnly: true,
    width: 220,
    format: (value) => value == null ? "—" : (reasonLabels.get(String(value)) ?? String(value)),
  },
];

export function StockTransactionDetailView({
  record,
}: {
  record: StockActivityDetail;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMMDD, setIsMMDD] = useState(false);
  useEffect(() => setIsMMDD(detectMMDD()), []);
  const mutationId =
    record.audit.updated.mutationId ?? record.audit.created.mutationId;
  const auditFilter = mutationId
    ? `mutationId=${encodeURIComponent(mutationId)}`
    : `entityType=inventory_transaction&entityId=${record.id}`;
  const transactionType = record.type
    .toLowerCase()
    .replace(/(^|_)([a-z])/g, (_, prefix: string, letter: string) =>
      `${prefix ? " " : ""}${letter.toUpperCase()}`,
    );

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={styles.titleTextBlock}>
            <h1
              className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
            >
              Stock Transaction {record.code}
            </h1>
            <p className={typography.headingByline}>
              {transactionType} recorded on{" "}
              {new Date(record.date).toLocaleDateString("en-NZ")}.
            </p>
          </div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref="/inventory/stock-activity" />
          </div>
        </div>
      </header>

      <aside className={layout.statusSection}>
        <div className={detailStyles.card}>
          <label className={typography.fieldLabel}>Activity Type</label>
          <Badge variant="soft" size="x-large" color="info">
            {transactionType.toUpperCase()}
          </Badge>
        </div>
        <div className={`${detailStyles.card} ${styles.linkedDocumentsCard}`}>
          <h2 className={typography.sectionHeading}>Linked Documents</h2>
          {record.linkedDocuments.length ? (
            <div className={styles.linkedDocumentList}>
              {record.linkedDocuments.map((document) => (
                <div
                  className={styles.linkedDocumentEntry}
                  key={`${document.documentType}-${document.documentId}`}
                >
                  <div className={styles.linkedDocumentType}>
                    {document.documentType.replaceAll("_", " ")}
                  </div>
                  <div className={styles.linkedDocumentDetails}>
                    {document.href ? (
                      <Link className={styles.documentLink} href={document.href}>
                        {document.documentCode}
                      </Link>
                    ) : (
                      <span>{document.documentCode}</span>
                    )}
                    <span>
                      {formatDate(document.creationDate, isMMDD)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyLinkedDocuments}>No linked documents.</p>
          )}
        </div>
        <AuditPanel
          id={record.id}
          creationDate={record.audit.created.date}
          updatedDate={record.audit.updated.date}
          creationActorType={record.audit.created.actorType}
          creationUser={record.audit.created.user}
          updatedActorType={record.audit.updated.actorType}
          updatedUser={record.audit.updated.user}
          auditHref={detailLinkWithBackContext(
            `/settings/audit?${auditFilter}`,
            "audit",
            pathname,
          )}
          onNavigate={(href) => router.push(href)}
        />
      </aside>

      <main className={`${layout.mainSection} ${styles.stack}`}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>
            Transaction Details
          </h2>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={typography.fieldLabel}>Code</label>
              <Input value={record.code} disabled />
            </div>
            <div className={styles.field}>
              <label className={typography.fieldLabel}>Date</label>
              <Input
                value={new Date(record.date).toLocaleString("en-NZ")}
                disabled
              />
            </div>
            <div className={styles.field}>
              <label className={typography.fieldLabel}>Reference</label>
              <Input value={record.reference ?? ""} disabled />
            </div>
            {record.notes ? (
              <div className={`${styles.field} ${styles.wide}`}>
                <label className={typography.fieldLabel}>Notes</label>
                <textarea
                  className={`${styles.textarea} ${styles.completedStocktakeNotes}`}
                  rows={2}
                  value={record.notes}
                  disabled
                  readOnly
                />
              </div>
            ) : null}
          </div>
        </section>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>
            Transaction Lines
          </h2>
          <EditableGrid
            className={styles.gridWithoutHeaderIcons}
            columns={columns}
            initialRows={record.lines}
            emptyText="This transaction has no lines"
            ariaLabel="Stock transaction lines"
          />
        </section>
      </main>
    </div>
  );
}
