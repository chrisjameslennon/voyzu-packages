"use client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { useMemo, useState } from "react";

import { type DetailBackSource } from "@voyzu-modules/all-modules/common/client";
import type { ArCounterpartyStatementResponseDto } from "@voyzu-modules/types/modules/ar-subledger";
import { Breadcrumbs, Button, Checkbox, DropdownMenu, type DropdownMenuItem } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { ArCounterpartyStatementReportTemplate } from "../templates/ArCounterpartyStatementReportTemplate";
import localStyles from "./ar-counterparty-statement-report.module.css";

interface ArCounterpartyStatementReportProps {
  statement: ArCounterpartyStatementResponseDto;
  organizationName?: string;
  from?: DetailBackSource;
  fromCode?: string;
}

export function ArCounterpartyStatementReport({
  statement,
  organizationName = "",
  from,
  fromCode,
}: ArCounterpartyStatementReportProps) {
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
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>article</span>
          </div>
          <div className={layout.slotTitleText}>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Customer Statement</h1>
          </div>
        </div>
        <div className={layout.slotTitleActions}>
          <DetailBackButton fallbackHref={"/finance/subledgers/ar/statements"} from={from} fromCode={fromCode} />
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
        <div className={layout.document} style={{ maxWidth: "297mm" }}>
          <ArCounterpartyStatementReportTemplate
            statement={statement}
            generatedAt={generatedAt}
            organizationName={organizationName}
            showOrganization={showOrganization}
          />
        </div>
      </div>
    </div>
  );
}
