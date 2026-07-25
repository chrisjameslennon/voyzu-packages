import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import { getPostingCodeAllowedAccountTypes } from "@voyzu/modules/financial-document-processing-engine/posting-code-metadata";

type AccountTypeCode = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
type TargetType = "GENERAL_LEDGER" | "BANK_CASH_ACCOUNT";
type OverrideScope = "HEADER" | "LINE" | "HEADER_AND_LINE";

interface PostingCodeSeed {
  documentCode: string;
  code: string;
  name: string;
  targetType: TargetType;
  allowedAccountTypes: readonly AccountTypeCode[];
  overridePropertyName: string;
  overrideScope: OverrideScope;
  glAccountCode?: string;
  bankCashControlAccountCode?: string;
}

const POSTING_CODES: PostingCodeSeed[] = [
  {
    documentCode: "AP_BILL",
    code: "PURCHASE_ACCOUNT",
    name: "Purchase / expense account",
    targetType: "GENERAL_LEDGER",
    allowedAccountTypes: getPostingCodeAllowedAccountTypes("AP_BILL", "PURCHASE_ACCOUNT"),
    overridePropertyName: "purchase_posting_code",
    overrideScope: "HEADER_AND_LINE",
    glAccountCode: "699000",
  },
  {
    documentCode: "AP_CREDIT_NOTE",
    code: "PURCHASE_REVERSAL_ACCOUNT",
    name: "Purchase / expense reversal account",
    targetType: "GENERAL_LEDGER",
    allowedAccountTypes: getPostingCodeAllowedAccountTypes("AP_CREDIT_NOTE", "PURCHASE_REVERSAL_ACCOUNT"),
    overridePropertyName: "purchase_posting_code",
    overrideScope: "HEADER_AND_LINE",
    glAccountCode: "699000",
  },
  {
    documentCode: "AP_OPENING_BALANCE",
    code: "OPENING_BALANCE_EQUITY_ACCOUNT",
    name: "Opening balance equity account",
    targetType: "GENERAL_LEDGER",
    allowedAccountTypes: getPostingCodeAllowedAccountTypes("AP_OPENING_BALANCE", "OPENING_BALANCE_EQUITY_ACCOUNT"),
    overridePropertyName: "opening_balance_equity_posting_code",
    overrideScope: "HEADER",
    glAccountCode: "300000",
  },
  {
    documentCode: "AP_PAYMENT",
    code: "BANK_CASH_ACCOUNT",
    name: "Payment bank / cash account",
    targetType: "BANK_CASH_ACCOUNT",
    allowedAccountTypes: ["ASSET"],
    overridePropertyName: "bank_cash_account_code",
    overrideScope: "HEADER",
    bankCashControlAccountCode: "BANK_OPERATING",
  },
  {
    documentCode: "AP_REFUND",
    code: "BANK_CASH_ACCOUNT",
    name: "Supplier refund bank / cash account",
    targetType: "BANK_CASH_ACCOUNT",
    allowedAccountTypes: ["ASSET"],
    overridePropertyName: "bank_cash_account_code",
    overrideScope: "HEADER",
    bankCashControlAccountCode: "BANK_OPERATING",
  },
  {
    documentCode: "AP_WRITE_OFF",
    code: "SUPPLIER_WRITE_OFF_INCOME_ACCOUNT",
    name: "Supplier balance write-off income account",
    targetType: "GENERAL_LEDGER",
    allowedAccountTypes: getPostingCodeAllowedAccountTypes("AP_WRITE_OFF", "SUPPLIER_WRITE_OFF_INCOME_ACCOUNT"),
    overridePropertyName: "write_off_income_posting_code",
    overrideScope: "HEADER",
    glAccountCode: "452000",
  },
  {
    documentCode: "AR_CREDIT_NOTE",
    code: "REVENUE_REVERSAL_ACCOUNT",
    name: "Revenue reversal account",
    targetType: "GENERAL_LEDGER",
    allowedAccountTypes: getPostingCodeAllowedAccountTypes("AR_CREDIT_NOTE", "REVENUE_REVERSAL_ACCOUNT"),
    overridePropertyName: "revenue_posting_code",
    overrideScope: "HEADER_AND_LINE",
    glAccountCode: "400000",
  },
  {
    documentCode: "AR_INVOICE",
    code: "REVENUE_ACCOUNT",
    name: "Revenue account",
    targetType: "GENERAL_LEDGER",
    allowedAccountTypes: getPostingCodeAllowedAccountTypes("AR_INVOICE", "REVENUE_ACCOUNT"),
    overridePropertyName: "revenue_posting_code",
    overrideScope: "HEADER_AND_LINE",
    glAccountCode: "400000",
  },
  {
    documentCode: "AR_OPENING_BALANCE",
    code: "OPENING_BALANCE_EQUITY_ACCOUNT",
    name: "Opening balance equity account",
    targetType: "GENERAL_LEDGER",
    allowedAccountTypes: getPostingCodeAllowedAccountTypes("AR_OPENING_BALANCE", "OPENING_BALANCE_EQUITY_ACCOUNT"),
    overridePropertyName: "opening_balance_equity_posting_code",
    overrideScope: "HEADER",
    glAccountCode: "300000",
  },
  {
    documentCode: "AR_RECEIPT",
    code: "BANK_CASH_ACCOUNT",
    name: "Receipt bank / cash account",
    targetType: "BANK_CASH_ACCOUNT",
    allowedAccountTypes: ["ASSET"],
    overridePropertyName: "bank_cash_account_code",
    overrideScope: "HEADER",
    bankCashControlAccountCode: "BANK_OPERATING",
  },
  {
    documentCode: "AR_REFUND",
    code: "BANK_CASH_ACCOUNT",
    name: "Customer refund bank / cash account",
    targetType: "BANK_CASH_ACCOUNT",
    allowedAccountTypes: ["ASSET"],
    overridePropertyName: "bank_cash_account_code",
    overrideScope: "HEADER",
    bankCashControlAccountCode: "BANK_OPERATING",
  },
  {
    documentCode: "AR_WRITE_OFF",
    code: "CUSTOMER_WRITE_OFF_EXPENSE_ACCOUNT",
    name: "Customer balance write-off expense account",
    targetType: "GENERAL_LEDGER",
    allowedAccountTypes: getPostingCodeAllowedAccountTypes("AR_WRITE_OFF", "CUSTOMER_WRITE_OFF_EXPENSE_ACCOUNT"),
    overridePropertyName: "write_off_expense_posting_code",
    overrideScope: "HEADER",
    glAccountCode: "610000",
  },
  {
    documentCode: "TAX_ADJUSTMENT",
    code: "TAX_ADJUSTMENT_OFFSET_ACCOUNT",
    name: "Tax adjustment offset account",
    targetType: "GENERAL_LEDGER",
    allowedAccountTypes: getPostingCodeAllowedAccountTypes("TAX_ADJUSTMENT", "TAX_ADJUSTMENT_OFFSET_ACCOUNT"),
    overridePropertyName: "adjustment_gl_account_code",
    overrideScope: "HEADER",
    glAccountCode: "603000",
  },
  {
    documentCode: "TAX_PAYMENT",
    code: "BANK_CASH_ACCOUNT",
    name: "Tax payment bank / cash account",
    targetType: "BANK_CASH_ACCOUNT",
    allowedAccountTypes: ["ASSET"],
    overridePropertyName: "bank_cash_account_code",
    overrideScope: "HEADER",
    bankCashControlAccountCode: "BANK_OPERATING",
  },
  {
    documentCode: "TAX_REFUND",
    code: "BANK_CASH_ACCOUNT",
    name: "Tax refund bank / cash account",
    targetType: "BANK_CASH_ACCOUNT",
    allowedAccountTypes: ["ASSET"],
    overridePropertyName: "bank_cash_account_code",
    overrideScope: "HEADER",
    bankCashControlAccountCode: "BANK_OPERATING",
  },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Posting Codes...");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM financial_document_default");
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset financial_document_default.");
    }

    await client.query("BEGIN");

    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE is_template = true ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const gas = await client.query(`SELECT company_id, id, code, account_type FROM gl_account`);
    const gaByCompanyAndCode = new Map<string, { id: number; accountType: AccountTypeCode }>(
      gas.rows.map((r: { company_id: number; code: string; id: number; account_type: AccountTypeCode }) => [
        `${r.company_id}:${r.code}`,
        { id: r.id, accountType: r.account_type },
      ]),
    );

    const bankCashAccounts = await client.query(`SELECT bca.company_id, bca.id, bca.code, ga.account_type FROM bank_cash_control_account bca JOIN gl_account ga ON ga.company_id = bca.company_id AND ga.id = bca.gl_account_id`);
    const bankCashByCompanyAndCode = new Map<string, { id: number; accountType: AccountTypeCode }>(
      bankCashAccounts.rows.map((r: { company_id: number; code: string; id: number; account_type: AccountTypeCode }) => [
        `${r.company_id}:${r.code}`,
        { id: r.id, accountType: r.account_type },
      ]),
    );

    for (const company of companies.rows) {
      for (const p of POSTING_CODES) {
        if (p.targetType === "BANK_CASH_ACCOUNT") {
          const bankCashAccount = p.bankCashControlAccountCode ? bankCashByCompanyAndCode.get(`${company.id}:${p.bankCashControlAccountCode}`) : null;
          if (!bankCashAccount) throw new Error(`Missing bank_cash_control_account ${company.code}/${p.bankCashControlAccountCode} for posting code ${p.code}`);
          if (!p.allowedAccountTypes.includes(bankCashAccount.accountType)) {
            throw new Error(`Bank / Cash account ${company.code}/${p.bankCashControlAccountCode} is ${bankCashAccount.accountType}, expected one of ${p.allowedAccountTypes.join(", ")}`);
          }
          continue;
        }

        if (!p.glAccountCode) {
          throw new Error(`Posting code ${p.documentCode}/${p.code} requires glAccountCode`);
        }
        const account = gaByCompanyAndCode.get(`${company.id}:${p.glAccountCode}`);
        if (!account) throw new Error(`Missing gl_account ${company.code}/${p.glAccountCode} for posting code ${p.code}`);
        if (!p.allowedAccountTypes.includes(account.accountType)) {
          throw new Error(`GL account ${company.code}/${p.glAccountCode} is ${account.accountType}, expected one of ${p.allowedAccountTypes.join(", ")}`);
        }
      }
    }

    const sql = `
      INSERT INTO financial_document_default
        (
          company_id, document_code, code, name, target_type, allowed_account_types,
          override_property_name, override_scope,
          gl_account_id, bank_cash_control_account_id, status,
          creation_actor_type, updated_actor_type
        )
      VALUES ($1, $2, $3, $4, $5, $6::text[], $7, $8, $9, $10, 'ACTIVE', 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, document_code, code) DO UPDATE
      SET
        name                         = EXCLUDED.name,
        target_type                  = EXCLUDED.target_type,
        allowed_account_types        = EXCLUDED.allowed_account_types,
        override_property_name       = EXCLUDED.override_property_name,
        override_scope               = EXCLUDED.override_scope,
        gl_account_id                = EXCLUDED.gl_account_id,
        bank_cash_control_account_id = EXCLUDED.bank_cash_control_account_id,
        status                       = 'ACTIVE',
        updated_date                 = NOW(),
        updated_actor_type           = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const p of POSTING_CODES) {
        const account = p.glAccountCode ? gaByCompanyAndCode.get(`${company.id}:${p.glAccountCode}`) : null;
        const bankCashAccount = p.bankCashControlAccountCode ? bankCashByCompanyAndCode.get(`${company.id}:${p.bankCashControlAccountCode}`) : null;
        await client.query(sql, [
          company.id,
          p.documentCode,
          p.code,
          p.name,
          p.targetType,
          p.allowedAccountTypes,
          p.overridePropertyName,
          p.overrideScope,
          account?.id ?? null,
          bankCashAccount?.id ?? null,
        ]);
        console.log(`- ${company.code} ${p.documentCode} - ${p.code}`);
        count++;
      }
    }

    await client.query("COMMIT");
    console.log(`Posting codes seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Posting code seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
