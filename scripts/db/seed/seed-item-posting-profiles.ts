import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type ItemPostingProfileSeed = {
  code: string;
  name: string;
  description: string;
  isSold: boolean;
  isPurchased: boolean;
  isConsumed: boolean;
  revenueCode?: string;
  cogsCode?: string;
  purchaseExpenseCode?: string;
  consumptionCode?: string;
  adjustmentGainCode?: string;
  adjustmentLossCode?: string;
  status: "ACTIVE" | "INACTIVE";
};

const PROFILES: ItemPostingProfileSeed[] = [
  { code: "CONSUMABLES", name: "Consumables", description: "Inventory held for internal consumption and charged to consumption expense when used", isSold: false, isPurchased: true, isConsumed: true, purchaseExpenseCode: "613000", consumptionCode: "613000", adjustmentGainCode: "405000", adjustmentLossCode: "505000", status: "ACTIVE" },
  { code: "FINISHED_GOODS", name: "Finished Goods", description: "Manufactured or assembled goods held in inventory and relieved to cost of goods sold when sold", isSold: true, isPurchased: false, isConsumed: false, revenueCode: "400000", cogsCode: "500000", adjustmentGainCode: "405000", adjustmentLossCode: "505000", status: "ACTIVE" },
  { code: "FREIGHT_COSTS", name: "Freight Costs", description: "Freight and courier charges purchased and expensed without inventory tracking", isSold: false, isPurchased: true, isConsumed: false, purchaseExpenseCode: "614000", status: "ACTIVE" },
  { code: "NON_INVENTORY_PURCHASES", name: "Non-inventory Purchases", description: "Goods and charges expensed when purchased without inventory tracking", isSold: false, isPurchased: true, isConsumed: false, purchaseExpenseCode: "612000", status: "ACTIVE" },
  { code: "PACKAGING", name: "Packaging", description: "Packaging materials held in inventory and consumed during fulfilment", isSold: false, isPurchased: true, isConsumed: true, purchaseExpenseCode: "503000", consumptionCode: "503000", adjustmentGainCode: "405000", adjustmentLossCode: "505000", status: "ACTIVE" },
  { code: "RAW_MATERIALS", name: "Raw Materials", description: "Materials and components held in inventory and consumed into production", isSold: false, isPurchased: true, isConsumed: true, purchaseExpenseCode: "504000", consumptionCode: "504000", adjustmentGainCode: "405000", adjustmentLossCode: "505000", status: "ACTIVE" },
  { code: "RESALE_GOODS", name: "Resale Goods", description: "Goods purchased into inventory for resale and relieved to cost of goods sold when sold", isSold: true, isPurchased: true, isConsumed: false, revenueCode: "400000", cogsCode: "500000", purchaseExpenseCode: "500000", adjustmentGainCode: "405000", adjustmentLossCode: "505000", status: "ACTIVE" },
  { code: "SERVICES", name: "Services", description: "Services recognised as revenue when sold or service expense when purchased", isSold: true, isPurchased: true, isConsumed: false, revenueCode: "403000", cogsCode: "501000", purchaseExpenseCode: "501000", status: "ACTIVE" },
  { code: "SPARE_PARTS", name: "Spare Parts", description: "Parts held in inventory and either sold or consumed for maintenance or repair", isSold: true, isPurchased: true, isConsumed: true, revenueCode: "400000", cogsCode: "500000", purchaseExpenseCode: "500000", consumptionCode: "611000", adjustmentGainCode: "405000", adjustmentLossCode: "505000", status: "ACTIVE" },
  { code: "WIP_GOODS", name: "Work in Progress", description: "Part-complete goods held as work-in-progress inventory during production", isSold: false, isPurchased: false, isConsumed: true, consumptionCode: "504000", adjustmentGainCode: "405000", adjustmentLossCode: "505000", status: "ACTIVE" },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Item Posting Profiles...");
    if (reset) {
      await client.query("DELETE FROM item_posting_profile");
      console.log("Reset item_posting_profile table.");
    }

    await client.query("BEGIN");
    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE is_template = true ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const accounts = await client.query<{ company_id: number; id: number; code: string }>("SELECT company_id, id, code FROM gl_account");
    const accountByCompanyAndCode = new Map(accounts.rows.map((row) => [`${row.company_id}:${row.code}`, row.id]));
    const accountId = (companyId: number, code?: string) => {
      if (!code) return null;
      const id = accountByCompanyAndCode.get(`${companyId}:${code}`);
      if (!id) throw new Error(`Missing gl_account.code=${code}`);
      return id;
    };

    const sql = `
      INSERT INTO item_posting_profile (
        company_id, code, name, description, is_sold, is_purchased, is_consumed,
        revenue_gl_account_id, cogs_gl_account_id, purchase_expense_gl_account_id,
        consumption_gl_account_id, adjustment_gain_gl_account_id, adjustment_loss_gl_account_id,
        status,
        creation_actor_type,
        updated_actor_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          is_sold = EXCLUDED.is_sold,
          is_purchased = EXCLUDED.is_purchased,
          is_consumed = EXCLUDED.is_consumed,
          revenue_gl_account_id = EXCLUDED.revenue_gl_account_id,
          cogs_gl_account_id = EXCLUDED.cogs_gl_account_id,
          purchase_expense_gl_account_id = EXCLUDED.purchase_expense_gl_account_id,
          consumption_gl_account_id = EXCLUDED.consumption_gl_account_id,
          adjustment_gain_gl_account_id = EXCLUDED.adjustment_gain_gl_account_id,
          adjustment_loss_gl_account_id = EXCLUDED.adjustment_loss_gl_account_id,
          status = EXCLUDED.status,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const profile of PROFILES) {
        await client.query(sql, [
          company.id,
          profile.code,
          profile.name,
          profile.description,
          profile.isSold,
          profile.isPurchased,
          profile.isConsumed,
          accountId(company.id, profile.revenueCode),
          accountId(company.id, profile.cogsCode),
          accountId(company.id, profile.purchaseExpenseCode),
          accountId(company.id, profile.consumptionCode),
          accountId(company.id, profile.adjustmentGainCode),
          accountId(company.id, profile.adjustmentLossCode),
          profile.status,
        ]);
        console.log(`- ${company.code} ${profile.code} - ${profile.name}`);
        count++;
      }
    }

    await client.query("COMMIT");
    console.log(`Item posting profiles seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Item posting profile seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
