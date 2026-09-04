import { Fragment } from "react";
import type { InventoryReport } from "../types/report.types";
import {
  inventoryReportCss,
  inventoryReportStyles as styles,
} from "./inventory-report.css";

const numericHeaders = new Set([
  "On Hand",
  "Reserved",
  "Available",
  "Qty Change",
  "Quantity Change",
  "Items",
  "Adjustments",
  "Quantity",
]);
const codeHeaders = new Set([
  "SKU",
  "Code",
  "Item Code",
  "Reference",
]);

function cellClass(header: string): string | undefined {
  if (numericHeaders.has(header)) return styles.numeric;
  if (codeHeaders.has(header)) return styles.code;
  if (header === "Status") return styles.status;
  return undefined;
}

export function InventoryReportTemplate({
  report,
  generatedAt,
}: {
  report: InventoryReport;
  generatedAt: string;
}) {
  return (
    <article className={styles.document}>
      <style>{inventoryReportCss}</style>
      <header className={styles.header}>
        <h1>{report.title}</h1>
        <p>Generated {new Date(generatedAt).toLocaleString("en-NZ")}</p>
      </header>
      <table className={styles.table}>
        <thead>
          <tr>
            {report.headers.map((header) => (
              <th key={header} className={cellClass(header)}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {report.rows.map((row) => (
            <Fragment key={row.id}>
              <tr className={row.inactive ? styles.inactiveRow : undefined}>
                {row.cells.map((cell, index) => (
                  <td
                    key={`${row.id}-${index}`}
                    className={cellClass(report.headers[index] ?? "")}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
              {row.details?.length ? (
                <tr
                  className={`${styles.detailRow}${row.inactive ? ` ${styles.inactiveRow}` : ""}`}
                >
                  <td colSpan={report.headers.length}>
                    <div className={styles.detailLines}>
                      {row.details.map((detail) => (
                        <div className={styles.detailLine} key={detail.label}>
                          <span>{detail.label}</span>
                          <strong>{detail.value}</strong>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
      {!report.rows.length ? (
        <div className={styles.empty}>No records</div>
      ) : null}
      <footer className={styles.footer}>
        {report.rows.length} record{report.rows.length === 1 ? "" : "s"}
      </footer>
    </article>
  );
}
