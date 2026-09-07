import { Fragment } from "react";
import type { InventoryReport } from "../types/report.types";
import {
  printableReportCss,
  printableReportStyles as reportStyles,
} from "@voyzu/ui-style";

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
  if (numericHeaders.has(header)) return reportStyles.numeric;
  if (codeHeaders.has(header)) return reportStyles.code;
  if (header === "Status") return reportStyles.status;
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
    <article className={reportStyles.document}>
      <style>{printableReportCss}</style>
      <header className={reportStyles.header}>
        <h1>{report.title}</h1>
        <p>Generated {new Date(generatedAt).toLocaleString("en-NZ")}</p>
      </header>
      <table className={reportStyles.table}>
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
              <tr className={row.inactive ? reportStyles.inactiveRow : undefined}>
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
                  className={`${reportStyles.detailRow}${row.inactive ? ` ${reportStyles.inactiveRow}` : ""}`}
                >
                  <td colSpan={report.headers.length}>
                    <div className={reportStyles.detailLines}>
                      {row.details.map((detail) => (
                        <div className={reportStyles.detailLine} key={detail.label}>
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
        <div className={reportStyles.empty}>No records</div>
      ) : null}
      <footer className={reportStyles.footer}>
        {report.rows.length} record{report.rows.length === 1 ? "" : "s"}
      </footer>
    </article>
  );
}
