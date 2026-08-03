"use client";

import { AuditPanel } from "@voyzu/audit/client";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import {
  CompanyPageTitleBadges,
  detailLinkWithBackContext,
  getDrCrColor,
  getStatusSemanticColor,
  type DetailBackSource,
} from "@voyzu/core/common/client";
import type { TaxSubledgerEntryResponseDto } from "@voyzu/core/types/modules/tax-ledger";
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
import localStyles from "./tax-ledger-entry-detail.module.css";

type TaxLine = TaxSubledgerEntryResponseDto["taxLines"][number] & { id: number };

const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percentFormat = new Intl.NumberFormat("en-NZ", { maximumFractionDigits: 4 });

function formatMoney(value: number | null | undefined) {
  return value == null ? "-" : moneyFormat.format(value);
}

function formatPercent(value: number | null | undefined) {
  return value == null ? "-" : percentFormat.format(value);
}

function value(value: string | number | boolean | null | undefined) {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return moneyFormat.format(value);
  return value;
}

const lineColumns: DataTableColumn<TaxLine>[] = [
  { key: "lineNumber", label: "Line", width: "6rem" },
  { key: "taxRuleCode", label: "Tax Rule", width: "11rem", render: (row) => <span className={listStyles.codeCell}>{row.taxRuleCode}</span> },
  { key: "taxControlAccountCode", label: "Movement", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.taxControlAccountCode}</span> },
  { key: "taxAuthorityCode", label: "Authority", width: "10rem", render: (row) => <span className={listStyles.codeCell}>{row.taxAuthorityCode}</span> },
  { key: "taxRate", label: "Rate", width: "8rem", align: "right", render: (row) => formatPercent(row.taxRate) },
  { key: "taxableBaseCurrencyAmount", label: "Taxable", width: "10rem", align: "right", render: (row) => formatMoney(row.taxableBaseCurrencyAmount) },
  { key: "drCr", label: "DR / CR", width: "7rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={getDrCrColor(row.drCr)}>{row.drCr}</Badge> },
  { key: "baseCurrencyAmount", label: "Amount", width: "10rem", align: "right", render: (row) => formatMoney(row.baseCurrencyAmount) },
];

export function TaxLedgerEntryDetail({
  entry,
  from,
  fromCode,
}: {
  entry: TaxSubledgerEntryResponseDto;
  from?: DetailBackSource;
  fromCode?: string;
}) {
  const router = useRouter();
  const [documentVisible, setDocumentVisible] = useState(false);
  const [calculationsVisible, setCalculationsVisible] = useState(false);
  const lines = entry.taxLines.map((line, index) => ({ ...line, id: index + 1 }));
  const debit = entry.entryType === "DEBIT" ? entry.baseCurrencyAmount : 0;
  const credit = entry.entryType === "CREDIT" ? entry.baseCurrencyAmount : 0;
  const fields: Array<{ label: string; value: string }> = [
    { label: "Entry #", value: value(entry.code) },
    { label: "Journal", value: value(entry.journalCode) },
    { label: "Posting Date", value: value(entry.postingDate) },
    { label: "Document Date", value: value(entry.documentDate) },
    { label: "Document", value: value(entry.documentTypeLabel) },
    { label: "Document ID", value: value(entry.documentId) },
    { label: "Tax Rule", value: value(entry.taxRuleCode) },
    { label: "Tax Control Account", value: value(entry.taxControlAccountCode) },
    { label: "Tax Authority", value: `${entry.taxAuthorityCode} - ${entry.taxAuthorityName}` },
    { label: "Description", value: value(entry.description) },
    { label: "Bank / Cash Details", value: value(entry.hasBankCashDetails) },
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
            "taxLedgerEntry",
            entry.code,
          ),
        ),
    },
    {
      value: "bank-cash",
      label: "View Bank / Cash Details",
      icon: "account_balance",
      disabled: !entry.hasBankCashDetails,
    },
    {
      value: "ar",
      label: "View Accounts Receivable",
      icon: "receipt_long",
      disabled: !entry.arSubledgerEntryCode,
      onSelect: () => {
        if (!entry.arSubledgerEntryCode) return;
        router.push(
          detailLinkWithBackContext(
            `/finance/subledgers/ar/ledger-entries/${encodeURIComponent(entry.arSubledgerEntryCode)}`,
            "taxLedgerEntry",
            entry.code,
          ),
        );
      },
    },
    {
      value: "ap",
      label: "View Accounts Payable",
      icon: "receipt_long",
      disabled: !entry.apSubledgerEntryCode,
      onSelect: () => {
        if (!entry.apSubledgerEntryCode) return;
        router.push(
          detailLinkWithBackContext(
            `/finance/subledgers/ap/ledger-entries/${encodeURIComponent(entry.apSubledgerEntryCode)}`,
            "taxLedgerEntry",
            entry.code,
          ),
        );
      },
    },
    {
      value: "original-document",
      label: "View Original Document Supplied",
      icon: "description",
      disabled: !entry.documentSnapshot,
      onSelect: () => setDocumentVisible(true),
    },
    {
      value: "calculations",
      label: "View Calculations",
      icon: "functions",
      disabled: !entry.detailedDocumentSnapshot,
      onSelect: () => setCalculationsVisible(true),
    },
  ];

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>receipt_long</span></div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{entry.code}</h1>
          </div>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}><DetailBackButton fallbackHref={"/finance/subledgers/tax/ledger-entries"} from={from} fromCode={fromCode} /></div>
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
            auditHref={`/finance/audit?entityType=tax_ledger_entry&entityId=${entry.id}`}
            mutationId={entry.audit.updated.mutationId ?? entry.audit.created.mutationId}
          />
        </div>
      </aside>

      <main className={layout.mainSection}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Tax Ledger Entry</h2>
          <div className={detailStyles.formGrid}>
            {fields.map((field) => (
              <label key={field.label} className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>{field.label}</span><Input value={field.value} disabled /></label>
            ))}
          </div>
        </section>

        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Tax Lines</h2>
          <DataTable
            columns={lineColumns}
            rows={lines}
            selectedIds={new Set<number>()}
            isAllSelected={false}
            isSomeSelected={false}
            onSelectAll={() => {}}
            onSelectOne={() => {}}
            currentPage={1}
            totalPages={1}
            onPageChange={() => undefined}
            totalCount={lines.length}
            filteredCount={lines.length}
            itemLabel="lines"
            hasData={lines.length > 0}
            emptyIcon="receipt_long"
            emptyTitle="No lines found"
            emptyText="This tax ledger entry has no tax lines"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.taxControlAccountCode}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.taxAuthorityCode}</span></div><div className={listStyles.mobileMeta}>{row.drCr} - {formatMoney(row.baseCurrencyAmount)}</div></div>}
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

