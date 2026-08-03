"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/core/company-audit/client";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import {
  CompanyPageTitleBadges,
  detailLinkWithBackContext,
  getStatusSemanticColor,
  type DetailBackSource,
} from "@voyzu/core/common/client";
import type { InventoryLedgerEntryDetailResponseDto } from "@voyzu/core/types/modules/inventory-ledger";
import {
  Badge,
  Breadcrumbs,
  Button,
  DataTable,
  DropdownMenu,
  Input,
  type DataTableColumn,
  type DropdownMenuItem,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import localStyles from "./inventory-ledger-entry-detail.module.css";

type InventoryLedgerLine = InventoryLedgerEntryDetailResponseDto["lines"][number] & { id: number };

const quantityFormat = new Intl.NumberFormat("en-NZ", { maximumFractionDigits: 2 });
const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatNumber(value: number | null | undefined) {
  return value == null ? "-" : quantityFormat.format(value);
}

function formatMoney(value: number | null | undefined) {
  return value == null ? "-" : moneyFormat.format(value);
}

function value(value: string | number | null) {
  if (value == null) return "";
  if (typeof value === "number") return moneyFormat.format(value);
  return value;
}

const lineColumns: DataTableColumn<InventoryLedgerLine>[] = [
  { key: "lineNumber", label: "Line", width: "6rem" },
  { key: "itemCode", label: "Item", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.itemCode}</span> },
  { key: "itemName", label: "Name", width: "16rem" },
  { key: "movement", label: "Movement", width: "10rem" },
  { key: "qtyDelta", label: "Qty Delta", width: "9rem", align: "right", render: (row) => formatNumber(row.qtyDelta) },
  { key: "unitValueSupplied", label: "Unit Value", width: "10rem", align: "right", render: (row) => formatMoney(row.unitValueSupplied) },
  { key: "bookValueDelta", label: "Book Value", width: "10rem", align: "right", render: (row) => formatMoney(row.bookValueDelta) },
  { key: "qtyBalance", label: "Qty Balance", width: "10rem", align: "right", render: (row) => formatNumber(row.qtyBalance) },
  { key: "bookValueBalance", label: "Book Balance", width: "11rem", align: "right", render: (row) => formatMoney(row.bookValueBalance) },
];

export function InventoryLedgerEntryDetail({
  entry,
  from,
  fromCode,
}: {
  entry: InventoryLedgerEntryDetailResponseDto;
  from?: DetailBackSource;
  fromCode?: string;
}) {
  const router = useRouter();
  const [documentVisible, setDocumentVisible] = useState(false);
  const [calculationsVisible, setCalculationsVisible] = useState(false);
  const debit = entry.lines.reduce((sum, line) => sum + Math.max(line.bookValueDelta, 0), 0);
  const credit = entry.lines.reduce((sum, line) => sum + Math.max(-line.bookValueDelta, 0), 0);
  const fields: Array<{ label: string; value: string }> = [
    { label: "Entry #", value: value(entry.code) },
    { label: "Journal", value: value(entry.journalCode) },
    { label: "Posting Date", value: value(entry.postingDate) },
    { label: "Document Date", value: value(entry.documentDate) },
    { label: "Document", value: value(entry.sourceDocument) },
    { label: "Document ID", value: value(entry.documentId) },
    { label: "Control Account", value: `${entry.controlAccountCode} - ${entry.controlAccountName}` },
    { label: "GL Account", value: `${entry.glAccountCode} - ${entry.glAccountName}` },
    { label: "Description", value: value(entry.description) },
    { label: "Memo", value: value(entry.memo) },
  ];
  const viewItems: DropdownMenuItem[] = [
    {
      value: "journal",
      label: "View Journal",
      icon: "account_balance",
      onSelect: () =>
        router.push(
          detailLinkWithBackContext(
            `/finance/journals/${encodeURIComponent(entry.journalCode)}`,
            "inventoryLedgerEntry",
            entry.code,
          ),
        ),
    },
    {
      value: "original-document",
      label: "View Original Document Supplied",
      icon: "description",
      disabled: Object.keys(entry.documentSnapshot).length === 0,
      onSelect: () => setDocumentVisible(true),
    },
    {
      value: "calculations",
      label: "View Calculations",
      icon: "functions",
      disabled: Object.keys(entry.detailedDocumentSnapshot).length === 0,
      onSelect: () => setCalculationsVisible(true),
    },
  ];

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>inventory_2</span></div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{entry.code}</h1>
          </div>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}><DetailBackButton fallbackHref={"/finance/inventory/ledger"} from={from} fromCode={fromCode} /></div>
        </div>
      </header>

      <aside className={layout.statusSection}>
        <div className={localStyles.statusRailStack}>
          <div className={detailStyles.card}>
            <div className={detailStyles.fieldGroup}>
              <label className={typography.fieldLabel}>Status</label>
              <Badge variant="soft" size="x-large" color={getStatusSemanticColor(entry.status)}>{entry.status}</Badge>
            </div>
          </div>
          <div className={detailStyles.systemCard}>
            <h3 className={detailStyles.systemTitle}>Balance</h3>
            <div className={detailStyles.summaryBody}>
              <div className={detailStyles.summaryRow}>
                <span className={detailStyles.summaryLabel}>Total DR</span>
                <strong className={detailStyles.summaryValue}>{moneyFormat.format(debit)}</strong>
              </div>
              <div className={detailStyles.summaryRow}>
                <span className={detailStyles.summaryLabel}>Total CR</span>
                <strong className={detailStyles.summaryValue}>{moneyFormat.format(credit)}</strong>
              </div>
              <div className={`${detailStyles.summaryRow} ${detailStyles.summaryTotal}`}>
                <span className={detailStyles.summaryLabel}>Balance</span>
                <strong className={detailStyles.summaryValue}>{moneyFormat.format(debit - credit)}</strong>
              </div>
            </div>
          </div>
          <div className={detailStyles.systemCard}>
            <DropdownMenu
              trigger={<Button variant="secondary" icon="visibility" className={detailStyles.fullWidthAction} textAlign="center">View</Button>}
              items={viewItems}
              caret
              alignment="left"
              width={300}
            />
          </div>
          <AuditPanel
            id={entry.id}
            creationDate={entry.audit.created.date}
            updatedDate={entry.audit.updated.date}
            creationActorType={entry.audit.created.actorType}
            creationUser={entry.audit.created.user}
            updatedActorType={entry.audit.updated.actorType}
            updatedUser={entry.audit.updated.user}
            auditHref={`/finance/audit?entityType=inventory_ledger_entry&entityId=${entry.id}`}
            mutationId={entry.audit.updated.mutationId ?? entry.audit.created.mutationId}
          />
        </div>
      </aside>

      <main className={layout.mainSection}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Inventory Ledger Entry</h2>
          <div className={detailStyles.formGrid}>
            {fields.map((field) => (
              <label key={field.label} className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>{field.label}</span><Input value={field.value} disabled /></label>
            ))}
          </div>
        </section>

        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Lines</h2>
          <DataTable
            columns={lineColumns}
            rows={entry.lines as InventoryLedgerLine[]}
            selectedIds={new Set<number>()}
            isAllSelected={false}
            isSomeSelected={false}
            onSelectAll={() => {}}
            onSelectOne={() => {}}
            currentPage={1}
            totalPages={1}
            onPageChange={() => undefined}
            totalCount={entry.lines.length}
            filteredCount={entry.lines.length}
            itemLabel="lines"
            hasData={entry.lines.length > 0}
            emptyIcon="inventory_2"
            emptyTitle="No lines found"
            emptyText="This inventory ledger entry has no lines"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.itemCode}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.itemName}</span></div><div className={listStyles.mobileMeta}>{row.movement} - {formatNumber(row.qtyDelta)} - {formatMoney(row.bookValueDelta)}</div></div>}
          />
        </section>
      </main>

      {documentVisible && (
        <JsonModal title={`Document - ${entry.code}`} value={entry.documentSnapshot} onClose={() => setDocumentVisible(false)} />
      )}
      {calculationsVisible && (
        <JsonModal title={`Calculations - ${entry.code}`} value={entry.detailedDocumentSnapshot} onClose={() => setCalculationsVisible(false)} />
      )}
    </div>
  );
}

function JsonModal({
  title,
  value: modalValue,
  onClose,
}: {
  title: string;
  value: Record<string, unknown> | undefined;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(modalValue ?? {}, null, 2);
  const copy = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={localStyles.modalOverlay} onClick={onClose}>
      <div className={localStyles.modal} onClick={(event) => event.stopPropagation()}>
        <header className={localStyles.modalHeader}>
          <strong>{title}</strong>
          <div className={localStyles.modalActions}>
            <Button variant="secondary" icon={copied ? "check" : "content_copy"} onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="plain" icon="close" title="Close" onClick={onClose} />
          </div>
        </header>
        <pre className={localStyles.modalCode}>{text}</pre>
      </div>
    </div>
  );
}

