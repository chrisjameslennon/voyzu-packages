"use client";

import { useMemo } from "react";

import { CompanyPageTitleBadges, type DetailBackSource } from "@voyzu/core/common/client";
import type {
  ApLedgerEntryDocumentReportResponseDto,
  ApSubledgerEntryResponseDto,
} from "@voyzu/core/types/modules/ap-subledger";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import { Breadcrumbs, Button, Input, TabGroup, type TabDef } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { ApLedgerEntryDocumentReportTemplate } from "../templates/ApLedgerEntryDocumentReportTemplate";
import localStyles from "./ap-bill-report.module.css";

interface ApBillReportProps {
  entry: ApSubledgerEntryResponseDto;
  report: ApLedgerEntryDocumentReportResponseDto;
  from?: DetailBackSource;
  fromCode?: string;
}

function formatAmount(value: number | null | undefined): string {
  if (value == null) return "-";
  return value.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fieldValue(value: string | number | null | undefined): string {
  if (value == null || value === "") return "-";
  return String(value);
}

function ReadOnlyField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <label className={detailStyles.fieldGroup}>
      <span className={typography.fieldLabel}>{label}</span>
      <Input value={fieldValue(value)} disabled />
    </label>
  );
}

export function ApBillReport({ entry, report, from, fromCode }: ApBillReportProps) {
  const generatedAt = useMemo(
    () => new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    [],
  );
  const printablePath = `/finance/subledgers/ap/bills/${encodeURIComponent(report.documentId)}/printable`;
  const pdfParams = new URLSearchParams({
    orientation: "portrait",
    path: printablePath,
    filename: `ap-bill-${report.documentId}`,
  });
  const pdfViewPath = `/api/capability/pdf-view?${pdfParams.toString()}`;
  const pdfDownloadPath = `/api/capability/pdf?${pdfParams.toString()}`;
  const tabs: TabDef[] = [
    {
      key: "document",
      label: "Document",
      content: (
        <div className={localStyles.tabContent}>
          <div className={localStyles.toolbar}>
            <Button variant="secondary" icon="open_in_new" title="Printable Page" onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")} />
            <Button variant="secondary" icon="picture_as_pdf" title="View PDF" onClick={() => window.open(pdfViewPath, "_blank", "noopener,noreferrer")} />
            <Button variant="secondary" icon="download" title="Download PDF" onClick={() => { window.location.href = pdfDownloadPath; }} />
          </div>
          <div className={localStyles.documentShell}>
            <div className={`${layout.document} ${localStyles.portraitDocument}`}>
              <ApLedgerEntryDocumentReportTemplate report={report} generatedAt={generatedAt} />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "details",
      label: "Details",
      content: (
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Bill Details</h2>
          <div className={detailStyles.formGrid}>
            <ReadOnlyField label="Ledger Entry" value={entry.code} />
            <ReadOnlyField label="Document ID" value={report.documentId} />
            <ReadOnlyField label="Supplier Code" value={report.counterpartyCode} />
            <ReadOnlyField label="Supplier Name" value={report.counterpartyName} />
            <ReadOnlyField label="Document Date" value={report.documentDate} />
            <ReadOnlyField label="Posting Date" value={report.postingDate} />
            <ReadOnlyField label="Memo" value={report.memo} />
            <ReadOnlyField label="Description" value={report.description} />
            <ReadOnlyField label="Amount" value={formatAmount(entry.baseCurrencyAmount)} />
            <ReadOnlyField label="Applied Amount" value={formatAmount(entry.appliedAmount)} />
            <ReadOnlyField label="Open Balance" value={formatAmount(entry.openBalance)} />
            <ReadOnlyField label="Payment Status" value={entry.paymentStatus} />
          </div>
        </section>
      ),
    },
  ];

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>receipt_long</span></div>
          <div className={layout.slotTitleText}>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Bill {report.documentId}</h1>
            <CompanyPageTitleBadges />
          </div>
        </div>
        <div className={layout.slotTitleActions}>
          <DetailBackButton fallbackHref="/finance/subledgers/ap/bills" from={from} fromCode={fromCode} />
        </div>
      </header>
      <div className={layout.slotDocument}><TabGroup tabs={tabs} defaultKey="document" /></div>
    </div>
  );
}
