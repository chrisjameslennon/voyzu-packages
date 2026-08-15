import type { TemplateReportRowDto } from "../../types";
import { allTemplatesReportCss } from "./all-template-report.css";

export function AllTemplatesReportTemplate({
  rows,
  generatedAt,
}: {
  rows: TemplateReportRowDto[];
  generatedAt: string;
}) {
  return (
    <article className="templateReportDocument">
      <style>{allTemplatesReportCss}</style>
      <header className="templateReportHeader">
        <h1>Template Report</h1>
        <p>Generated {new Date(generatedAt).toLocaleString("en-NZ")}</p>
      </header>
      <table className="templateReportTable">
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.code} className={row.status === "INACTIVE" ? "templateReportInactive" : undefined}>
              <td>{row.code}</td>
              <td>{row.description ?? "-"}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
