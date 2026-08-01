"use client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { useMemo, useState } from "react";

import { CompanyPageTitleBadges, type DetailBackSource } from "@voyzu/core/common/client";
import type { ApLedgerEntryDocumentReportResponseDto } from "@voyzu/core/types/modules/ap-subledger";
import { Breadcrumbs, Button, Checkbox, DropdownMenu, type DropdownMenuItem } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { ApLedgerEntryDocumentReportTemplate } from "../templates/ApLedgerEntryDocumentReportTemplate";
import localStyles from "./ap-bill-report.module.css";

interface ApBillReportProps {
  report: ApLedgerEntryDocumentReportResponseDto;
  organizationName?: string;
  from?: DetailBackSource;
  fromCode?: string;
}

export function ApBillReport({ report, organizationName = "", from, fromCode }: ApBillReportProps) {
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
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>receipt_long</span>
          </div>
          <div className={layout.slotTitleText}>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{report.documentId}</h1>
            <CompanyPageTitleBadges />
          </div>
        </div>
        <div className={layout.slotTitleActions}>
          <DetailBackButton fallbackHref={"/finance/subledgers/ap/bills"} from={from} fromCode={fromCode} />
        </div>
        <div className={layout.slotToolbarRight}>
          <DropdownMenu
            trigger={<Button variant="plain" icon="tune" title="Options" />}
            items={optionItems}
            alignment="right"
            closeOnSelect={false}
          />
        </div>
      </header>
      <div className={layout.slotDocument}>
        <div className={layout.document} style={{ maxWidth: "210mm" }}>
          <ApLedgerEntryDocumentReportTemplate
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
