"use client";
import { useMemo, useState } from "react";
import {
  Breadcrumbs,
  Button,
  Checkbox,
  DropdownMenu,
  type DropdownMenuItem,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  InventoryReport,
  InventoryReportKey,
} from "../types/report.types";
import { InventoryReportTemplate } from "./InventoryReportTemplate";
import localStyles from "./inventory-report.module.css";
export function InventoryReportView({
  report,
  reportKey,
  generatedAt,
  printable = false,
  initialShowInactive = false,
  initialShowCustomFields = true,
}: {
  report: InventoryReport;
  reportKey: InventoryReportKey;
  generatedAt: string;
  printable?: boolean;
  initialShowInactive?: boolean;
  initialShowCustomFields?: boolean;
}) {
  const hasItemOptions = reportKey === "items";
  const [showInactive, setShowInactive] = useState(initialShowInactive);
  const [showCustomFields, setShowCustomFields] = useState(
    initialShowCustomFields,
  );
  const reportParams = () => {
    const params = new URLSearchParams();
    if (hasItemOptions) {
      params.set("showInactive", String(showInactive));
      params.set("showCustomFields", String(showCustomFields));
    }
    return params;
  };
  const printablePath = () => {
    const params = reportParams();
    const query = params.toString();
    return `/inventory/reports/${reportKey}/printable${query ? `?${query}` : ""}`;
  };
  const pdf = (mode: "pdf" | "pdf-view") => {
    const params = new URLSearchParams({
      path: `/inventory/reports/${reportKey}/printable`,
      filename: `inventory-${reportKey}`,
      orientation: "landscape",
    });
    if (hasItemOptions) {
      params.set("showInactive", String(showInactive));
      params.set("showCustomFields", String(showCustomFields));
    }
    return `/api/capability/${mode}?${params}`;
  };
  const optionItems: DropdownMenuItem[] = useMemo(
    () => [
      {
        value: "show-custom-fields",
        label: (
          <span className={localStyles.checkboxOption}>
            <Checkbox
              checked={showCustomFields}
              onChange={() => undefined}
              tabIndex={-1}
            />
            <span>Show custom fields</span>
          </span>
        ),
        onSelect: () => setShowCustomFields((current) => !current),
      },
    ],
    [showCustomFields],
  );
  const visibleReport = useMemo(
    () => ({
      ...report,
      rows: report.rows
        .filter((row) => showInactive || !row.inactive)
        .map((row) =>
          showCustomFields ? row : { ...row, details: undefined },
        ),
    }),
    [report, showCustomFields, showInactive],
  );
  const document = (
    <InventoryReportTemplate report={visibleReport} generatedAt={generatedAt} />
  );
  if (printable) return document;
  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <h1
            className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
          >
            {report.title}
          </h1>
        </div>
        {hasItemOptions ? (
          <div className={`${layout.slotToolbarLeft} ${localStyles.toolbarLeft}`}>
            <label className={localStyles.inlineCheckboxOption}>
              <Checkbox
                checked={showInactive}
                onChange={() => setShowInactive((current) => !current)}
              />
              <span>Show inactive</span>
            </label>
          </div>
        ) : null}
        <div className={layout.slotToolbarRight}>
          {hasItemOptions ? (
            <DropdownMenu
              trigger={
                <Button variant="plain" icon="tune">
                  Options
                </Button>
              }
              items={optionItems}
              alignment="right"
              closeOnSelect={false}
            />
          ) : null}
          <Button
            variant="secondary"
            icon="open_in_new"
            title="Printable Page"
            onClick={() =>
              window.open(printablePath(), "_blank", "noopener,noreferrer")
            }
          />
          <Button
            variant="secondary"
            icon="picture_as_pdf"
            title="View PDF"
            onClick={() =>
              window.open(pdf("pdf-view"), "_blank", "noopener,noreferrer")
            }
          />
          <Button
            variant="secondary"
            icon="download"
            title="Download PDF"
            onClick={() => {
              window.location.href = pdf("pdf");
            }}
          />
        </div>
      </header>
      <div className={layout.slotDocument}>
        <div className={layout.document} style={{ maxWidth: "297mm" }}>
          {document}
        </div>
      </div>
    </div>
  );
}
