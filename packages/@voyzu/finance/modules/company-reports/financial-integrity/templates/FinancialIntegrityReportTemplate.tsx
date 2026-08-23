import type {
  FinancialIntegrityDocumentDto,
  FinancialIntegrityInventoryLedgerLineDto,
  FinancialIntegrityResponseDto,
  FinancialIntegritySourceFieldDto,
  FinancialIntegritySourceLineDto,
  FinancialIntegritySubledgerEntryDto,
} from "@voyzu/finance/types/modules/company-reports";
import type { AccountType } from "@voyzu/finance/types/modules/core";

import { financialIntegrityReportCss } from "./financial-integrity-report.css";

const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  ASSET: "Assets",
  LIABILITY: "Liabilities",
  EQUITY: "Equity",
  REVENUE: "Income",
  EXPENSE: "Expenses",
};

function formatAmount(value: number | null | undefined): string {
  if (value == null || value === 0) return "-";
  const formatted = Math.abs(value).toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value < 0 ? `(${formatted})` : formatted;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const [yr, mo, dy] = iso.split("-").map(Number);
  const monthName = new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(yr, mo - 1, dy));
  return `${dy} ${monthName} ${yr}`;
}

function journalBalanceLabel(difference: number): string {
  return difference === 0 ? "Balanced" : `Difference ${formatAmount(difference)}`;
}

function SourceFields({ fields }: { fields: FinancialIntegritySourceFieldDto[] }) {
  if (!fields.length) return null;
  return (
    <div className="sourceFields">
      {fields.map((field) => (
        <div key={field.label}>
          <span>{field.label}</span>
          {field.value}
        </div>
      ))}
    </div>
  );
}

function SourceLines({ lines }: { lines: FinancialIntegritySourceLineDto[] }) {
  if (!lines.length) return null;
  return (
    <table className="detailTable sourceLineTable">
      <thead>
        <tr>
          <th>#</th>
          <th>Source Document Line</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <tr key={line.lineNumber}>
            <td>{line.lineNumber}</td>
            <td>
              <div className="sourceLineFields">
                {line.fields.map((field) => (
                  <span key={`${line.lineNumber}-${field.label}`}>
                    <strong>{field.label}</strong>{field.value}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InventoryLines({ lines }: { lines: FinancialIntegrityInventoryLedgerLineDto[] }) {
  if (!lines.length) return null;
  return (
    <table className="detailTable inventoryTable">
      <thead>
        <tr>
          <th>#</th>
          <th>Movement</th>
          <th>Item</th>
          <th className="amount">Qty Delta</th>
          <th className="amount">Unit Value</th>
          <th className="amount">Book Value Delta</th>
          <th className="amount">Qty Balance</th>
          <th className="amount">Avg Unit Value</th>
          <th className="amount">Book Value Balance</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <tr key={`${line.lineNumber}-${line.itemCode}-${line.movement}`}>
            <td>{line.lineNumber}</td>
            <td>{line.movement}</td>
            <td>{line.itemName} <span className="badge">{line.itemCode}</span></td>
            <td className="amount">{formatAmount(line.qtyDelta)}</td>
            <td className="amount">{formatAmount(line.unitValueSupplied)}</td>
            <td className="amount">{formatAmount(line.bookValueDelta)}</td>
            <td className="amount">{formatAmount(line.qtyBalance)}</td>
            <td className="amount">{formatAmount(line.avgUnitValue)}</td>
            <td className="amount">{formatAmount(line.bookValueBalance)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SourceDocumentJson({ value }: { value: Record<string, unknown> }) {
  if (Object.keys(value).length === 0) return null;
  return (
    <div className="sourceDocumentBlock">
      <div className="subsectionTitle">Source Document JSON</div>
      <pre className="jsonBlock">{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

function SubledgerEntries({ entries }: { entries: FinancialIntegritySubledgerEntryDto[] }) {
  if (!entries.length) return null;
  return (
    <div className="subledgerBlock">
      <div className="subsectionTitle">Subledger Entries</div>
      {entries.map((entry) => (
        <div key={`${entry.ledger}-${entry.id}`} className="linkedDocument">
          <div className="linkedHeader">
            <span>{entry.ledger} Subledger Entry</span>
            <span>{entry.code}</span>
            <span>{entry.documentTypeCode}</span>
            <span>{entry.documentId}</span>
            <span>{formatDate(entry.postingDate)}</span>
            <span>{entry.currencyCode}</span>
            <span>{entry.status}</span>
          </div>
          <div className="fieldGrid">
            <div><span>Memo</span>{entry.memo ?? "-"}</div>
            <div><span>Description</span>{entry.description ?? "-"}</div>
          </div>
          <SourceLines lines={entry.lines} />
        </div>
      ))}
    </div>
  );
}

interface DocumentBlockProps {
  document: FinancialIntegrityDocumentDto;
  nested?: boolean;
  showSubledgerEntries: boolean;
  showSourceDocument: boolean;
}

function DocumentBlock({ document, nested = false, showSubledgerEntries, showSourceDocument }: DocumentBlockProps) {
  return (
    <div className={`documentBlock ${nested ? "nestedDocument" : ""}`}>
      <div className="documentHeader">
        <div>
          <div className="documentTitle">
            {document.documentTypeName || document.documentTypeCode} <span className="badge">{document.documentTypeCode}</span>
          </div>
          {document.accountingFormula && <div className="accountingFormula">{document.accountingFormula}</div>}
          <div className="documentMeta">
            {document.documentId} · {formatDate(document.postingDate)}
            {document.sourceDocumentId && <> · Source {document.sourceDocumentTypeCode} {document.sourceDocumentId}</>}
          </div>
        </div>
        <div className="documentStatus">{document.status ?? "-"}</div>
      </div>

      <div className="fieldGrid">
        <div><span>Counterparty</span>{document.counterparty ?? "-"}</div>
        <div><span>Currency</span>{document.currencyCode ?? "-"}</div>
        <div><span>Memo</span>{document.memo ?? "-"}</div>
        <div><span>Description</span>{document.description ?? "-"}</div>
      </div>

      {(document.sourceTotals.length > 0 || document.sourceLines.length > 0) && (
        <div className="sourceDocumentBlock">
          <div className="subsectionTitle">Source Document</div>
          <SourceFields fields={document.sourceTotals} />
          <SourceLines lines={document.sourceLines} />
        </div>
      )}

      {showSourceDocument && <SourceDocumentJson value={document.sourceDocumentJson} />}

      {document.journalHeaders.map((journal) => (
        <div key={journal.id} className="journalBlock">
          <div className="journalHeader">
            <span>Journal Header {journal.id}</span>
            <span>{journal.code}</span>
            <span>{formatDate(journal.postingDate)}</span>
            <span>{journal.sourceDocumentTypeCode} {journal.sourceDocumentId}</span>
            <span>{journal.financialPeriodCode}</span>
            <span>{journal.currencyCode}</span>
            <span>{journal.status}</span>
            <span className={journal.balancesToZero ? "pass" : "fail"}>
              {journalBalanceLabel(journal.difference)}
            </span>
          </div>
          <table className="detailTable">
            <thead>
              <tr>
                <th>#</th>
                <th>GL Code</th>
                <th>GL Account</th>
                <th className="amount">Debit</th>
                <th className="amount">Credit</th>
                <th className="amount">Amount</th>
                <th>Counterparty</th>
                <th>Description / Memo</th>
              </tr>
            </thead>
            <tbody>
              {journal.lines.map((line) => (
                <tr key={line.id}>
                  <td>{line.lineNumber}</td>
                  <td>{line.glAccountCode ?? "-"}</td>
                  <td>{line.glAccountName ?? "-"}</td>
                  <td className="amount">{formatAmount(line.debit)}</td>
                  <td className="amount">{formatAmount(line.credit)}</td>
                  <td className="amount">{formatAmount(line.amount)}</td>
                  <td>{line.counterparty ?? "-"}</td>
                  <td>{line.description ?? line.memo ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {showSubledgerEntries && <SubledgerEntries entries={document.subledgerEntries} />}

      {showSubledgerEntries && document.linkedInventoryDocuments.map((linked) => (
        <div key={linked.id} className="linkedDocument">
          <div className="linkedHeader">
            <span>{document.documentTypeCode.startsWith("INVENTORY_") ? "Inventory Ledger Entries" : "Generated Inventory Document"}</span>
            <span>{linked.documentTypeCode}</span>
            <span>{linked.documentId}</span>
            <span>Source {linked.sourceDocumentTypeCode} {linked.sourceDocumentId ?? "-"}</span>
            <span>{linked.status}</span>
          </div>
          {!document.documentTypeCode.startsWith("INVENTORY_") && (
            <>
              <div className="fieldGrid">
                <div><span>Posting Date</span>{formatDate(linked.postingDate)}</div>
                <div><span>Currency</span>{linked.currencyCode}</div>
                <div><span>Memo</span>{linked.memo ?? "-"}</div>
                <div><span>Description</span>{linked.description ?? "-"}</div>
              </div>
              <div className="sourceDocumentBlock">
                <div className="subsectionTitle">Inventory Source Document Values / Lines</div>
                <SourceFields fields={linked.sourceTotals} />
                <SourceLines lines={linked.sourceLines} />
              </div>
              <div className="subsectionTitle">Inventory Ledger Entries</div>
            </>
          )}
          <InventoryLines lines={linked.lines} />
        </div>
      ))}

      {document.downstreamDocuments.map((child) => (
        <DocumentBlock
          key={child.key}
          document={child}
          nested
          showSubledgerEntries={showSubledgerEntries}
          showSourceDocument={showSourceDocument}
        />
      ))}
    </div>
  );
}

interface FinancialIntegrityReportTemplateProps {
  data: FinancialIntegrityResponseDto;
  generatedAt: string;
  showSubledgerEntries?: boolean;
  showSourceDocument?: boolean;
  includeCss?: boolean;
}

export function FinancialIntegrityReportTemplate({
  data,
  generatedAt,
  showSubledgerEntries = false,
  showSourceDocument = false,
  includeCss = true,
}: FinancialIntegrityReportTemplateProps) {
  return (
    <div className="reportPage">
      {includeCss && <style>{financialIntegrityReportCss}</style>}

      <header className="reportHeader">
        <div className="reportCompanyName">{data.companyName}</div>
        <div className="reportHeaderLine reportHeaderLineStrong">Financial Integrity</div>
        <div className="reportHeaderLine">{formatDate(data.fromDate)} to {formatDate(data.toDate)}</div>
        {data.documentTypeCode && <div className="reportHeaderLine">Document type {data.documentTypeCode}</div>}
      </header>

      <section className="reportSection">
        <h2 className="sectionTitle">Report Totals and Integrity Checks</h2>
        <div className={data.ledgerReconciliation.passed ? "reconciliationPass" : "reconciliationFail"}>
          <div className="reconciliationHeader">
            <span>{data.ledgerReconciliation.passed ? "PASS" : "FAIL"}</span>
            <strong>Ledger Summary Reconciliation</strong>
          </div>
          <div className="reconciliationGrid">
            <div><span>Ledger Summary Debits</span>{formatAmount(data.ledgerReconciliation.ledgerSummaryPeriodDebits)}</div>
            <div><span>Journal-Line Debits</span>{formatAmount(data.ledgerReconciliation.journalLinePeriodDebits)}</div>
            <div><span>Debit Difference</span>{formatAmount(data.ledgerReconciliation.debitDifference)}</div>
            <div><span>Ledger Summary Credits</span>{formatAmount(data.ledgerReconciliation.ledgerSummaryPeriodCredits)}</div>
            <div><span>Journal-Line Credits</span>{formatAmount(data.ledgerReconciliation.journalLinePeriodCredits)}</div>
            <div><span>Credit Difference</span>{formatAmount(data.ledgerReconciliation.creditDifference)}</div>
            <div><span>Ledger Summary Net Movement</span>{formatAmount(data.ledgerReconciliation.ledgerSummaryNetMovement)}</div>
            <div><span>Journal-Line Net Movement</span>{formatAmount(data.ledgerReconciliation.journalLineNetMovement)}</div>
            <div><span>Net Movement Difference</span>{formatAmount(data.ledgerReconciliation.netMovementDifference)}</div>
          </div>
        </div>
        <div className="totalsGrid">
          <div><span>Total report journal debits</span>{formatAmount(data.totals.totalReportJournalDebits)}</div>
          <div><span>Total report journal credits</span>{formatAmount(data.totals.totalReportJournalCredits)}</div>
          <div><span>Difference</span>{formatAmount(data.totals.difference)}</div>
        </div>
        <div className="indicators">
          {data.indicators.map((indicator) => (
            <div key={indicator.code} className={indicator.passed ? "indicatorPass" : "indicatorFail"}>
              <span>{indicator.passed ? "PASS" : "FAIL"}</span>
              <strong>{indicator.label}</strong>
              <small>{indicator.detail}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="reportSection sectionDivider">
        <h2 className="sectionTitle">Trial Balance Period Summary</h2>
        <div className={data.trialBalanceReconciliation.passed ? "reconciliationPass" : "reconciliationFail"}>
          <div className="reconciliationHeader">
            <span>{data.trialBalanceReconciliation.passed ? "PASS" : "FAIL"}</span>
            <strong>Trial Balance to Ledger Integrity Summary</strong>
          </div>
          <div className="reconciliationGrid">
            <div><span>Trial Balance Debits</span>{formatAmount(data.trialBalanceReconciliation.trialBalancePeriodDebits)}</div>
            <div><span>Ledger Summary Debits</span>{formatAmount(data.trialBalanceReconciliation.ledgerSummaryPeriodDebits)}</div>
            <div><span>Debit Difference</span>{formatAmount(data.trialBalanceReconciliation.debitDifference)}</div>
            <div><span>Trial Balance Credits</span>{formatAmount(data.trialBalanceReconciliation.trialBalancePeriodCredits)}</div>
            <div><span>Ledger Summary Credits</span>{formatAmount(data.trialBalanceReconciliation.ledgerSummaryPeriodCredits)}</div>
            <div><span>Credit Difference</span>{formatAmount(data.trialBalanceReconciliation.creditDifference)}</div>
            <div><span>Trial Balance Net Movement</span>{formatAmount(data.trialBalanceReconciliation.trialBalanceNetMovement)}</div>
            <div><span>Ledger Summary Net Movement</span>{formatAmount(data.trialBalanceReconciliation.ledgerSummaryNetMovement)}</div>
            <div><span>Account Rows Different</span>{data.trialBalanceReconciliation.mismatchedAccountCount}</div>
          </div>
        </div>
        <p className="note">
          Trial balance rows are generated from the snapshot table for the selected period and totalled by GL account.
        </p>
        <table className="summaryTable">
          <thead>
            <tr>
              <th>GL Code</th>
              <th>GL Account Name</th>
              <th>Account Type</th>
              <th className="amount">Opening Balance</th>
              <th className="amount">Period Debits</th>
              <th className="amount">Period Credits</th>
              <th className="amount">Net Movement</th>
              <th className="amount">Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.trialBalanceLines.map((line) => (
              <tr key={line.glAccountId}>
                <td>{line.glAccountCode}</td>
                <td>{line.glAccountName}</td>
                <td>{ACCOUNT_TYPE_LABEL[line.accountType] ?? line.accountType}</td>
                <td className="amount">{formatAmount(line.openingBalance)}</td>
                <td className="amount">{formatAmount(line.periodDebits)}</td>
                <td className="amount">{formatAmount(line.periodCredits)}</td>
                <td className="amount">{formatAmount(line.netMovement)}</td>
                <td className="amount">{formatAmount(line.closingBalance)}</td>
              </tr>
            ))}
            {data.trialBalanceLines.length === 0 && (
              <tr><td colSpan={8}>No trial balance activity found.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="reportSection sectionDivider">
        <h2 className="sectionTitle">Ledger Integrity Summary</h2>
        <p className="note">
          Balances are shown as at the report end date. Period debit, credit, and net movement columns show activity posted within the selected date range. This is a ledger balance view, not a statutory Profit & Loss presentation.
        </p>
        <table className="summaryTable">
          <thead>
            <tr>
              <th>GL Code</th>
              <th>GL Account Name</th>
              <th>Account Type</th>
              <th className="amount">Opening Balance</th>
              <th className="amount">Period Debits</th>
              <th className="amount">Period Credits</th>
              <th className="amount">Net Movement</th>
              <th className="amount">Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.ledgerLines.map((line) => (
              <tr key={line.glAccountId}>
                <td>{line.glAccountCode}</td>
                <td>{line.glAccountName}</td>
                <td>{ACCOUNT_TYPE_LABEL[line.accountType] ?? line.accountType}</td>
                <td className="amount">{formatAmount(line.openingBalance)}</td>
                <td className="amount">{formatAmount(line.periodDebits)}</td>
                <td className="amount">{formatAmount(line.periodCredits)}</td>
                <td className="amount">{formatAmount(line.netMovement)}</td>
                <td className="amount">{formatAmount(line.closingBalance)}</td>
              </tr>
            ))}
            {data.ledgerLines.length === 0 && (
              <tr><td colSpan={8}>No ledger activity found.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="reportSection sectionDivider">
        <h2 className="sectionTitle">Document Audit Trail</h2>
        <div className="documentList">
          {data.documents.map((document) => (
            <DocumentBlock
              key={document.key}
              document={document}
              showSubledgerEntries={showSubledgerEntries}
              showSourceDocument={showSourceDocument}
            />
          ))}
          {data.documents.length === 0 && (
            <div className="empty">No documents found for this date range.</div>
          )}
        </div>
      </section>

      <footer className="reportFooter">
        <span>Generated {generatedAt}</span>
      </footer>
    </div>
  );
}


