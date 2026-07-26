import type { TrialBalanceResponseDto } from "@voyzu-modules/types/modules/company-reports";

import { trialBalanceReportCss, trialBalanceReportStyles as reportStyles } from "./trial-balance-report.css";

const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function money(value: number) {
  return value === 0 ? "-" : moneyFormat.format(value);
}

export function TrialBalanceReportTemplate({
  data,
  generatedAt,
  showAccountCode = false,
}: {
  data: TrialBalanceResponseDto;
  generatedAt: string;
  showAccountCode?: boolean;
}) {
  const labelColSpan = showAccountCode ? 3 : 2;

  return (
    <article className={reportStyles.reportDocument}>
      <style>{trialBalanceReportCss}</style>
      <header className={reportStyles.reportHeader}>
        <h1>{data.companyName}</h1>
        <h2>Trial Balance</h2>
        <p>As at {data.asAtDate ?? "current date"}</p>
      </header>
      <table className={reportStyles.reportTable}>
        <colgroup>
          {showAccountCode && <col style={{ width: "7rem" }} />}
          <col />
          <col style={{ width: "7rem" }} />
          <col style={{ width: "10rem" }} />
          <col style={{ width: "10rem" }} />
        </colgroup>
        <thead>
          <tr>
            {showAccountCode && <th className={reportStyles.code}>Code</th>}
            <th className={reportStyles.account}>Account</th>
            <th className={reportStyles.type}>Type</th>
            <th className={reportStyles.amount}>Debit</th>
            <th className={reportStyles.amount}>Credit</th>
          </tr>
        </thead>
        <tbody>
          {data.lines.map((line) => (
            <tr key={line.glAccountId}>
              {showAccountCode && <td className={reportStyles.code}>{line.glAccountCode}</td>}
              <td className={reportStyles.account}>{line.glAccountName}</td>
              <td className={reportStyles.type}>{line.accountType}</td>
              <td className={reportStyles.amount}>{money(line.debitTotal)}</td>
              <td className={reportStyles.amount}>{money(line.creditTotal)}</td>
            </tr>
          ))}
          <tr className={reportStyles.totalRow}>
            <td colSpan={labelColSpan}>Total</td>
            <td className={reportStyles.amount}>{money(data.totalDebit)}</td>
            <td className={reportStyles.amount}>{money(data.totalCredit)}</td>
          </tr>
        </tbody>
      </table>
      <footer className={reportStyles.reportFooter}>Generated {generatedAt}</footer>
    </article>
  );
}
