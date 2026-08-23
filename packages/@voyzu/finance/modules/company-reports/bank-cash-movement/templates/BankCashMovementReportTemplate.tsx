import type { BankCashMovementResponseDto } from "@voyzu/finance/types/modules/company-reports";

import { bankCashMovementReportCss, bankCashMovementReportStyles as reportStyles } from "./bank-cash-movement-report.css";

const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function money(value: number) {
  if (value === 0) return "-";
  const abs = moneyFormat.format(Math.abs(value));
  return value < 0 ? `(${abs})` : abs;
}

export function BankCashMovementReportTemplate({ data, generatedAt }: { data: BankCashMovementResponseDto; generatedAt: string }) {
  const totalDebit = data.lines.filter((line) => line.drCr === "DR").reduce((sum, line) => sum + line.amount, 0);
  const totalCredit = data.lines.filter((line) => line.drCr === "CR").reduce((sum, line) => sum + line.amount, 0);

  return (
    <article className={reportStyles.reportDocument}>
      <style>{bankCashMovementReportCss}</style>
      <style>{"@media print { @page { size: A4 landscape; } }"}</style>
      <header className={reportStyles.reportHeader}>
        <h1>{data.companyName}</h1>
        <h2>Bank / Cash Movement</h2>
        <p>{data.fromDate} to {data.toDate} - {data.bankCashFilter.label}</p>
      </header>
      <table className={reportStyles.reportTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Document</th>
            <th>Bank / Cash</th>
            <th>GL Account</th>
            <th>Reference</th>
            <th className={reportStyles.amount}>Debit</th>
            <th className={reportStyles.amount}>Credit</th>
          </tr>
        </thead>
        <tbody>
          {data.lines.map((line) => (
            <tr key={line.id}>
              <td>{line.postingDate}</td>
              <td>{line.documentTypeLabel} {line.documentId}</td>
              <td>{line.bankCashCode}</td>
              <td>{line.bankCashGlAccountCode}</td>
              <td>{line.paymentRef ?? line.txRef ?? line.txCode ?? "-"}</td>
              <td className={reportStyles.amount}>{line.drCr === "DR" ? money(line.amount) : "-"}</td>
              <td className={reportStyles.amount}>{line.drCr === "CR" ? money(line.amount) : "-"}</td>
            </tr>
          ))}
          <tr className={reportStyles.totalRow}>
            <td colSpan={5}>Total</td>
            <td className={reportStyles.amount}>{money(totalDebit)}</td>
            <td className={reportStyles.amount}>{money(totalCredit)}</td>
          </tr>
          {!data.trialBalanceReconciled && (
            <tr className={reportStyles.totalRow}>
              <td colSpan={7}>Not reconciled</td>
            </tr>
          )}
        </tbody>
      </table>
      <footer className={reportStyles.reportFooter}>Generated {generatedAt}</footer>
    </article>
  );
}
