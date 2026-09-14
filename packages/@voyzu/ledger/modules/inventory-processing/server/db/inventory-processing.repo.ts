import type { DbExecutor } from "@voyzu/capability/db";
import type { InventoryProcessingRuleAction } from "../../domain/index";
import type { ProcessInventoryMovementRequest } from "../../types/index";

import type { CreationAuditStamp, UpdateAuditStamp } from "../../../common/server/index";
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

  async getForProcessing(financeOrganizationId: number, id: number): Promise<FinanceInventoryActivityRow | null> {
    const { rows } = await this.db.query(
      `SELECT ${COLUMNS}
       FROM finance_inventory_activity
       WHERE finance_organization_id = $1 AND id = $2
       FOR UPDATE`,
      [financeOrganizationId, id],
    );
    return (rows[0] as unknown as FinanceInventoryActivityRow | undefined) ?? null;
  }

  async getFinanceOrganizationId(organizationId: number): Promise<number | null> {
    const { rows } = await this.db.query(
      `SELECT id::int FROM finance_organization WHERE organization_id = $1`,
      [organizationId],
    );
    return rows[0]?.id == null ? null : Number(rows[0].id);
  }

  async ingestMovement(
    financeOrganizationId: number,
    movement: ProcessInventoryMovementRequest,
    audit: CreationAuditStamp,
  ): Promise<FinanceInventoryActivityRow> {
    await this.db.query(
      `INSERT INTO finance_inventory_activity (
         finance_organization_id,
         inventory_financial_activity_id,
         inventory_transaction_line_id,
         inventory_document_code,
         inventory_document_type,
         item_id,
         item_code,
         item_name,
         quantity_change,
         reason_code,
         activity_date,
         creation_date,
         creation_actor_type,
         creation_user_id,
         creation_mutation_id
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::timestamptz,$12::timestamptz,$13::actor_type,$14,$15::uuid)
       ON CONFLICT (finance_organization_id, inventory_financial_activity_id) DO NOTHING`,
      [
        financeOrganizationId,
        movement.inventoryFinancialActivityId,
        movement.inventoryTransactionLineId,
        movement.inventoryDocumentCode,
        movement.inventoryDocumentType,
        movement.itemId,
        movement.itemCode,
        movement.itemName,
        movement.quantityChange,
        movement.reasonCode,
        movement.activityDate,
        audit.timestamp,
        audit.actorType,
        audit.userId,
        audit.mutationId,
      ],
    );
    const { rows } = await this.db.query(
      `SELECT ${COLUMNS}
       FROM finance_inventory_activity
       WHERE finance_organization_id = $1 AND inventory_financial_activity_id = $2`,
      [financeOrganizationId, movement.inventoryFinancialActivityId],
    );
    const row = rows[0] as unknown as FinanceInventoryActivityRow | undefined;
    if (!row) throw new Error("Finance inventory activity ingestion did not return a row");
    return row;
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

  async getRuleForMovement(
    financeOrganizationId: number,
    documentType: FinanceInventoryProcessingRuleRow["inventory_document_type"],
    reasonCode: string,
    direction: FinanceInventoryProcessingRuleRow["direction"],
  ): Promise<FinanceInventoryProcessingRuleRow | null> {
    const { rows } = await this.db.query(
      `SELECT ${RULE_COLUMNS}
       FROM finance_inventory_processing_rule rule
       LEFT JOIN gl_account account
         ON account.finance_organization_id = rule.finance_organization_id
        AND account.id = rule.offset_gl_account_id
       WHERE rule.finance_organization_id = $1
         AND rule.inventory_document_type = $2
         AND rule.reason_code = $3
         AND rule.direction = $4`,
      [financeOrganizationId, documentType, reasonCode, direction],
    );
    return (rows[0] as unknown as FinanceInventoryProcessingRuleRow | undefined) ?? null;
  }

  async getOrganizationCode(financeOrganizationId: number): Promise<string | null> {
    const { rows } = await this.db.query(
      `SELECT organization.code
       FROM finance_organization finance
       JOIN organization ON organization.id = finance.organization_id
       WHERE finance.id = $1`,
      [financeOrganizationId],
    );
    return rows[0]?.code == null ? null : String(rows[0].code);
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

  async markActivityProcessed(
    financeOrganizationId: number,
    id: number,
    financeDocumentType: string,
    financeDocumentId: number,
    financeDocumentCode: string,
    audit: UpdateAuditStamp,
  ): Promise<FinanceInventoryActivityRow | null> {
    await this.db.query(
      `UPDATE finance_inventory_activity
       SET processing_status = 'PROCESSED',
           finance_document_type = $3,
           finance_document_id = $4,
           finance_document_code = $5,
           processed_at = $6::timestamptz,
           updated_date = $6::timestamptz,
           updated_actor_type = $7::actor_type,
           updated_user_id = $8,
           updated_mutation_id = $9::uuid
       WHERE finance_organization_id = $1 AND id = $2`,
      [
        financeOrganizationId,
        id,
        financeDocumentType,
        financeDocumentId,
        financeDocumentCode,
        audit.timestamp,
        audit.actorType,
        audit.userId,
        audit.mutationId,
      ],
    );
    return this.get(financeOrganizationId, id);
  }
}
