"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/core/company-audit/client";


import { DetailBackButton } from "@voyzu/ui-surface/client";
import { CompanyPageTitleBadges, getStatusSemanticColor } from "@voyzu/core/common/client";
import type { ApCounterpartyResponseDto } from "@voyzu/core/types/modules/ap-subledger";
import { Badge, Breadcrumbs, Input } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

function value(value: string | number | null | undefined) {
  if (value == null) return "";
  return String(value);
}

export function ApCounterpartyDetail({ counterparty }: { counterparty: ApCounterpartyResponseDto }) {
  const fields: Array<{ label: string; value: string }> = [
    { label: "Code", value: value(counterparty.code) },
    { label: "Name", value: value(counterparty.name) },
    { label: "Country", value: value(counterparty.countryName ?? counterparty.countryCode) },
    { label: "Tax Region", value: value(counterparty.taxRegionOrProvince) },
  ];
  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={layout.slotTitle}><div className={detailStyles.title}><div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>groups</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{counterparty.name}</h1></div><div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div></div><div className={layout.slotActions}><div className={detailStyles.headerActions}><DetailBackButton fallbackHref={"/finance/subledgers/ap/counterparties"} /></div></div></header>
      <aside className={layout.statusSection}><div className={detailStyles.card}><div className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>Status</label><Badge variant="soft" size="x-large" color={getStatusSemanticColor(counterparty.status)}>{counterparty.status}</Badge></div></div><AuditPanel id={counterparty.id} creationDate={counterparty.audit.created.date} updatedDate={counterparty.audit.updated.date} creationActorType={counterparty.audit.created.actorType} creationUser={counterparty.audit.created.user} updatedActorType={counterparty.audit.updated.actorType} updatedUser={counterparty.audit.updated.user} auditHref={`/finance/audit?entityType=ap_counterparty&entityId=${counterparty.id}`} mutationId={counterparty.audit.updated.mutationId ?? counterparty.audit.created.mutationId} /></aside>
      <main className={layout.mainSection}><section className={detailStyles.card}><h2 className={typography.sectionHeading}>AP Counterparty</h2><div className={detailStyles.formGrid}>{fields.map((field) => <label key={field.label} className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>{field.label}</span><Input value={field.value} disabled /></label>)}</div></section></main>
    </div>
  );
}

