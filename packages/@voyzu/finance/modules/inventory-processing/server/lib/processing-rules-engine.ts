import { withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, DataError, NotFoundError, NotImplementedError } from "@voyzu/capability/errors";
import {
  InventoryProcessingRuleAction,
  InventoryProcessingRuleDirection,
} from "@voyzu/finance/inventory-processing/domain";
import type { FinanceInventoryActivity, ProcessInventoryMovementRequest } from "@voyzu/finance/types/modules/inventory-processing";
import type { InventoryAdjustmentRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/inventory-adjustment.request.dto";

import { processInventoryAdjustment } from "../../../financial-document-processing-engine/inventory/lib/inventory-processing.service";
import { createCreationAuditStamp, createUpdateAuditStamp } from "../../../common/server";
import { InventoryProcessingRepo } from "../db/inventory-processing.repo";
import { getFinanceInventoryActivity } from "./inventory-processing.service";

function directionFor(quantityChange: number): InventoryProcessingRuleDirection {
  return quantityChange > 0
    ? InventoryProcessingRuleDirection.Increase
    : InventoryProcessingRuleDirection.Decrease;
}

function activityDate(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

export async function processInventoryMovement(
  organizationId: number,
  movement: ProcessInventoryMovementRequest,
): Promise<FinanceInventoryActivity> {
  const processed = await withTransaction(async (db) => {
    const repo = new InventoryProcessingRepo(db);
    const financeOrganizationId = await repo.getFinanceOrganizationId(organizationId);
    if (!financeOrganizationId) throw new NotFoundError(`Finance organization for organization ${organizationId} not found`);
    const ingested = await repo.ingestMovement(financeOrganizationId, movement, await createCreationAuditStamp());
    const financeInventoryActivityId = ingested.id;
    const activity = await repo.getForProcessing(financeOrganizationId, financeInventoryActivityId);
    if (!activity) throw new NotFoundError(`Finance inventory activity ${financeInventoryActivityId} not found`);
    if (activity.processing_status === "PROCESSED") return { financeOrganizationId, financeInventoryActivityId };
    if (!activity.reason_code) {
      throw new BusinessRuleError(`Finance inventory activity ${financeInventoryActivityId} has no reason code`);
    }

    const direction = directionFor(Number(activity.quantity_change));
    const rule = await repo.getRuleForMovement(
      financeOrganizationId,
      activity.inventory_document_type,
      activity.reason_code,
      direction,
    );
    if (!rule) {
      throw new BusinessRuleError(
        `No inventory processing rule exists for ${activity.inventory_document_type} ${activity.reason_code} ${direction}`,
      );
    }
    if (rule.action === InventoryProcessingRuleAction.WaitForMatchedDocument) {
      return { financeOrganizationId, financeInventoryActivityId };
    }

    if (activity.inventory_document_type === "RECEIPT") {
      throw new NotImplementedError("Inventory receipt movement processing is not implemented");
    }
    if (activity.inventory_document_type === "ISSUE") {
      throw new NotImplementedError("Inventory issue movement processing is not implemented");
    }
    if (rule.action !== InventoryProcessingRuleAction.CreateInventoryAdjustmentJournal) {
      throw new BusinessRuleError(`${rule.action} is not valid for an adjustment movement`);
    }
    if (!rule.offset_gl_account_code) {
      throw new BusinessRuleError(
        `Inventory processing rule ${rule.id} does not resolve to an offset GL account`,
      );
    }

    const companyCode = await repo.getOrganizationCode(financeOrganizationId);
    if (!companyCode) throw new NotFoundError(`Finance organization ${financeOrganizationId} not found`);

    const request: InventoryAdjustmentRequestDto = {
      document_type: "INVENTORY_ADJUSTMENT",
      company_code: companyCode,
      memo: `Inventory movement ${activity.inventory_document_code}`,
      adjustment_date: activityDate(activity.activity_date),
      source: {
        source_document: "STOCK_ADJUSTMENT",
        source_document_id: activity.inventory_document_code,
        source_type: activity.reason_code,
        source_line_id: Number(activity.inventory_transaction_line_id),
      },
      lines: [{
        line_id: Number(activity.inventory_transaction_line_id),
        inventory_item_code: activity.item_code,
        description: activity.item_name,
        adjustment_type: "QUANTITY_ADJUSTMENT",
        quantity_delta: Number(activity.quantity_change),
        reason_code: activity.reason_code,
        gl_account_code: rule.offset_gl_account_code,
      }],
    };

    const posting = await processInventoryAdjustment(request, { db });
    const document = posting.posting_details.journal_header;
    if (document.id == null || document.code == null) {
      throw new DataError("Inventory adjustment engine did not return a persisted document");
    }
    await repo.markActivityProcessed(
      financeOrganizationId,
      financeInventoryActivityId,
      "INVENTORY_ADJUSTMENT",
      document.id,
      document.code,
      await createUpdateAuditStamp(),
    );
    return { financeOrganizationId, financeInventoryActivityId };
  });

  const activity = await getFinanceInventoryActivity(processed.financeOrganizationId, processed.financeInventoryActivityId);
  if (!activity) throw new NotFoundError(`Finance inventory activity ${processed.financeInventoryActivityId} not found`);
  return activity;
}
