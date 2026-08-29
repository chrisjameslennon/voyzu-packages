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
  "Items",
  "Adjustments",
  "Quantity",
]);
const codeHeaders = new Set(["SKU", "Code", "Count No.", "Reference"]);

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
            <tr key={row.id}>
              {row.cells.map((cell, index) => (
                <td
                  key={`${row.id}-${index}`}
                  className={cellClass(report.headers[index] ?? "")}
                >
                  {cell}
                </td>
              ))}
            </tr>
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
