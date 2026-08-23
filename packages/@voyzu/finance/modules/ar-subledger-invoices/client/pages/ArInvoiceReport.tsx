"use client";

import { useMemo } from "react";

import { CompanyPageTitleBadges, type DetailBackSource } from "@voyzu/finance/common/client";
import type { ArInvoiceStatementResponseDto } from "@voyzu/finance/types/modules/ar-subledger";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import { Breadcrumbs, Button, Input, TabGroup, type TabDef } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { ArInvoiceReportTemplate } from "../templates/ArInvoiceReportTemplate";
import localStyles from "./ar-invoice-report.module.css";

interface ArInvoiceReportProps {
  statement: ArInvoiceStatementResponseDto;
  from?: DetailBackSource;
  fromCode?: string;
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ReadOnlyField({ label, value }: { label: string; value: string | number | null }) {
  return (
    <label className={detailStyles.fieldGroup}>
      <span className={typography.fieldLabel}>{label}</span>
      <Input value={value == null || value === "" ? "-" : String(value)} disabled />
    </label>
  );
}

export function ArInvoiceReport({ statement, from, fromCode }: ArInvoiceReportProps) {
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
  const { invoice } = statement;
  const printablePath = `/finance/subledgers/ar/invoices/${encodeURIComponent(invoice.document_id)}/printable`;
  const pdfParams = new URLSearchParams({
    orientation: "portrait",
    path: printablePath,
    filename: `ar-invoice-${invoice.document_id}`,
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
              <ArInvoiceReportTemplate statement={statement} generatedAt={generatedAt} />
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
          <h2 className={typography.sectionHeading}>Invoice Details</h2>
          <div className={detailStyles.formGrid}>
            <ReadOnlyField label="Invoice Entry" value={statement.invoiceEntryCode} />
            <ReadOnlyField label="Document ID" value={invoice.document_id} />
            <ReadOnlyField label="Counterparty Code" value={statement.counterpartyCode} />
            <ReadOnlyField label="Counterparty Name" value={statement.counterpartyName} />
            <ReadOnlyField label="Invoice Date" value={invoice.invoice_date} />
            <ReadOnlyField label="Posting Date" value={invoice.posting_date} />
            <ReadOnlyField label="Memo" value={invoice.document_memo} />
            <ReadOnlyField label="Description" value={invoice.generated_description} />
            <ReadOnlyField label="Net Amount" value={formatAmount(invoice.net_amount)} />
            <ReadOnlyField label="Tax Amount" value={formatAmount(invoice.tax_amount)} />
            <ReadOnlyField label="Gross Amount" value={formatAmount(invoice.gross_amount)} />
            <ReadOnlyField label="Applied Amount" value={formatAmount(statement.appliedAmount)} />
            <ReadOnlyField label="Open Balance" value={formatAmount(statement.openBalance)} />
            <ReadOnlyField label="Applied Transactions" value={statement.transactions.length} />
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
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Invoice {invoice.document_id}</h1>
            <CompanyPageTitleBadges />
          </div>
        </div>
        <div className={layout.slotTitleActions}>
          <DetailBackButton fallbackHref="/finance/subledgers/ar/invoices" from={from} fromCode={fromCode} />
        </div>
      </header>
      <div className={layout.slotDocument}><TabGroup tabs={tabs} defaultKey="document" /></div>
    </div>
  );
}
