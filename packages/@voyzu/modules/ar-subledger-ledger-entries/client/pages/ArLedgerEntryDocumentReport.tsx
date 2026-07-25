"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/modules/company-audit/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { detailLinkWithBackContext, getStatusSemanticColor, type DetailBackSource } from "@voyzu/modules/common/client";
import type {
    ArLedgerEntryDocumentReportResponseDto,
    ArSubledgerEntryResponseDto,
} from "@voyzu/types/modules/ar-subledger";
import {
    Badge,
    Breadcrumbs,
    Button,
    Checkbox,
    DropdownMenu,
    Input,
    TabGroup,
    type DropdownMenuItem,
    type TabDef,
} from "@voyzu/ui-components";
import detailLayout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import reportLayout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { ArLedgerEntryDocumentReportTemplate } from "../templates/ArLedgerEntryDocumentReportTemplate";
import localStyles from "./ar-ledger-entry-document-report.module.css";

interface ArLedgerEntryDocumentReportProps {
  entry: ArSubledgerEntryResponseDto;
  report: ArLedgerEntryDocumentReportResponseDto;
  organizationName?: string;
  from?: DetailBackSource;
  fromCode?: string;
}

const moneyFormat = new Intl.NumberFormat("en-NZ", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatAmount(value: number | null | undefined) {
  if (value == null) return "-";
  return moneyFormat.format(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

function fieldValue(value: string | number | null | undefined) {
  if (value == null || value === "") return "-";
  if (typeof value === "number") return formatAmount(value);
  return value;
}

function ReadOnlyField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <label className={detailStyles.fieldGroup}>
      <span className={typography.fieldLabel}>{label}</span>
      <Input value={fieldValue(value)} disabled />
    </label>
  );
}

function DocumentTab({
  report,
  organizationName,
}: {
  report: ArLedgerEntryDocumentReportResponseDto;
  organizationName: string;
}) {
  const [showOrganization, setShowOrganization] = useState(false);

  const generatedAt = useMemo(
    () =>
      new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  const optionItems: DropdownMenuItem[] = [
    {
      value: "show-organization",
      label: (
        <span className={localStyles.checkboxOption}>
          <Checkbox checked={showOrganization} onChange={() => undefined} tabIndex={-1} />
          <span>Show organization name</span>
        </span>
      ),
      onSelect: () => setShowOrganization((value) => !value),
    },
  ];

  return (
    <div className={localStyles.reportTab}>
      <div className={localStyles.toolbar}>
        <DropdownMenu
          trigger={<Button variant="plain" icon="tune" title="Options" />}
          items={optionItems}
          alignment="right"
          closeOnSelect={false}
        />
        <div className={localStyles.divider} />
        <Button variant="secondary" icon="open_in_new" title="Printable Page" disabled />
        <Button variant="secondary" icon="picture_as_pdf" title="View PDF" disabled />
        <Button variant="secondary" icon="download" title="Download PDF" disabled />
      </div>
      <div className={localStyles.documentShell}>
        <div className={reportLayout.document} style={{ maxWidth: "210mm" }}>
          <ArLedgerEntryDocumentReportTemplate
            report={report}
            generatedAt={generatedAt}
            organizationName={organizationName}
            showOrganization={showOrganization}
          />
        </div>
      </div>
    </div>
  );
}

function DetailsTab({ entry }: { entry: ArSubledgerEntryResponseDto }) {
  return (
    <section className={detailStyles.card}>
      <h2 className={typography.sectionHeading}>AR Ledger Entry</h2>
      <div className={detailStyles.formGrid}>
        <ReadOnlyField label="Entry #" value={entry.code} />
        <ReadOnlyField label="Journal" value={entry.journalCode} />
        <ReadOnlyField label="Posting Date" value={formatDate(entry.postingDate)} />
        <ReadOnlyField label="Document Date" value={formatDate(entry.documentDate)} />
        <ReadOnlyField label="Document" value={entry.documentTypeLabel} />
        <ReadOnlyField label="Document ID" value={entry.documentId} />
        <ReadOnlyField label="Counterparty" value={`${entry.counterpartyCode} - ${entry.counterpartyName}`} />
        <ReadOnlyField label="Control Account" value={`${entry.controlAccountCode} - ${entry.controlAccountName}`} />
        <ReadOnlyField label="GL Account" value={`${entry.glAccountCode} - ${entry.glAccountName}`} />
        <ReadOnlyField label="DR / CR" value={entry.entryType} />
        <ReadOnlyField label="Amount" value={entry.baseCurrencyAmount} />
        <ReadOnlyField label="Open Balance" value={entry.openBalance} />
        <ReadOnlyField label="Payment Status" value={entry.paymentStatus} />
        <ReadOnlyField label="Description" value={entry.description} />
        <ReadOnlyField label="Memo" value={entry.memo} />
      </div>
    </section>
  );
}

export function ArLedgerEntryDocumentReport({
  entry,
  report,
  organizationName = "",
  from,
  fromCode,
}: ArLedgerEntryDocumentReportProps) {
  const router = useRouter();
  const [documentVisible, setDocumentVisible] = useState(false);
  const [calculationsVisible, setCalculationsVisible] = useState(false);
  const debit = entry.entryType === "DEBIT" ? entry.baseCurrencyAmount : 0;
  const credit = entry.entryType === "CREDIT" ? entry.baseCurrencyAmount : 0;
  const tabs: TabDef[] = [
    {
      key: "document",
      label: "Document",
      content: <DocumentTab report={report} organizationName={organizationName} />,
    },
    {
      key: "details",
      label: "Details",
      content: <DetailsTab entry={entry} />,
    },
  ];

  const viewItems: DropdownMenuItem[] = [
    {
      value: "journal",
      label: "View Journal",
      icon: "account_balance",
      onSelect: () =>
        router.push(
          detailLinkWithBackContext(`/finance/journals/${encodeURIComponent(entry.journalCode)}`, "arLedgerEntry", entry.code),
        ),
    },
    {
      value: "bank-cash",
      label: "View Bank / Cash Details",
      icon: "account_balance",
      disabled: !entry.hasBankCashDetails,
    },
    {
      value: "tax",
      label: "View Tax",
      icon: "receipt_long",
      disabled: !entry.taxLedgerEntryCode,
      onSelect: () => {
        if (!entry.taxLedgerEntryCode) return;
        router.push(
          detailLinkWithBackContext(
            `/finance/subledgers/tax/ledger-entries/${encodeURIComponent(entry.taxLedgerEntryCode)}`,
            "arLedgerEntry",
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
    <div className={`${detailLayout.detailView} ${detailLayout.detailViewWithStatusRail}`}>
      <header className={detailLayout.detailHeader}>
        <div className={detailLayout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={detailLayout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}>
              <span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>receipt_long</span>
            </div>
            <h1 className={`${typography.pageTitle} ${detailLayout.pageTitleResponsive}`}>{entry.code}</h1>
          </div>
        </div>
        <div className={detailLayout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={"/finance/subledgers/ar/ledger-entries"} from={from} fromCode={fromCode} />
          </div>
        </div>
      </header>

      <aside className={detailLayout.statusSection}>
        <div className={localStyles.statusRailStack}>
          <div className={detailStyles.card}>
            <div className={detailStyles.fieldGroup}>
              <label className={typography.fieldLabel}>Status</label>
              <Badge variant="soft" size="x-large" color={getStatusSemanticColor(entry.status)}>
                {entry.status}
              </Badge>
            </div>
          </div>
          <div className={detailStyles.systemCard}>
            <h3 className={detailStyles.systemTitle}>Balance</h3>
            <div className={detailStyles.summaryBody}>
              <div className={detailStyles.summaryRow}>
                <span className={detailStyles.summaryLabel}>Total DR</span>
                <strong className={detailStyles.summaryValue}>{formatAmount(debit)}</strong>
              </div>
              <div className={detailStyles.summaryRow}>
                <span className={detailStyles.summaryLabel}>Total CR</span>
                <strong className={detailStyles.summaryValue}>{formatAmount(credit)}</strong>
              </div>
              <div className={`${detailStyles.summaryRow} ${detailStyles.summaryTotal}`}>
                <span className={detailStyles.summaryLabel}>Balance</span>
                <strong className={detailStyles.summaryValue}>{formatAmount(debit - credit)}</strong>
              </div>
            </div>
          </div>
          <div className={detailStyles.systemCard}>
            <DropdownMenu
              trigger={
                <Button variant="secondary" icon="visibility" className={detailStyles.fullWidthAction} textAlign="center">
                  View
                </Button>
              }
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
            auditHref={`/finance/audit?entityType=ar_subledger_entry&entityId=${entry.id}`}
            mutationId={entry.audit.updated.mutationId ?? entry.audit.created.mutationId}
          />
        </div>
      </aside>

      <main className={detailLayout.mainSection}>
        <TabGroup tabs={tabs} defaultKey="document" />
      </main>

      {documentVisible && (
        <JsonModal
          title={`Document - ${entry.code}`}
          value={entry.documentSnapshot}
          onClose={() => setDocumentVisible(false)}
        />
      )}
      {calculationsVisible && (
        <JsonModal
          title={`Calculations - ${entry.code}`}
          value={entry.detailedDocumentSnapshot}
          onClose={() => setCalculationsVisible(false)}
        />
      )}
    </div>
  );
}

function JsonModal({
  title,
  value,
  onClose,
}: {
  title: string;
  value: Record<string, unknown> | undefined;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(value ?? {}, null, 2);

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
