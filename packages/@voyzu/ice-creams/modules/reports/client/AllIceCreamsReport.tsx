"use client";

import { Breadcrumbs, Button } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import type { IceCreamReportRowDto } from "../../types";
import styles from "./all-ice-creams-report.module.css";

export function AllIceCreamsReport({
  rows,
  printable = false,
}: {
  rows: IceCreamReportRowDto[];
  printable?: boolean;
}) {
  return (
    <div className={printable ? styles.printable : layout.reportView}>
      {!printable ? (
        <header className={layout.reportHeader}>
          <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
          <div className={layout.slotTitle}>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>All Ice Creams</h1>
          </div>
          <div className={layout.slotActions}>
            <Button
              variant="secondary"
              icon="print"
              onClick={() => window.open("/ice-creams/reports/all/printable", "_blank")}
            >
              Printable
            </Button>
          </div>
        </header>
      ) : (
        <header className={styles.documentHeader}>
          <h1>All Ice Creams</h1>
          <p>Generated {new Date().toLocaleString("en-NZ")}</p>
        </header>
      )}

      <main className={styles.reportBody}>
        <table className={styles.table}>
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
              <tr key={row.code} className={row.status === "INACTIVE" ? styles.inactive : undefined}>
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
      </main>
    </div>
  );
}
