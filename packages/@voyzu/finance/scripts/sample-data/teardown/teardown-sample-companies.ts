import { FinanceSampleDataRepo } from "../../db/sample-data.repo";
import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

async function main() {
  const pool = getPool();
  const client = await pool.connect();

  try {
    const companyRes = await new FinanceSampleDataRepo(client).listSampleOrganizations();

    if (!companyRes.rows.length) {
      console.log("No SAMP- companies found — nothing to tear down.");
      return;
    }

    const companyIds = companyRes.rows.map((r) => r.id);
    console.log(`Tearing down ${companyIds.length} sample companies: ${companyRes.rows.map((r) => r.code).join(", ")}`);

    const deleteOptionalCompanyRows = async (table: string): Promise<number> => {
      const tableRes = await new FinanceSampleDataRepo(client).tableExists(`public.${table}`);
      if (!tableRes.rows[0]?.exists) return 0;
      const { rowCount } = await new FinanceSampleDataRepo(client).deleteOptionalCompanyRows(companyIds, table);
      return rowCount ?? 0;
    };

    await new FinanceSampleDataRepo(client).begin();
    await new FinanceSampleDataRepo(client).disableTriggers();

    // Clear self-referential journal reversal FKs before deleting journal_header rows
    await new FinanceSampleDataRepo(client).clearJournalReversals(companyIds);

    // audit_change → audit_event (no cascade defined)
    const { rowCount: auditChanges } = await new FinanceSampleDataRepo(client).deleteAuditChanges(companyIds);

    // Subledger entries (reference journal_header, ar_counterparty, fiscal_year, fiscal_period)
    const { rowCount: taxEntries } = await new FinanceSampleDataRepo(client).deleteTaxHeaders(companyIds);
    const { rowCount: inventoryLedgerEntries } = await new FinanceSampleDataRepo(client).deleteInventoryHeaders(companyIds);
    const taxSubledgerEntries = await deleteOptionalCompanyRows("tax_subledger_entry");
    const { rowCount: arEntries } = await new FinanceSampleDataRepo(client).deleteArHeaders(companyIds);
    const { rowCount: apEntries } = await new FinanceSampleDataRepo(client).deleteApHeaders(companyIds);

    // journal_line (journal_line_dimension cascades automatically via ON DELETE CASCADE)
    const { rowCount: journalLines } = await new FinanceSampleDataRepo(client).deleteJournalLines(companyIds);
    const { rowCount: journalHeaders } = await new FinanceSampleDataRepo(client).deleteJournalHeaders(companyIds);

    const { rowCount: counterparties } = await new FinanceSampleDataRepo(client).deleteArCounterparties(companyIds);
    const { rowCount: apCounterparties } = await new FinanceSampleDataRepo(client).deleteApCounterparties(companyIds);
    const counterpartiesGeneric = await deleteOptionalCompanyRows("counterparty");
    const { rowCount: auditEvents } = await new FinanceSampleDataRepo(client).deleteAuditEvents(companyIds);

    const { rowCount: periods } = await new FinanceSampleDataRepo(client).deletePeriods(companyIds);
    const { rowCount: years } = await new FinanceSampleDataRepo(client).deleteYears(companyIds);

    const { rowCount: itemPostingProfiles } = await new FinanceSampleDataRepo(client).deletePostingProfiles(companyIds);

    const { rowCount: financialDocumentDefaults } = await new FinanceSampleDataRepo(client).deleteDocumentDefaults(companyIds);

    const { rowCount: dimensionValues } = await new FinanceSampleDataRepo(client).deleteDimensionValues(companyIds);
    const { rowCount: dimensions } = await new FinanceSampleDataRepo(client).deleteDimensions(companyIds);

    const { rowCount: bankCashAccounts } = await new FinanceSampleDataRepo(client).deleteBankControls(companyIds);
    const { rowCount: inventoryControlAccounts } = await new FinanceSampleDataRepo(client).deleteInventoryControls(companyIds);
    const { rowCount: taxControlAccounts } = await new FinanceSampleDataRepo(client).deleteTaxControls(companyIds);
    const { rowCount: apControlAccountsSettings } = await new FinanceSampleDataRepo(client).deleteApControls(companyIds);
    const { rowCount: arControlAccountsSettings } = await new FinanceSampleDataRepo(client).deleteArControls(companyIds);
    const { rowCount: glAccounts } = await new FinanceSampleDataRepo(client).deleteGlAccounts(companyIds);
    const { rowCount: glAccountCategories } = await new FinanceSampleDataRepo(client).deleteGlCategories(companyIds);

    const { rowCount: companies } = await new FinanceSampleDataRepo(client).deleteOrganizations(companyIds);

    await new FinanceSampleDataRepo(client).enableTriggers();
    await new FinanceSampleDataRepo(client).commit();

    console.log(`Deleted:`);
    console.log(`  ${companies} companies`);
    console.log(`  ${years} fiscal years, ${periods} fiscal periods`);
    console.log(`  ${journalHeaders} journal headers, ${journalLines} journal lines`);
    console.log(`  ${arEntries} AR subledger entries, ${apEntries} AP subledger entries, ${taxEntries} tax ledger entries`);
    console.log(`  ${inventoryLedgerEntries} inventory ledger entries, ${taxSubledgerEntries} tax subledger entries`);
    console.log(`  ${counterparties} AR counterparties`);
    console.log(`  ${apCounterparties} AP counterparties`);
    console.log(`  ${counterpartiesGeneric} counterparties`);
    console.log(`  ${itemPostingProfiles} item posting profiles`);
    console.log(`  ${financialDocumentDefaults} financial document defaults`);
    console.log(`  ${dimensionValues} dimension values, ${dimensions} dimensions`);
    console.log(`  ${bankCashAccounts} bank/cash accounts, ${inventoryControlAccounts} inventory control accounts, ${taxControlAccounts} tax accounts`);
    console.log(`  ${arControlAccountsSettings} AR control accounts, ${apControlAccountsSettings} AP control accounts`);
    console.log(`  ${glAccounts} GL accounts, ${glAccountCategories} GL account categories`);
    console.log(`  ${auditEvents} audit events, ${auditChanges} audit changes`);
  } catch (err) {
    await new FinanceSampleDataRepo(client).rollback();
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
