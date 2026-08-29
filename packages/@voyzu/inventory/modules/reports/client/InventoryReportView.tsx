"use client";
import { Breadcrumbs, Button } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  InventoryReport,
  InventoryReportKey,
} from "../types/report.types";
import { InventoryReportTemplate } from "./InventoryReportTemplate";
export function InventoryReportView({
  report,
  reportKey,
  generatedAt,
  printable = false,
}: {
  report: InventoryReport;
  reportKey: InventoryReportKey;
  generatedAt: string;
  printable?: boolean;
}) {
  const printablePath = `/inventory/reports/${reportKey}/printable`;
  const pdf = (mode: "pdf" | "pdf-view") =>
    `/api/capability/${mode}?${new URLSearchParams({ path: printablePath, filename: `inventory-${reportKey}`, orientation: "landscape" })}`;
  const document = (
    <InventoryReportTemplate report={report} generatedAt={generatedAt} />
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
        <div className={layout.slotToolbarRight}>
          <Button
            variant="secondary"
            icon="open_in_new"
            title="Printable Page"
            onClick={() =>
              window.open(printablePath, "_blank", "noopener,noreferrer")
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
