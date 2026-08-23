import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

async function main() {
  const pool = getPool();
  const client = await pool.connect();

  try {
    const companyRes = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE code LIKE 'SAMP-%' ORDER BY code`,
    );

    if (!companyRes.rows.length) {
      console.log("No SAMP- companies found — nothing to tear down.");
      return;
    }

    const companyIds = companyRes.rows.map((r) => r.id);
    console.log(`Tearing down ${companyIds.length} sample companies: ${companyRes.rows.map((r) => r.code).join(", ")}`);

    const deleteOptionalCompanyRows = async (table: string): Promise<number> => {
      const tableRes = await client.query<{ exists: boolean }>(
        `SELECT to_regclass($1) IS NOT NULL AS exists`,
        [`public.${table}`],
      );
      if (!tableRes.rows[0]?.exists) return 0;
      const { rowCount } = await client.query(`DELETE FROM ${table} WHERE finance_company_id = ANY($1)`, [companyIds]);
      return rowCount ?? 0;
    };

    await client.query("BEGIN");
    await client.query("SET session_replication_role = replica");

    // Clear self-referential journal reversal FKs before deleting journal_header rows
    await client.query(
      `UPDATE journal_header
       SET reversal_of_journal_id = NULL, reversed_by_journal_id = NULL
       WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );

    // audit_change → audit_event (no cascade defined)
    const { rowCount: auditChanges } = await client.query(
      `DELETE FROM audit_change
       WHERE audit_event_id IN (SELECT id FROM audit_event WHERE company_id = ANY($1))`,
      [companyIds],
    );

    // Subledger entries (reference journal_header, ar_counterparty, fiscal_year, fiscal_period)
    const { rowCount: taxEntries } = await client.query(
      `DELETE FROM tax_ledger_entry_header WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: inventoryLedgerEntries } = await client.query(
      `DELETE FROM inventory_ledger_entry_header WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const taxSubledgerEntries = await deleteOptionalCompanyRows("tax_subledger_entry");
    const { rowCount: arEntries } = await client.query(
      `DELETE FROM ar_subledger_entry_header WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: apEntries } = await client.query(
      `DELETE FROM ap_subledger_entry_header WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );

    // journal_line (journal_line_dimension cascades automatically via ON DELETE CASCADE)
    const { rowCount: journalLines } = await client.query(
      `DELETE FROM journal_line
       WHERE journal_header_id IN (SELECT id FROM journal_header WHERE finance_company_id = ANY($1))`,
      [companyIds],
    );
    const { rowCount: journalHeaders } = await client.query(
      `DELETE FROM journal_header WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );

    const { rowCount: counterparties } = await client.query(
      `DELETE FROM ar_counterparty WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: apCounterparties } = await client.query(
      `DELETE FROM ap_counterparty WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const counterpartiesGeneric = await deleteOptionalCompanyRows("counterparty");
    const { rowCount: auditEvents } = await client.query(
      `DELETE FROM audit_event WHERE company_id = ANY($1)`,
      [companyIds],
    );

    const { rowCount: periods } = await client.query(
      `DELETE FROM fiscal_period WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: years } = await client.query(
      `DELETE FROM fiscal_year WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );

    const { rowCount: inventoryItems } = await client.query(
      `DELETE FROM inventory_item WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: inventoryCategories } = await client.query(
      `DELETE FROM inventory_category WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: itemPostingProfiles } = await client.query(
      `DELETE FROM item_posting_profile WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );

    const { rowCount: financialDocumentDefaults } = await client.query(
      `DELETE FROM financial_document_default WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );

    const { rowCount: dimensionValues } = await client.query(
      `DELETE FROM dimension_value WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: dimensions } = await client.query(
      `DELETE FROM dimension WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );

    const { rowCount: bankCashAccounts } = await client.query(
      `DELETE FROM bank_cash_control_account WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: inventoryControlAccounts } = await client.query(
      `DELETE FROM inventory_control_account WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: taxControlAccounts } = await client.query(
      `DELETE FROM tax_control_account WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: apControlAccountsSettings } = await client.query(
      `DELETE FROM ap_control_account WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: arControlAccountsSettings } = await client.query(
      `DELETE FROM ar_control_account WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: glAccounts } = await client.query(
      `DELETE FROM gl_account WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );
    const { rowCount: glAccountCategories } = await client.query(
      `DELETE FROM gl_account_category WHERE finance_company_id = ANY($1)`,
      [companyIds],
    );

    const { rowCount: companies } = await client.query(
      `DELETE FROM company WHERE id = ANY($1)`,
      [companyIds],
    );

    await client.query("SET session_replication_role = DEFAULT");
    await client.query("COMMIT");

    console.log(`Deleted:`);
    console.log(`  ${companies} companies`);
    console.log(`  ${years} fiscal years, ${periods} fiscal periods`);
    console.log(`  ${journalHeaders} journal headers, ${journalLines} journal lines`);
    console.log(`  ${arEntries} AR subledger entries, ${apEntries} AP subledger entries, ${taxEntries} tax ledger entries`);
    console.log(`  ${inventoryLedgerEntries} inventory ledger entries, ${taxSubledgerEntries} tax subledger entries`);
    console.log(`  ${counterparties} AR counterparties`);
    console.log(`  ${apCounterparties} AP counterparties`);
    console.log(`  ${counterpartiesGeneric} counterparties`);
    console.log(`  ${inventoryItems} inventory items, ${itemPostingProfiles} item posting profiles, ${inventoryCategories} inventory categories`);
    console.log(`  ${financialDocumentDefaults} financial document defaults`);
    console.log(`  ${dimensionValues} dimension values, ${dimensions} dimensions`);
    console.log(`  ${bankCashAccounts} bank/cash accounts, ${inventoryControlAccounts} inventory control accounts, ${taxControlAccounts} tax accounts`);
    console.log(`  ${arControlAccountsSettings} AR control accounts, ${apControlAccountsSettings} AP control accounts`);
    console.log(`  ${glAccounts} GL accounts, ${glAccountCategories} GL account categories`);
    console.log(`  ${auditEvents} audit events, ${auditChanges} audit changes`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
