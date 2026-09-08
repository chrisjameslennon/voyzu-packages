import type { DbExecutor } from "@voyzu/capability/db";
import type { QueryResult } from "pg";

export class FinanceSampleDataRepo {
  constructor(private readonly db: DbExecutor) {}

  findFiscalYear(companyCode: string, date: string): Promise<QueryResult<{
    finance_organization_id: number;
    fiscal_year_id: number;
    start_date: string;
    end_date: string;
  }>> {
    return this.db.query(`SELECT fc.id AS finance_organization_id, fy.id AS fiscal_year_id, fy.start_date::text, fy.end_date::text
       FROM organization c
       JOIN finance_organization fc ON fc.organization_id = c.id
       JOIN fiscal_year fy ON fy.finance_organization_id = fc.id
      WHERE c.code = $1
        AND $2::date BETWEEN fy.start_date AND fy.end_date
      LIMIT 1`, [companyCode, date]) as Promise<QueryResult<{
    finance_organization_id: number;
    fiscal_year_id: number;
    start_date: string;
    end_date: string;
  }>>;
  }

  openFiscalYear(yearId: number) {
    return this.db.query(`UPDATE fiscal_year
        SET status = 'OPEN', updated_date = now(), updated_actor_type = 'SYSTEM'
      WHERE id = $1`, [yearId]);
  }

  updateOpenFiscalPeriod(yearId: number, code: string, startDate: string, endDate: string) {
    return this.db.query(`UPDATE fiscal_period
          SET start_date = $3,
              end_date = $4,
              status = 'OPEN',
              updated_date = now(),
              updated_actor_type = 'SYSTEM'
        WHERE fiscal_year_id = $1
          AND code = $2`, [yearId, code, startDate, endDate]);
  }

  insertOpenFiscalPeriod(companyId: number, yearId: number, code: string, name: string, startDate: string, endDate: string) {
    return this.db.query(`INSERT INTO fiscal_period
           (finance_organization_id, fiscal_year_id, code, name, start_date, end_date, status, creation_date, creation_actor_type, updated_actor_type)
         VALUES ($1, $2, $3, $4, $5, $6, 'OPEN', now(), 'SYSTEM', 'SYSTEM')`, [companyId, yearId, code, name, startDate, endDate]);
  }

  findDocumentJournals(companyCode: string, documentIds: string[]): Promise<QueryResult<{ id: number }>> {
    return this.db.query(`SELECT h.id
       FROM journal_header h
       JOIN finance_organization fc ON fc.id = h.finance_organization_id
       JOIN organization c ON c.id = fc.organization_id
      WHERE c.code = $1
        AND h.document_id = ANY($2::text[])`, [companyCode, documentIds]) as Promise<QueryResult<{ id: number }>>;
  }

  findGeneratedInventoryJournals(companyCode: string, documentIds: string[]): Promise<QueryResult<{ id: number }>> {
    return this.db.query(`SELECT h.id
       FROM journal_header h
       JOIN finance_organization fc ON fc.id = h.finance_organization_id
       JOIN organization c ON c.id = fc.organization_id
      WHERE c.code = $1
        AND h.document_type_code IN ('INVENTORY_RECEIPT', 'INVENTORY_ISSUE', 'INVENTORY_ADJUSTMENT')
        AND h.document_snapshot_json->'source'->>'source_document_id' = ANY($2::text[])`, [companyCode, documentIds]) as Promise<QueryResult<{ id: number }>>;
  }

  disableTriggers() {
    return this.db.query(`SET session_replication_role = replica`);
  }

  deleteInventoryLinesForJournals(ids: number[]) {
    return this.db.query(`DELETE FROM inventory_ledger_entry_line
          WHERE inventory_ledger_entry_header_id IN (
            SELECT id FROM inventory_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])
          )`, [ids]);
  }

  deleteInventoryHeadersForJournals(ids: number[]) {
    return this.db.query(`DELETE FROM inventory_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
  }

  deleteTaxHeadersForJournals(ids: number[]) {
    return this.db.query(`DELETE FROM tax_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
  }

  deleteArHeadersForJournals(ids: number[]) {
    return this.db.query(`DELETE FROM ar_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
  }

  deleteApHeadersForJournals(ids: number[]) {
    return this.db.query(`DELETE FROM ap_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
  }

  deleteDimensionsForJournals(ids: number[]) {
    return this.db.query(`DELETE FROM journal_line_dimension
          WHERE journal_line_id IN (SELECT id FROM journal_line WHERE journal_header_id = ANY($1::bigint[]))`, [ids]);
  }

  deleteLinesForJournals(ids: number[]) {
    return this.db.query(`DELETE FROM journal_line WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
  }

  deleteJournals(ids: number[]) {
    return this.db.query(`DELETE FROM journal_header WHERE id = ANY($1::bigint[])`, [ids]);
  }

  enableTriggers() {
    return this.db.query(`SET session_replication_role = DEFAULT`);
  }

  findDocumentJournalCode(companyCode: string, documentId: string | null | undefined): Promise<QueryResult<{ code: string }>> {
    return this.db.query(`SELECT h.code
             FROM journal_header h
             JOIN finance_organization fc ON fc.id = h.finance_organization_id
             JOIN organization c ON c.id = fc.organization_id
            WHERE c.code = $1 AND h.document_id = $2
            LIMIT 1`, [companyCode, documentId]) as Promise<QueryResult<{ code: string }>>;
  }

  listActiveCountries(): Promise<QueryResult<{ code: string; currency_code: string }>> {
    return this.db.query(`SELECT code, currency_code FROM country WHERE status = 'ACTIVE' ORDER BY code`) as Promise<QueryResult<{ code: string; currency_code: string }>>;
  }

  insertFinancialEntity(code: string) {
    return this.db.query(`INSERT INTO finance_organization (
         id, organization_id, tax_filing_anchor_month, tax_filing_interval_months,
         creation_actor_type, updated_actor_type
       )
       SELECT
         c.id, c.id, fc.tax_filing_anchor_month, fc.tax_filing_interval_months,
         'SYSTEM', 'SYSTEM'
       FROM organization c
       JOIN finance_country fc ON fc.code = c.country_code
       WHERE c.code = $1
       ON CONFLICT (organization_id) DO NOTHING`, [code]);
  }

  begin() {
    return this.db.query("BEGIN");
  }

  findOrganization(code: string): Promise<QueryResult<{
      id: number;
      country_code: string;
      status: string;
    }>> {
    return this.db.query(`SELECT id::int, country_code, status
         FROM organization
        WHERE code = $1`, [code]) as Promise<QueryResult<{
      id: number;
      country_code: string;
      status: string;
    }>>;
  }

  upsertFinancialEntity(organizationId: number, countryCode: string): Promise<QueryResult<{ id: number }>> {
    return this.db.query(`INSERT INTO finance_organization (
         id, organization_id, tax_filing_anchor_month, tax_filing_interval_months,
         creation_actor_type, updated_actor_type
       )
       SELECT
         $1, $1, fc.tax_filing_anchor_month, fc.tax_filing_interval_months,
         'SYSTEM', 'SYSTEM'
       FROM finance_country fc
       WHERE fc.code = $2
       ON CONFLICT (organization_id) DO UPDATE SET
         tax_filing_anchor_month = EXCLUDED.tax_filing_anchor_month,
         tax_filing_interval_months = EXCLUDED.tax_filing_interval_months,
         updated_date = NOW(), updated_actor_type = 'SYSTEM'
       RETURNING id::int`, [organizationId, countryCode]) as Promise<QueryResult<{ id: number }>>;
  }

  restoreControlMapping(companyId: number, code: string, name: string, glCode: string, ledger: string, table: string) {
    return this.db.query(`INSERT INTO ${table} (
           finance_organization_id, code, ledger, name, status, gl_account_id,
           creation_actor_type, updated_actor_type
         )
         SELECT $1, $2, $5, $3, 'ACTIVE', ga.id, 'SYSTEM', 'SYSTEM'
         FROM gl_account ga
         WHERE ga.finance_organization_id = $1 AND ga.code = $4
         ON CONFLICT (finance_organization_id, code) DO UPDATE SET
           ledger = EXCLUDED.ledger,
           name = EXCLUDED.name,
           status = EXCLUDED.status,
           gl_account_id = EXCLUDED.gl_account_id,
           updated_date = NOW(), updated_actor_type = 'SYSTEM'`, [companyId, code, name, glCode, ledger]);
  }

  commit() {
    return this.db.query("COMMIT");
  }

  rollback() {
    return this.db.query("ROLLBACK");
  }

  findExistingDocument(companyCode: string, documentId: string) {
    return this.db.query(`SELECT 1
       FROM journal_header h
       JOIN finance_organization fc ON fc.id = h.finance_organization_id
       JOIN organization c ON c.id = fc.organization_id
      WHERE c.code = $1
        AND h.document_id = $2
      LIMIT 1`, [companyCode, documentId]);
  }

  listSampleOrganizations(): Promise<QueryResult<{ id: number; code: string }>> {
    return this.db.query(`SELECT id, code FROM organization WHERE code LIKE 'SAMP-%' ORDER BY code`) as Promise<QueryResult<{ id: number; code: string }>>;
  }

  tableExists(table: string): Promise<QueryResult<{ exists: boolean }>> {
    return this.db.query(`SELECT to_regclass($1) IS NOT NULL AS exists`, [table]) as Promise<QueryResult<{ exists: boolean }>>;
  }

  deleteOptionalCompanyRows(companyIds: number[], table: string) {
    return this.db.query(`DELETE FROM ${table} WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  clearJournalReversals(companyIds: number[]) {
    return this.db.query(`UPDATE journal_header
       SET reversal_of_journal_id = NULL, reversed_by_journal_id = NULL
       WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteAuditChanges(companyIds: number[]) {
    return this.db.query(`DELETE FROM audit_change
       WHERE audit_event_id IN (SELECT id FROM audit_event WHERE organization_id = ANY($1))`, [companyIds]);
  }

  deleteTaxHeaders(companyIds: number[]) {
    return this.db.query(`DELETE FROM tax_ledger_entry_header WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteInventoryHeaders(companyIds: number[]) {
    return this.db.query(`DELETE FROM inventory_ledger_entry_header WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteArHeaders(companyIds: number[]) {
    return this.db.query(`DELETE FROM ar_subledger_entry_header WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteApHeaders(companyIds: number[]) {
    return this.db.query(`DELETE FROM ap_subledger_entry_header WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteJournalLines(companyIds: number[]) {
    return this.db.query(`DELETE FROM journal_line
       WHERE journal_header_id IN (SELECT id FROM journal_header WHERE finance_organization_id = ANY($1))`, [companyIds]);
  }

  deleteJournalHeaders(companyIds: number[]) {
    return this.db.query(`DELETE FROM journal_header WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteArCounterparties(companyIds: number[]) {
    return this.db.query(`DELETE FROM ar_counterparty WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteApCounterparties(companyIds: number[]) {
    return this.db.query(`DELETE FROM ap_counterparty WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteAuditEvents(companyIds: number[]) {
    return this.db.query(`DELETE FROM audit_event WHERE organization_id = ANY($1)`, [companyIds]);
  }

  deletePeriods(companyIds: number[]) {
    return this.db.query(`DELETE FROM fiscal_period WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteYears(companyIds: number[]) {
    return this.db.query(`DELETE FROM fiscal_year WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deletePostingProfiles(companyIds: number[]) {
    return this.db.query(`DELETE FROM item_posting_profile WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteDocumentDefaults(companyIds: number[]) {
    return this.db.query(`DELETE FROM financial_document_default WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteDimensionValues(companyIds: number[]) {
    return this.db.query(`DELETE FROM dimension_value WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteDimensions(companyIds: number[]) {
    return this.db.query(`DELETE FROM dimension WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteBankControls(companyIds: number[]) {
    return this.db.query(`DELETE FROM bank_cash_control_account WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteInventoryControls(companyIds: number[]) {
    return this.db.query(`DELETE FROM inventory_control_account WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteTaxControls(companyIds: number[]) {
    return this.db.query(`DELETE FROM tax_control_account WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteApControls(companyIds: number[]) {
    return this.db.query(`DELETE FROM ap_control_account WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteArControls(companyIds: number[]) {
    return this.db.query(`DELETE FROM ar_control_account WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteGlAccounts(companyIds: number[]) {
    return this.db.query(`DELETE FROM gl_account WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteGlCategories(companyIds: number[]) {
    return this.db.query(`DELETE FROM gl_account_category WHERE finance_organization_id = ANY($1)`, [companyIds]);
  }

  deleteOrganizations(companyIds: number[]) {
    return this.db.query(`DELETE FROM organization WHERE id = ANY($1)`, [companyIds]);
  }
}
