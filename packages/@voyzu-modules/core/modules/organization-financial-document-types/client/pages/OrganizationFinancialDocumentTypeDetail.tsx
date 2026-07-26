"use client";

import { OrganizationAuditPanel as AuditPanel } from "@voyzu-modules/core/organization-audit/client";


import { DetailBackButton } from "@voyzu/ui-surface/client";
import { getStatusSemanticColor } from "@voyzu-modules/core/common/client";
import type {
    FinancialDocumentTypePostingTemplateDto,
    FinancialDocumentTypeResponseDto,
} from "@voyzu-modules/core/types/modules/financial-document-types";
import { Badge, Breadcrumbs, TabGroup, type TabDef } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./FinancialDocumentTypeDetail.module.css";
import {
    FinancialDocumentTypeDetailsTab,
    FinancialDocumentTypePostingModelControl,
} from "./FinancialDocumentTypeDetailSections";

export function OrganizationFinancialDocumentTypeDetail({
  processor,
  postingTemplate,
}: {
  processor: FinancialDocumentTypeResponseDto;
  postingTemplate: FinancialDocumentTypePostingTemplateDto | null;
}) {
  const routePrefix = "/organization";
  const tabs: TabDef[] = [
    {
      key: "posting",
      label: "Posting",
      content: (
        <FinancialDocumentTypePostingModelControl
          postingTemplate={postingTemplate}
          processorCode={processor.code}
          supportsItems={processor.supportsItems}
          routePrefix={routePrefix}
        />
      ),
    },
    { key: "details", label: "Details", content: <FinancialDocumentTypeDetailsTab processor={processor} /> },
  ];

  return (
    <div className={`${layoutStyles.detailView} ${layoutStyles.detailViewWithStatusRail}`}>
      <header className={layoutStyles.detailHeader}>
        <div className={layoutStyles.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layoutStyles.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>webhook</span></div>
            <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>{processor.name}</h1>
          </div>
        </div>
        <div className={layoutStyles.slotActions}>
          <div className={detailStyles.headerActions}><DetailBackButton fallbackHref={`${routePrefix}/financial-document-types`} /></div>
        </div>
      </header>

      <main className={`${layoutStyles.mainSection} ${localStyles.mainSection}`}>
        <div className={localStyles.tabShell}><TabGroup tabs={tabs} defaultKey="posting" /></div>
      </main>

      <aside className={layoutStyles.statusSection}>
        <div className={`${detailStyles.statusCard} ${localStyles.sideSectionCard}`}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Status</label>
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(processor.status)}>{processor.status}</Badge>
          </div>
        </div>
        <AuditPanel
          id={processor.code}
          creationDate={processor.audit.created.date}
          updatedDate={processor.audit.updated.date}
          creationActorType={processor.audit.created.actorType}
          creationUser={processor.audit.created.user}
          updatedActorType={processor.audit.updated.actorType}
          updatedUser={processor.audit.updated.user}
          auditHref={`/organization/audit?entityType=financial_document_type&entityCode=${encodeURIComponent(processor.code)}`}
          mutationId={processor.audit.updated.mutationId ?? processor.audit.created.mutationId}
        />
      </aside>
    </div>
  );
}
