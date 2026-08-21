import { getDb } from "@voyzu/capability/db";
import type {
  ArCounterpartyStatementApplicationDto,
  ArCounterpartyStatementGroupDto,
  ArCounterpartyStatementResponseDto,
  ArCounterpartySummaryResponseDto,
} from "@voyzu/core/types/modules/ar-subledger";
import type { CompanyResponseDto } from "@voyzu/organization/types/modules/companies";

import { ArSubledgerStatementRepo } from "../db/ar-subledger-statement.repo";

function repo(): ArSubledgerStatementRepo {
  return new ArSubledgerStatementRepo(getDb());
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function listArCounterpartySummariesUnchecked(companyId: number): Promise<ArCounterpartySummaryResponseDto[]> {
  const rows = await repo().listCounterpartySummaries(companyId);
  return rows.map((row) => ({
    counterpartyCode: row.counterparty_code,
    counterpartyName: row.counterparty_name,
    openInvoicesAmount: roundMoney(row.open_invoices_amount),
    unappliedReceiptsAmount: roundMoney(row.unapplied_receipts_amount),
    netBalance: roundMoney(row.net_balance),
  }));
}

async function getArCounterpartyStatementUnchecked(
  company: CompanyResponseDto,
  counterpartyCode: string,
): Promise<ArCounterpartyStatementResponseDto | null> {
  const rows = await repo().listCounterpartyStatementRows(company.id, counterpartyCode);
  if (!rows.length) return null;

  const meta = rows[0]!;
  const sortRows = <T extends { posting_date: string; code: string }>(arr: T[]): T[] =>
    arr.sort((a, b) => a.posting_date.localeCompare(b.posting_date) || a.code.localeCompare(b.code));

  const childrenByParent = new Map<number, typeof rows>();
  const rootRows: typeof rows = [];

  for (const row of rows) {
    if (row.parent_entry_header_id) {
      const arr = childrenByParent.get(row.parent_entry_header_id) ?? [];
      arr.push(row);
      childrenByParent.set(row.parent_entry_header_id, arr);
    } else {
      rootRows.push(row);
    }
  }

  sortRows(rootRows);

  const toApplication = (row: typeof rows[number]): ArCounterpartyStatementApplicationDto => ({
    code: row.code,
    postingDate: row.posting_date,
    documentTypeCode: row.document_type_code,
    documentTypeLabel: row.document_type_label,
    documentId: row.document_id,
    documentRef: row.document_id,
    memo: row.memo,
    description: row.description,
    entryType: row.entry_type,
    debit: row.entry_type === "DEBIT" ? row.base_currency_amount : 0,
    credit: row.entry_type === "CREDIT" ? row.base_currency_amount : 0,
  });

  const groups: ArCounterpartyStatementGroupDto[] = rootRows.map((root) => {
    const children = sortRows(childrenByParent.get(root.entry_header_id) ?? []);
    const rootDebit = root.entry_type === "DEBIT" ? root.base_currency_amount : 0;
    const rootCredit = root.entry_type === "CREDIT" ? root.base_currency_amount : 0;
    const childrenSigned = children.reduce(
      (sum, child) => sum + (child.entry_type === "DEBIT" ? child.base_currency_amount : -child.base_currency_amount),
      0,
    );
    return {
      code: root.code,
      postingDate: root.posting_date,
      documentTypeCode: root.document_type_code,
      documentTypeLabel: root.document_type_label,
      documentId: root.document_id,
      documentRef: root.document_id,
      memo: root.memo,
      description: root.description,
      entryType: root.entry_type,
      debit: rootDebit,
      credit: rootCredit,
      openBalance: roundMoney(rootDebit - rootCredit + childrenSigned),
      applications: children.map(toApplication),
    };
  });

  const displayedRows = groups.flatMap((group) => [
    { debit: group.debit, credit: group.credit },
    ...group.applications.map((application) => ({ debit: application.debit, credit: application.credit })),
  ]);
  const totalDebit = roundMoney(displayedRows.reduce((sum, row) => sum + row.debit, 0));
  const totalCredit = roundMoney(displayedRows.reduce((sum, row) => sum + row.credit, 0));
  const today = new Date();
  const asAtDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return {
    company,
    counterpartyCode: meta.counterparty_code,
    counterpartyName: meta.counterparty_name,
    baseCurrencyCode: meta.base_currency_code,
    asAtDate,
    totalDebit,
    totalCredit,
    totalOwing: roundMoney(totalDebit - totalCredit),
    groups,
  };
}

export const listArCounterpartySummaries = listArCounterpartySummariesUnchecked;
export const getArCounterpartyStatement = getArCounterpartyStatementUnchecked;
