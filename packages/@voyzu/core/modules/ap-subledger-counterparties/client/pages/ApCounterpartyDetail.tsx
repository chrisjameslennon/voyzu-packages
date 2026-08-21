"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/core/common/client";


import { DetailBackButton } from "@voyzu/ui-surface/client";
import { CompanyPageTitleBadges, getStatusSemanticColor } from "@voyzu/core/common/client";
import type { ApCounterpartyResponseDto } from "@voyzu/core/types/modules/ap-subledger";
import type { CompanyResponseDto } from "@voyzu/organization/types/modules/companies";
import { Badge, Breadcrumbs, Button, Input, TabGroup, type TabDef } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import reportLayout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { useMemo } from "react";
import { ApCounterpartyReportTemplate } from "../templates/ApCounterpartyReportTemplate";
import localStyles from "./ap-counterparty-detail.module.css";

function value(value: string | number | null | undefined) {
  if (value == null) return "";
  return String(value);
}

export function ApCounterpartyDetail({ company, counterparty }: { company: CompanyResponseDto; counterparty: ApCounterpartyResponseDto }) {
  const generatedAt = useMemo(
    () => new Date().toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }),
    [],
  );
  const fields: Array<{ label: string; value: string }> = [
    { label: "Code", value: value(counterparty.code) },
    { label: "Name", value: value(counterparty.name) },
    { label: "Country", value: value(counterparty.countryName ?? counterparty.countryCode) },
    { label: "Tax Region", value: value(counterparty.taxRegionOrProvince) },
  ];
  const printablePath = `/finance/subledgers/ap/counterparties/${encodeURIComponent(counterparty.code)}/printable`;
  const pdfParams = new URLSearchParams({ orientation: "portrait", path: printablePath, filename: `ap-counterparty-${counterparty.code}` });
  const pdfViewPath = `/api/capability/pdf-view?${pdfParams.toString()}`;
  const pdfDownloadPath = `/api/capability/pdf?${pdfParams.toString()}`;
  const tabs: TabDef[] = [
    {
      key: "document",
      label: "Document",
      content: (
        <div className={localStyles.reportTab}>
          <div className={localStyles.toolbar}>
            <Button variant="secondary" icon="open_in_new" title="Printable Page" onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")} />
            <Button variant="secondary" icon="picture_as_pdf" title="View PDF" onClick={() => window.open(pdfViewPath, "_blank", "noopener,noreferrer")} />
            <Button variant="secondary" icon="download" title="Download PDF" onClick={() => { window.location.href = pdfDownloadPath; }} />
          </div>
          <div className={localStyles.documentShell}>
            <div className={`${reportLayout.document} ${localStyles.portraitDocument}`}>
              <ApCounterpartyReportTemplate company={company} counterparty={counterparty} generatedAt={generatedAt} />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "details",
      label: "Details",
      content: <section className={detailStyles.card}><h2 className={typography.sectionHeading}>AP Counterparty</h2><div className={detailStyles.formGrid}>{fields.map((field) => <label key={field.label} className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>{field.label}</span><Input value={field.value} disabled /></label>)}</div></section>,
    },
  ];
  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={layout.slotTitle}><div className={detailStyles.title}><div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>receipt_long</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{counterparty.name}</h1></div><div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div></div><div className={layout.slotActions}><div className={detailStyles.headerActions}><DetailBackButton fallbackHref={"/finance/subledgers/ap/counterparties"} /></div></div></header>
      <aside className={layout.statusSection}><div className={detailStyles.card}><div className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>Status</label><Badge variant="soft" size="x-large" color={getStatusSemanticColor(counterparty.status)}>{counterparty.status}</Badge></div></div><AuditPanel id={counterparty.id} creationDate={counterparty.audit.created.date} updatedDate={counterparty.audit.updated.date} creationActorType={counterparty.audit.created.actorType} creationUser={counterparty.audit.created.user} updatedActorType={counterparty.audit.updated.actorType} updatedUser={counterparty.audit.updated.user} auditHref={`/settings/audit?entityType=ap_counterparty&entityId=${counterparty.id}`} mutationId={counterparty.audit.updated.mutationId ?? counterparty.audit.created.mutationId} /></aside>
      <main className={layout.mainSection}><TabGroup tabs={tabs} defaultKey="document" /></main>
    </div>
  );
}

