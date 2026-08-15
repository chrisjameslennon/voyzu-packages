"use client";

import { Breadcrumbs, Button } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import type { TemplateReportRowDto } from "../../types";
import { AllTemplatesReportTemplate } from "./AllTemplatesReportTemplate";

export function AllTemplatesReport({
  rows,
  generatedAt,
  printable = false,
}: {
  rows: TemplateReportRowDto[];
  generatedAt: string;
  printable?: boolean;
}) {
  const printablePath = "/template/reports/all/printable";
  const pdfPath = (disposition: "view" | "download") => {
    const params = new URLSearchParams({
      path: printablePath,
      filename: "all-template",
      orientation: "landscape",
    });
    return `/api/capability/${disposition === "view" ? "pdf-view" : "pdf"}?${params.toString()}`;
  };

  const reportDocument = <AllTemplatesReportTemplate rows={rows} generatedAt={generatedAt} />;

  if (printable) {
    return reportDocument;
  }

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Template Report</h1>
        </div>
        <div className={layout.slotToolbarRight}>
          <Button variant="secondary" icon="open_in_new" title="Printable Page" onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")} />
          <Button variant="secondary" icon="picture_as_pdf" title="View PDF" onClick={() => window.open(pdfPath("view"), "_blank", "noopener,noreferrer")} />
          <Button variant="secondary" icon="download" title="Download PDF" onClick={() => { window.location.href = pdfPath("download"); }} />
        </div>
      </header>

      <div className={layout.slotDocument}>
        <div className={layout.document} style={{ maxWidth: "297mm" }}>
          {reportDocument}
        </div>
      </div>
    </div>
  );
}
