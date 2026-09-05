import type { DbExecutor } from "@voyzu/capability/db";
import type { InventoryProcessingRuleAction } from "@voyzu/finance/inventory-processing/domain";

import type { UpdateAuditStamp } from "../../../common/server";
import type { FinanceInventoryActivityRow, FinanceInventoryProcessingRuleRow } from "./inventory-processing.row.types";

const COLUMNS = `
  id::int,
  inventory_financial_activity_id::int,
  inventory_transaction_line_id::int,
  inventory_document_code,
  inventory_document_type,
  item_id::int,
  item_code,
  item_name,
  quantity_change::float8,
  reason_code,
  activity_date::text,
  processing_status,
  finance_document_type,
  finance_document_id::int,
  finance_document_code,
  processed_at::text,
  creation_date::text,
  creation_actor_type,
  creation_user_id,
  creation_mutation_id::text,
  updated_date::text,
  updated_actor_type,
  updated_user_id,
  updated_mutation_id::text
`;

const RULE_COLUMNS = `
  rule.id::int,
  rule.inventory_document_type,
  rule.reason_code,
  rule.direction,
  rule.action,
  rule.offset_gl_account_id::int,
  account.code AS offset_gl_account_code,
  account.name AS offset_gl_account_name,
  rule.creation_date::text,
  rule.creation_actor_type,
  rule.creation_user_id,
  rule.creation_mutation_id::text,
  rule.updated_date::text,
  rule.updated_actor_type,
  rule.updated_user_id,
  rule.updated_mutation_id::text
`;

export class InventoryProcessingRepo {
  constructor(private readonly db: DbExecutor) {}

  async list(financeOrganizationId: number): Promise<FinanceInventoryActivityRow[]> {
    const { rows } = await this.db.query(
      `SELECT ${COLUMNS}
       FROM finance_inventory_activity
       WHERE finance_organization_id = $1
       ORDER BY activity_date DESC, id DESC`,
      [financeOrganizationId],
    );
    return rows as unknown as FinanceInventoryActivityRow[];
  }

  async get(financeOrganizationId: number, id: number): Promise<FinanceInventoryActivityRow | null> {
    const { rows } = await this.db.query(
      `SELECT ${COLUMNS}
       FROM finance_inventory_activity
       WHERE finance_organization_id = $1 AND id = $2`,
      [financeOrganizationId, id],
    );
    return (rows[0] as unknown as FinanceInventoryActivityRow | undefined) ?? null;
  }

  async listRules(financeOrganizationId: number): Promise<FinanceInventoryProcessingRuleRow[]> {
    const { rows } = await this.db.query(
      `SELECT ${RULE_COLUMNS}
       FROM finance_inventory_processing_rule rule
       LEFT JOIN gl_account account
         ON account.finance_organization_id = rule.finance_organization_id
        AND account.id = rule.offset_gl_account_id
       WHERE rule.finance_organization_id = $1
       ORDER BY CASE rule.inventory_document_type WHEN 'ADJUSTMENT' THEN 1 WHEN 'RECEIPT' THEN 2 ELSE 3 END,
                rule.reason_code,
                CASE rule.direction WHEN 'INCREASE' THEN 1 ELSE 2 END`,
      [financeOrganizationId],
    );
    return rows as unknown as FinanceInventoryProcessingRuleRow[];
  }

  async getRule(financeOrganizationId: number, id: number): Promise<FinanceInventoryProcessingRuleRow | null> {
    const { rows } = await this.db.query(
      `SELECT ${RULE_COLUMNS}
       FROM finance_inventory_processing_rule rule
       LEFT JOIN gl_account account
         ON account.finance_organization_id = rule.finance_organization_id
        AND account.id = rule.offset_gl_account_id
       WHERE rule.finance_organization_id = $1 AND rule.id = $2`,
      [financeOrganizationId, id],
    );
    return (rows[0] as unknown as FinanceInventoryProcessingRuleRow | undefined) ?? null;
  }

  async hasGlAccount(financeOrganizationId: number, glAccountId: number): Promise<boolean> {
    const { rows } = await this.db.query(
      `SELECT 1 FROM gl_account WHERE finance_organization_id = $1 AND id = $2 AND status = 'ACTIVE'`,
      [financeOrganizationId, glAccountId],
    );
    return rows.length > 0;
  }

  async updateRule(
    financeOrganizationId: number,
    id: number,
    action: InventoryProcessingRuleAction,
    glAccountId: number | null,
    audit: UpdateAuditStamp,
  ): Promise<FinanceInventoryProcessingRuleRow | null> {
    await this.db.query(
      `UPDATE finance_inventory_processing_rule
       SET action = $3,
           offset_gl_account_id = $4,
           updated_date = $5::timestamptz,
           updated_actor_type = $6::actor_type,
           updated_user_id = $7,
           updated_mutation_id = $8::uuid
       WHERE finance_organization_id = $1 AND id = $2`,
      [financeOrganizationId, id, action, glAccountId, audit.timestamp, audit.actorType, audit.userId, audit.mutationId],
    );
    return this.getRule(financeOrganizationId, id);
  }
}
