import type { DbExecutor } from "@voyzu/capability/db";

export class ArReceiptApplicationPostingRepo {
  constructor(readonly db: DbExecutor) {}

  async insertEntryLine(input: { headerId: number; sequence: number; description: string; control: string; drCr: "DR" | "CR"; amount: number; sourceId: number | null; targetId: number | null; memo: string | null }): Promise<number> {
    const { rows } = await this.db.query(
      `INSERT INTO ar_subledger_entry_line
         (ar_subledger_entry_header_id, line_number, line_type, description, control_account_code,
          dr_cr, gross_amount, source_entry_header_id, target_entry_header_id, base_currency_amount,
          memo, creation_date, creation_actor_type)
       VALUES ($1,$2,'RECEIPT_APPLICATION',$3,$4,$5,$6,$7,$8,$9,$10,now(),'SYSTEM')
       RETURNING id`,
      [input.headerId, input.sequence, input.description, input.control, input.drCr, input.amount, input.sourceId, input.targetId, input.amount, input.memo],
    );
    return Number(rows[0].id);
  }

  async insertHeader(input: { code: string; companyId: number; journalHeaderId: number; counterpartyId: number; documentId: string; description: string; memo: string | null; documentDate: string; postingDate: string; financialYearId: number; financialPeriodId: number; baseCurrencyCode: string }): Promise<number> {
    const { rows } = await this.db.query(
      `INSERT INTO ar_subledger_entry_header
         (code, finance_organization_id, journal_header_id, ar_counterparty_id, document_type_code,
          document_id, description, memo, document_date, posting_date, financial_year_id,
          financial_period_id, base_currency_code, status, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,'AR_RECEIPT_APPLICATION',$5,$6,$7,$8,$9,$10,$11,$12,'POSTED',now(),'SYSTEM')
       RETURNING id`,
      [input.code, input.companyId, input.journalHeaderId, input.counterpartyId, input.documentId, input.description, input.memo, input.documentDate, input.postingDate, input.financialYearId, input.financialPeriodId, input.baseCurrencyCode],
    );
    return Number(rows[0].id);
  }
}
