import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import type { Ledger } from "@voyzu-modules/core/types/modules/core";

interface DocProcessingSeed {
  code: string;
  name: string;
  description: string;
  documentPurpose: string;
  primarySupportingLedger: Ledger;
  supportsDimensions?: boolean;
  cashMovement?: boolean;
  supportsItems?: boolean;
}

const DOC_PROCESSORS: DocProcessingSeed[] = [
  { code: "LEDGER_JOURNAL", name: "Ledger Journal", documentPurpose: "Posts a manual journal to the general ledger", description: "Used to post a balanced manual journal directly to the general ledger without creating a supporting ledger document.", primarySupportingLedger: "GENERAL", supportsDimensions: true, cashMovement: true },
  { code: "LEDGER_JOURNAL_REVERSAL", name: "Ledger Journal Reversal", documentPurpose: "Reverses a manual general ledger journal", description: "Used to post a reversal of a previously posted manual general ledger journal while preserving the audit trail.", primarySupportingLedger: "GENERAL", cashMovement: true },

  { code: "AR_INVOICE", name: "Customer Invoice", documentPurpose: "Creates customer receivable", description: "`AR_INVOICE` receives a customer invoice, validates and calculates line, tax and gross amounts, then posts revenue, tax output, and the receivable to the company ledger and AR subledger.", primarySupportingLedger: "ACCOUNTS_RECEIVABLE", supportsDimensions: true, supportsItems: true },
  { code: "AR_INVOICE_CANCELLATION", name: "Invoice Withdrawal", documentPurpose: "Withdraws a fully open customer invoice", description: "Reverses the receivable, revenue, and output tax effects of a posted fully open AR invoice.", primarySupportingLedger: "ACCOUNTS_RECEIVABLE" },
  { code: "AR_CREDIT_NOTE", name: "Customer Credit Note", documentPurpose: "Reduces customer receivable", description: "Reduces customer receivable", primarySupportingLedger: "ACCOUNTS_RECEIVABLE", supportsDimensions: true, supportsItems: true },
  { code: "AR_RECEIPT", name: "Customer Payment", documentPurpose: "Records a customer payment", description: "Posts cash received from a customer and applies it to invoice open items or unapplied cash.", primarySupportingLedger: "ACCOUNTS_RECEIVABLE", cashMovement: true },
  { code: "AR_RECEIPT_APPLICATION", name: "Customer Receipt Application", documentPurpose: "Applies unapplied receipt cash", description: "Reclassifies unapplied customer receipt cash against one or more open AR invoices.", primarySupportingLedger: "ACCOUNTS_RECEIVABLE" },
  { code: "AR_REFUND", name: "Customer Refund", documentPurpose: "Pays money back to customer", description: "Pays money back to customer", primarySupportingLedger: "ACCOUNTS_RECEIVABLE", cashMovement: true },
  { code: "AR_WRITE_OFF", name: "Receivable Write-off", documentPurpose: "Writes off customer balance", description: "Writes off customer balance", primarySupportingLedger: "ACCOUNTS_RECEIVABLE", supportsDimensions: true },
  { code: "AR_OPENING_BALANCE", name: "AR Opening Balance", documentPurpose: "Seeds opening AR balances", description: "Seeds opening AR balances", primarySupportingLedger: "ACCOUNTS_RECEIVABLE", supportsItems: true },

  { code: "AP_BILL", name: "Supplier Bill", documentPurpose: "Creates supplier payable", description: "Creates supplier payable", primarySupportingLedger: "ACCOUNTS_PAYABLE", supportsDimensions: true, supportsItems: true },
  { code: "AP_BILL_CANCELLATION", name: "Bill Withdrawal", documentPurpose: "Withdraws a fully open supplier bill", description: "Withdraws a fully open supplier bill", primarySupportingLedger: "ACCOUNTS_PAYABLE" },
  { code: "AP_CREDIT_NOTE", name: "Supplier Credit Note", documentPurpose: "Reduces supplier payable", description: "Reduces supplier payable", primarySupportingLedger: "ACCOUNTS_PAYABLE", supportsDimensions: true, supportsItems: true },
  { code: "AP_OPENING_BALANCE", name: "AP Opening Balance", documentPurpose: "Seeds opening AP balances", description: "Seeds opening AP balances", primarySupportingLedger: "ACCOUNTS_PAYABLE", supportsItems: true },
  { code: "AP_PAYMENT", name: "Supplier Payment", documentPurpose: "Records supplier payment", description: "Records supplier payment", primarySupportingLedger: "ACCOUNTS_PAYABLE", cashMovement: true },
  { code: "AP_PAYMENT_APPLICATION", name: "Supplier Payment Application", documentPurpose: "Applies unapplied supplier payment", description: "Applies unapplied supplier payment", primarySupportingLedger: "ACCOUNTS_PAYABLE" },
  { code: "AP_REFUND", name: "Supplier Refund", documentPurpose: "Records money received back from supplier", description: "Records money received back from supplier", primarySupportingLedger: "ACCOUNTS_PAYABLE", cashMovement: true },
  { code: "AP_WRITE_OFF", name: "Payable Write-off", documentPurpose: "Writes off supplier balance", description: "Writes off supplier balance", primarySupportingLedger: "ACCOUNTS_PAYABLE", supportsDimensions: true },

  { code: "TAX_PAYMENT", name: "Tax Payment", documentPurpose: "Records a payment made to a tax authority.", description: "Used when the business pays a tax authority to settle a filed return, assessment, outstanding balance, penalty, interest, or other tax amount owed.", primarySupportingLedger: "TAX", cashMovement: true },
  { code: "TAX_REFUND", name: "Tax Refund", documentPurpose: "Records a refund received from a tax authority.", description: "Used when the business receives money from a tax authority for an overpayment, credit balance, refundable tax position, or authority-issued refund.", primarySupportingLedger: "TAX", cashMovement: true },
  { code: "TAX_ADJUSTMENT", name: "Tax Adjustment", documentPurpose: "Records tax balance adjustments not sourced from AR/AP.", description: "Used to accept an authority assessment or record a correction, penalty, interest, rounding difference, or other tax movement outside AR/AP source documents.", primarySupportingLedger: "TAX" },

  { code: "INVENTORY_RECEIPT", name: "Inventory Receipt", documentPurpose: "Records inventory value and quantity received", description: "Records inventory value and quantity coming into the inventory ledger.", primarySupportingLedger: "INVENTORY", supportsDimensions: true, supportsItems: true },
  { code: "INVENTORY_ISSUE", name: "Inventory Issue", documentPurpose: "Records inventory value and quantity issued", description: "Records inventory value and quantity leaving the inventory ledger.", primarySupportingLedger: "INVENTORY", supportsDimensions: true, supportsItems: true },
  { code: "INVENTORY_ADJUSTMENT", name: "Inventory Adjustment", documentPurpose: "Records inventory quantity or value corrections", description: "Records corrections to inventory quantity or book value.", primarySupportingLedger: "INVENTORY", supportsDimensions: true, supportsItems: true },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Financial Document Processing...");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM financial_document_type");
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset financial_document_type table.");
    }

    await client.query("BEGIN");

    const upsertProcessor = `
      INSERT INTO financial_document_type
        (code, name, description, document_purpose, primary_supporting_ledger, supports_dimensions, cash_movement, supports_items, status, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVE', 'SYSTEM', 'SYSTEM')
      ON CONFLICT (code) DO UPDATE
      SET name                              = EXCLUDED.name,
          description                       = EXCLUDED.description,
          document_purpose                  = EXCLUDED.document_purpose,
          primary_supporting_ledger = EXCLUDED.primary_supporting_ledger,
          supports_dimensions               = EXCLUDED.supports_dimensions,
          cash_movement                     = EXCLUDED.cash_movement,
          supports_items                    = EXCLUDED.supports_items,
          status                            = 'ACTIVE',
          updated_date                      = NOW(),
          updated_actor_type                = 'SYSTEM'
    `;

    let count = 0;
    for (const d of DOC_PROCESSORS) {
      await client.query(upsertProcessor, [
        d.code,
        d.name,
        d.description,
        d.documentPurpose,
        d.primarySupportingLedger,
        d.supportsDimensions ?? false,
        d.cashMovement ?? false,
        d.supportsItems ?? false,
      ]);

      console.log(`- ${d.code} - ${d.name}`);
      count++;
    }

    await client.query("COMMIT");
    console.log(`Financial document processors seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Doc processing seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
