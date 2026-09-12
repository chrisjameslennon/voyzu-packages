import { getDb } from "@voyzu/capability/db";
import { withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import {
  InventoryProcessingRuleAction,
  isInventoryProcessingRuleActionAllowed,
} from "../../domain/index";
import type { FinanceInventoryActivity, FinanceInventoryProcessingRule, FinanceInventoryProcessingRulePatch } from "../../types/index";
import { createUpdateAuditStamp, withAuditActors } from "../../../common/server/index";
import { assertCompanySettingsWritable } from "../../../finance-companies/server/lib/settings-scope";

import { InventoryProcessingRepo } from "../db/inventory-processing.repo";
import type { FinanceInventoryActivityRow, FinanceInventoryProcessingRuleRow } from "../db/inventory-processing.row.types";

function iso(value: string | null): string | null {
  return value == null ? null : new Date(value).toISOString();
}

function toDto(row: FinanceInventoryActivityRow): FinanceInventoryActivity {
  return {
    id: Number(row.id),
    inventoryFinancialActivityId: Number(row.inventory_financial_activity_id),
    inventoryTransactionLineId: Number(row.inventory_transaction_line_id),
    inventoryDocumentCode: row.inventory_document_code,
    inventoryDocumentType: row.inventory_document_type,
    itemId: Number(row.item_id),
    itemCode: row.item_code,
    itemName: row.item_name,
    quantityChange: Number(row.quantity_change),
    reasonCode: row.reason_code,
    activityDate: new Date(row.activity_date).toISOString(),
    processingStatus: row.processing_status,
    financeDocumentType: row.finance_document_type,
    financeDocumentId: row.finance_document_id == null ? null : Number(row.finance_document_id),
    financeDocumentCode: row.finance_document_code,
    processedAt: iso(row.processed_at),
    audit: {
      created: {
        date: new Date(row.creation_date).toISOString(),
        actorType: row.creation_actor_type,
        userId: row.creation_user_id,
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: new Date(row.updated_date).toISOString(),
        actorType: row.updated_actor_type,
        userId: row.updated_user_id,
        mutationId: row.updated_mutation_id,
      },
    },
  };
}

export async function listFinanceInventoryActivities(
  financeOrganizationId: number,
): Promise<FinanceInventoryActivity[]> {
  return (await new InventoryProcessingRepo(getDb()).list(financeOrganizationId)).map(toDto);
}

export async function getFinanceInventoryActivity(
  financeOrganizationId: number,
  id: number,
): Promise<FinanceInventoryActivity | null> {
  const row = await new InventoryProcessingRepo(getDb()).get(financeOrganizationId, id);
  return row ? toDto(row) : null;
}

async function toRuleDto(row: FinanceInventoryProcessingRuleRow): Promise<FinanceInventoryProcessingRule> {
  const dto: FinanceInventoryProcessingRule = {
    id: Number(row.id),
    inventoryDocumentType: row.inventory_document_type,
    reasonCode: row.reason_code,
    direction: row.direction,
    action: row.action,
    offsetGlAccountId: row.offset_gl_account_id == null ? null : Number(row.offset_gl_account_id),
    offsetGlAccount: row.offset_gl_account_id == null ? null : {
      code: row.offset_gl_account_code ?? "",
      name: row.offset_gl_account_name ?? "",
    },
    audit: {
      created: { date: row.creation_date, actorType: row.creation_actor_type, userId: row.creation_user_id, mutationId: row.creation_mutation_id },
      updated: { date: row.updated_date, actorType: row.updated_actor_type, userId: row.updated_user_id, mutationId: row.updated_mutation_id },
    },
  };
  return withAuditActors(dto, row);
}

export async function listFinanceInventoryProcessingRules(financeOrganizationId: number): Promise<FinanceInventoryProcessingRule[]> {
  return Promise.all((await new InventoryProcessingRepo(getDb()).listRules(financeOrganizationId)).map(toRuleDto));
}

export async function getFinanceInventoryProcessingRule(financeOrganizationId: number, id: number): Promise<FinanceInventoryProcessingRule | null> {
  const row = await new InventoryProcessingRepo(getDb()).getRule(financeOrganizationId, id);
  return row ? toRuleDto(row) : null;
}

export async function updateFinanceInventoryProcessingRule(
  financeOrganizationId: number,
  id: number,
  input: FinanceInventoryProcessingRulePatch,
): Promise<FinanceInventoryProcessingRule> {
  await assertCompanySettingsWritable(financeOrganizationId);
  const row = await withTransaction(async (db) => {
    const repo = new InventoryProcessingRepo(db);
    const existing = await repo.getRule(financeOrganizationId, id);
    if (!existing) throw new NotFoundError(`Inventory processing rule ${id} not found`);
    if (!isInventoryProcessingRuleActionAllowed(existing.inventory_document_type, input.action)) {
      throw new BusinessRuleError(`${input.action} is not valid for ${existing.inventory_document_type} rules`);
    }
    const waitsForMatch = input.action === InventoryProcessingRuleAction.WaitForMatchedDocument;
    if (waitsForMatch && input.offsetGlAccountId !== null) {
      throw new BusinessRuleError("WAIT_FOR_MATCHED_DOCUMENT must not have an offset GL account");
    }
    if (!waitsForMatch && input.offsetGlAccountId === null) {
      throw new BusinessRuleError(`${input.action} requires an offset GL account`);
    }
    if (input.offsetGlAccountId !== null && !await repo.hasGlAccount(financeOrganizationId, input.offsetGlAccountId)) {
      throw new NotFoundError(`Active GL account ${input.offsetGlAccountId} not found`);
    }
    return repo.updateRule(financeOrganizationId, id, input.action, input.offsetGlAccountId, await createUpdateAuditStamp());
  });
  if (!row) throw new NotFoundError(`Inventory processing rule ${id} not found`);
  return toRuleDto(row);
}
