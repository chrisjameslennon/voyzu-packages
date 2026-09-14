import { getDb } from "@voyzu/capability/db";
import { BusinessRuleError } from "@voyzu/capability/errors";
import type { ArInvoiceStatementResponseDto } from "../../types/ar-invoice-statement.response.dto";
import type { OrganizationResponseDto } from "@voyzu/types/business-objects/organization";
import { listArSubledgerEntries } from "../../../ar-subledger-ledger-entries/server/index";
import { ArInvoiceStatementRepo } from "../db/ar-invoice-statement.repo";

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function getArInvoiceStatementUnchecked(company: OrganizationResponseDto, documentId: string): Promise<ArInvoiceStatementResponseDto | null> {
  const entries = await listArSubledgerEntries(company.id);
  const invoiceEntry = entries.find((entry) => entry.documentTypeCode === "AR_INVOICE" && entry.documentId === documentId && entry.entryType === "DEBIT");
  if (!invoiceEntry) return null;

  const invoice = await new ArInvoiceStatementRepo(getDb()).getInvoiceSnapshot(invoiceEntry.id);
  if (!invoice) throw new BusinessRuleError(`Posted invoice ${documentId} has no document snapshot`);

  const appliedRows = await new ArInvoiceStatementRepo(getDb()).listAppliedTransactions(invoiceEntry.id);
  const transactions = appliedRows.map((row) => {
    const source = entries.find((candidate) => candidate.code === row.code);
    return {
      code: row.code,
      journalCode: row.journal_code,
      postingDate: row.posting_date,
      documentDate: row.document_date,
      documentTypeCode: row.document_type_code,
      documentTypeLabel: row.document_type_label,
      documentId: row.document_id,
      documentRef: row.document_id,
      memo: source?.memo ?? null,
      amount: row.amount,
    };
  });
  const invoiceAmount = invoiceEntry.baseCurrencyAmount;
  const appliedAmount = roundMoney(transactions.reduce((sum, transaction) => sum + transaction.amount, 0));

  return {
    company,
    invoiceEntryCode: invoiceEntry.code,
    invoice,
    counterpartyCode: invoiceEntry.counterpartyCode,
    counterpartyName: invoiceEntry.counterpartyName,
    invoiceAmount,
    appliedAmount,
    openBalance: roundMoney(invoiceAmount - appliedAmount),
    transactions,
  };
}

export const getArInvoiceStatement = getArInvoiceStatementUnchecked;
