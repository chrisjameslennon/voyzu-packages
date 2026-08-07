"use client";

import { useMemo } from "react";

import { type DetailBackSource } from "@voyzu/core/common/client";
import type { ArCounterpartyStatementResponseDto } from "@voyzu/core/types/modules/ar-subledger";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import { Breadcrumbs, Button, Input, TabGroup, type TabDef } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { ArCounterpartyStatementReportTemplate } from "../templates/ArCounterpartyStatementReportTemplate";
import localStyles from "./ar-counterparty-statement-report.module.css";

interface ArCounterpartyStatementReportProps {
  statement: ArCounterpartyStatementResponseDto;
  from?: DetailBackSource;
  fromCode?: string;
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ReadOnlyField({ label, value }: { label: string; value: string | number }) {
  return (
    <label className={detailStyles.fieldGroup}>
      <span className={typography.fieldLabel}>{label}</span>
      <Input value={String(value)} disabled />
    </label>
  );
}

export function ArCounterpartyStatementReport({
  statement,
  from,
  fromCode,
}: ArCounterpartyStatementReportProps) {
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
  const printablePath = `/finance/subledgers/ar/statements/${encodeURIComponent(statement.counterpartyCode)}/printable`;
  const pdfParams = new URLSearchParams({
    orientation: "landscape",
    path: printablePath,
    filename: `ar-statement-${statement.counterpartyCode}`,
  });
  const pdfViewPath = `/api/capability/pdf-view?${pdfParams.toString()}`;
  const pdfDownloadPath = `/api/capability/pdf?${pdfParams.toString()}`;
  const applicationCount = statement.groups.reduce((total, group) => total + group.applications.length, 0);

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
            <div className={`${layout.document} ${localStyles.landscapeDocument}`}>
              <ArCounterpartyStatementReportTemplate statement={statement} generatedAt={generatedAt} />
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
          <h2 className={typography.sectionHeading}>Statement Details</h2>
          <div className={detailStyles.formGrid}>
            <ReadOnlyField label="Counterparty Code" value={statement.counterpartyCode} />
            <ReadOnlyField label="Counterparty Name" value={statement.counterpartyName} />
            <ReadOnlyField label="Statement Date" value={statement.asAtDate} />
            <ReadOnlyField label="Currency" value={statement.baseCurrencyCode} />
            <ReadOnlyField label="Total Debit" value={formatAmount(statement.totalDebit)} />
            <ReadOnlyField label="Total Credit" value={formatAmount(statement.totalCredit)} />
            <ReadOnlyField label="Total Owing" value={formatAmount(statement.totalOwing)} />
            <ReadOnlyField label="Documents" value={statement.groups.length} />
            <ReadOnlyField label="Applications" value={applicationCount} />
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
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Customer Statement</h1>
          </div>
        </div>
        <div className={layout.slotTitleActions}>
          <DetailBackButton fallbackHref="/finance/subledgers/ar/statements" from={from} fromCode={fromCode} />
        </div>
      </header>
      <div className={layout.slotDocument}><TabGroup tabs={tabs} defaultKey="document" /></div>
    </div>
  );
}
