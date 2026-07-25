import { getDb } from "@voyzu/capability/db";
import type { CompanyResponseDto } from "@voyzu/types/modules/companies";
import type {
  ApCounterpartyStatementApplicationDto,
  ApCounterpartyStatementGroupDto,
  ApCounterpartyStatementResponseDto,
  ApCounterpartySummaryResponseDto,
} from "@voyzu/types/modules/ap-subledger";

import { ApSubledgerStatementRepo } from "../db/ap-subledger-statement.repo";

function repo(): ApSubledgerStatementRepo {
  return new ApSubledgerStatementRepo(getDb());
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function listApCounterpartySummaries(companyId: number): Promise<ApCounterpartySummaryResponseDto[]> {
  const rows = await repo().listCounterpartySummaries(companyId);
  return rows.map((row) => ({
    counterpartyCode: row.counterparty_code,
    counterpartyName: row.counterparty_name,
    openBillsAmount: roundMoney(row.open_bills_amount),
    unappliedPaymentsAmount: roundMoney(row.unapplied_payments_amount),
    netBalance: roundMoney(row.net_balance),
  }));
}

export async function getApCounterpartyStatement(
  company: CompanyResponseDto,
  counterpartyCode: string,
): Promise<ApCounterpartyStatementResponseDto | null> {
  const rows = await repo().listCounterpartyStatementRows(company.id, counterpartyCode);
  if (!rows.length) return null;

  const meta = rows[0]!;
  const groups: ApCounterpartyStatementGroupDto[] = rows.map((row) => {
    const debit = row.entry_type === "DEBIT" ? row.base_currency_amount : 0;
    const credit = row.entry_type === "CREDIT" ? row.base_currency_amount : 0;
    return {
      code: row.code,
      postingDate: row.posting_date,
      documentTypeCode: row.document_type_code,
      documentTypeLabel: row.document_type_label,
      documentId: row.document_id,
      documentRef: row.document_id,
      appliedToDocumentId: row.applied_to_document_id,
      memo: row.memo,
      description: row.description,
      entryType: row.entry_type,
      debit,
      credit,
      openBalance: roundMoney(credit - debit),
      applications: [] satisfies ApCounterpartyStatementApplicationDto[],
    };
  });

  const totalDebit = roundMoney(groups.reduce((sum, group) => sum + group.debit, 0));
  const totalCredit = roundMoney(groups.reduce((sum, group) => sum + group.credit, 0));
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
    totalOwing: roundMoney(totalCredit - totalDebit),
    groups,
  };
}
