"use client";

import { Breadcrumbs, Button } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import type { IceCreamReportRowDto } from "@voyzu/ice-creams/types";
import { allIceCreamsReportCss } from "./all-ice-creams-report.css";

export function AllIceCreamsReport({
  rows,
  printable = false,
}: {
  rows: IceCreamReportRowDto[];
  printable?: boolean;
}) {
  const printablePath = "/ice-creams/reports/all/printable";
  const pdfPath = (disposition: "view" | "download") => {
    const params = new URLSearchParams({
      path: printablePath,
      filename: "all-ice-creams",
      orientation: "landscape",
    });
    return `/api/capability/${disposition === "view" ? "pdf-view" : "pdf"}?${params.toString()}`;
  };

  const reportDocument = (
    <div className="iceCreamReportDocument">
      <style>{allIceCreamsReportCss}</style>
      <header className="iceCreamReportHeader">
        <h1>All Ice Creams</h1>
        <p>Generated {new Date().toLocaleString("en-NZ")}</p>
      </header>
      <table className="iceCreamReportTable">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Flavour Code</th>
            <th>Flavour</th>
            <th>Supplier</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.code} className={row.status === "INACTIVE" ? "iceCreamReportInactive" : undefined}>
              <td>{row.code}</td>
              <td>{row.name}</td>
              <td>{row.flavorCode}</td>
              <td>{row.flavorName}</td>
              <td>{row.supplier}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (printable) {
    return reportDocument;
  }

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>All Ice Creams</h1>
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
