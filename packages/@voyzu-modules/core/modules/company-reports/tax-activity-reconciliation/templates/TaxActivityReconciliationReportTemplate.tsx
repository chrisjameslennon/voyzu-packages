import type {
  TaxActivityReconciliationLineDto,
  TaxActivityReconciliationResponseDto,
} from "@voyzu-modules/core/types/modules/company-reports";

import { taxPositionReportTemplateCss, taxPositionReportTemplateStyles as styles } from "./tax-position-report-template.css";

function formatAmount(n: number, showDecimals: boolean): string {
  if (n === 0) return "-";
  const absValue = Math.abs(n);
  const amount = showDecimals ? absValue : Math.trunc(absValue);
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
  return n < 0 ? `(${formatted})` : formatted;
}

function lineContribution(line: TaxActivityReconciliationLineDto): number {
  if (line.lineKey === "INPUT_TAX_RECEIVABLE" || line.lineKey === "TAX_PAYMENTS") return -line.amount;
  return line.amount;
}

function groupLines(lines: TaxActivityReconciliationLineDto[]): Array<{ key: string; label: string; lines: TaxActivityReconciliationLineDto[] }> {
  const groups = new Map<string, { key: string; label: string; lines: TaxActivityReconciliationLineDto[] }>();
  for (const line of lines) {
    const key = `${line.sectionKey}:${line.lineKey}`;
    if (!groups.has(key)) {
      groups.set(key, { key, label: line.lineLabel, lines: [] });
    }
    groups.get(key)!.lines.push(line);
  }
  return [...groups.values()];
}

const RETURN_GROUPS: Array<{ key: string; label: string; lineKey: TaxActivityReconciliationLineDto["lineKey"] }> = [
  { key: "TAX_RETURN:OUTPUT_TAX_PAYABLE", label: "Output tax payable", lineKey: "OUTPUT_TAX_PAYABLE" },
  { key: "TAX_RETURN:INPUT_TAX_RECEIVABLE", label: "Less: Input tax recoverable", lineKey: "INPUT_TAX_RECEIVABLE" },
  { key: "TAX_RETURN:TAX_ADJUSTMENTS", label: "Tax adjustments", lineKey: "TAX_ADJUSTMENTS" },
];

const SETTLEMENT_GROUPS: Array<{ key: string; label: string; lineKey: TaxActivityReconciliationLineDto["lineKey"] }> = [
  { key: "SETTLEMENT:TAX_PAYMENTS", label: "Less: Tax payments", lineKey: "TAX_PAYMENTS" },
  { key: "SETTLEMENT:TAX_REFUNDS", label: "Plus: Tax refunds", lineKey: "TAX_REFUNDS" },
];

interface Props {
  data: TaxActivityReconciliationResponseDto;
  generatedAt: string;
  showOrganization: boolean;
  showCompanyHeader: boolean;
  showCompanyFooter: boolean;
  showDecimals: boolean;
  organizationName?: string;
}

export function TaxActivityReconciliationReportTemplate({
  data,
  generatedAt,
  showOrganization,
  showCompanyHeader,
  showCompanyFooter,
  showDecimals,
  organizationName,
}: Props) {
  const hasCompanyHeader = showCompanyHeader && Boolean(data.companyReportLine1 || data.companyReportLine2);
  const hasCompanyFooter = showCompanyFooter && Boolean(data.companyReportFooter);
  const groupsByKey = new Map(groupLines(data.lines).map((group) => [group.key, group]));
  const returnGroups = RETURN_GROUPS.map((definition) => groupsByKey.get(definition.key) ?? { key: definition.key, label: definition.label, lines: [] });
  const settlementGroups = SETTLEMENT_GROUPS.map((definition) => groupsByKey.get(definition.key) ?? { key: definition.key, label: definition.label, lines: [] });

  const renderGroup = (group: { key: string; label: string; lines: TaxActivityReconciliationLineDto[] }) => {
    const groupTotal = group.lines.reduce((sum, line) => sum + lineContribution(line), 0);
    return (
      <tbody key={group.key}>
        <tr className={styles.sectionRow}>
          <td colSpan={6}>{group.label}</td>
        </tr>
        {group.lines.map((line, index) => (
          <tr key={`${group.key}:${line.documentCode}:${line.sourceDocumentRef ?? ""}:${index}`}>
            <td>{line.postingDate}</td>
            <td>{line.documentTypeCode}</td>
            <td>{line.documentCode}</td>
            <td>{line.documentRef ?? "-"}</td>
            <td>{line.sourceDocumentRef ?? "-"}</td>
            <td className={styles.colAmount}>{formatAmount(line.amount, showDecimals)}</td>
          </tr>
        ))}
        <tr className={styles.totalsRow}>
          <td colSpan={5}>{group.label} total</td>
          <td className={styles.colAmount}>{formatAmount(groupTotal, showDecimals)}</td>
        </tr>
      </tbody>
    );
  };

  return (
    <div className={styles.reportPage}>
      <style>{taxPositionReportTemplateCss}</style>
      {showOrganization && organizationName && <div className={styles.reportOrgNameCentered}>{organizationName}</div>}
      <header className={styles.reportHeader}>
        <div>
          <h1>{data.companyName}</h1>
          <div className={styles.reportHeaderLineStrong}>Tax Reconciliation</div>
          <div className={styles.reportHeaderLine}>{data.periodLabel}</div>
          <div className={styles.reportHeaderLine}>{data.periodStartDate} to {data.periodEndDate}</div>
          <div className={styles.reportHeaderLine}>Tax authority: {data.taxAuthorityCode || "-"}</div>
        </div>
      </header>
      {hasCompanyHeader && (
        <section className={styles.reportCompanyHeaderLines}>
          {data.companyReportLine1 && <div>{data.companyReportLine1}</div>}
          {data.companyReportLine2 && <div>{data.companyReportLine2}</div>}
        </section>
      )}
      <table className={styles.reportTable}>
        <thead>
          <tr>
            <th>Posting date</th>
            <th>Document type</th>
            <th>Document</th>
            <th>Document ID</th>
            <th>Source document</th>
            <th className={styles.colAmountHeader}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.sectionRow}>
            <td colSpan={6}>Tax return calculation</td>
          </tr>
        </tbody>
        {returnGroups.map(renderGroup)}
        <tbody>
          <tr className={styles.sectionRow}>
            <td colSpan={6}>Settlement / reconciliation</td>
          </tr>
        </tbody>
        {settlementGroups.map(renderGroup)}
        <tbody>
          <tr className={styles.netTaxRow}>
            <td colSpan={5}>Return balance after settlements</td>
            <td className={styles.colAmount}>{formatAmount(data.total, showDecimals)}</td>
          </tr>
          {!data.trialBalanceReconciled && (
            <tr className={styles.netTaxRow}>
              <td colSpan={6}>Not reconciled</td>
            </tr>
          )}
        </tbody>
      </table>
      {hasCompanyFooter && <footer className={styles.reportFooter}>{data.companyReportFooter}</footer>}
      <div className={styles.reportGenerated}>Generated {generatedAt}</div>
    </div>
  );
}
