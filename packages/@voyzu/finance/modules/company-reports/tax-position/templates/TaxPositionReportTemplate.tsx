import type { TaxPositionResponseDto } from "@voyzu/finance/types/modules/company-reports";

import { taxPositionReportCss, taxPositionReportStyles as reportStyles } from "./tax-position-report.css";

const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function money(value: number) {
  if (value === 0) return "-";
  const abs = moneyFormat.format(Math.abs(value));
  return value < 0 ? `(${abs})` : abs;
}

export function TaxPositionReportTemplate({ data, generatedAt }: { data: TaxPositionResponseDto; generatedAt: string }) {
  return (
    <article className={reportStyles.reportDocument}>
      <style>{taxPositionReportCss}</style>
      <header className={reportStyles.reportHeader}>
        <h1>{data.companyName}</h1>
        <h2>Tax Position</h2>
        <p>As at {data.asAtDate}</p>
      </header>
      <table className={reportStyles.reportTable}>
        <colgroup>
          <col />
          {data.authorityColumns.map((authority) => (
            <col key={authority.taxAuthorityCode} style={{ width: "10rem" }} />
          ))}
          <col style={{ width: "10rem" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Tax position</th>
            {data.authorityColumns.map((authority) => (
              <th key={authority.taxAuthorityCode} className={reportStyles.amount}>{authority.taxAuthorityCode}</th>
            ))}
            <th className={reportStyles.amount}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.lines.map((line) => (
            <tr key={line.key}>
              <td>{line.label}</td>
              {data.authorityColumns.map((authority) => (
                <td key={authority.taxAuthorityCode} className={reportStyles.amount}>{money(line.amountsByAuthority[authority.taxAuthorityCode] ?? 0)}</td>
              ))}
              <td className={reportStyles.amount}>{money(line.total)}</td>
            </tr>
          ))}
          <tr className={reportStyles.totalRow}>
            <td>Net tax position</td>
            {data.authorityColumns.map((authority) => {
              const output = data.lines.find((line) => line.key === "OUTPUT_TAX_PAYABLE")?.amountsByAuthority[authority.taxAuthorityCode] ?? 0;
              const input = data.lines.find((line) => line.key === "INPUT_TAX_RECEIVABLE")?.amountsByAuthority[authority.taxAuthorityCode] ?? 0;
              return <td key={authority.taxAuthorityCode} className={reportStyles.amount}>{money(output - input)}</td>;
            })}
            <td className={reportStyles.amount}>{money(data.netTaxPosition)}</td>
          </tr>
          {!data.trialBalanceReconciled && (
            <tr className={reportStyles.totalRow}>
              <td colSpan={data.authorityColumns.length + 2}>Not reconciled</td>
            </tr>
          )}
        </tbody>
      </table>
      <footer className={reportStyles.reportFooter}>Generated {generatedAt}</footer>
    </article>
  );
}
