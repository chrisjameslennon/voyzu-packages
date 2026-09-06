import { withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, DataError, NotFoundError } from "@voyzu/capability/errors";
import {
  InventoryProcessingRuleAction,
  InventoryProcessingRuleDirection,
} from "@voyzu/finance/inventory-processing/domain";
import type { FinanceInventoryActivity, ProcessInventoryMovementRequest } from "@voyzu/finance/types/modules/inventory-processing";
import type { InventoryAdjustmentRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/inventory-adjustment.request.dto";
import type { InventoryIssueRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/inventory-issue.request.dto";
import type { InventoryReceiptRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/inventory-receipt.request.dto";

import {
  processInventoryAdjustment,
  processInventoryIssue,
  processInventoryReceipt,
} from "../../../financial-document-processing-engine/inventory/lib/inventory-processing.service";
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

    if (!rule.offset_gl_account_code) {
      throw new BusinessRuleError(
        `Inventory processing rule ${rule.id} does not resolve to an offset GL account`,
      );
    }

    const companyCode = await repo.getOrganizationCode(financeOrganizationId);
    if (!companyCode) throw new NotFoundError(`Finance organization ${financeOrganizationId} not found`);

    const common = {
      company_code: companyCode,
      memo: `Inventory movement ${activity.inventory_document_code}`,
      source: {
        source_document: `STOCK_${activity.inventory_document_type}`,
        source_document_id: activity.inventory_document_code,
        source_type: activity.reason_code,
        source_line_id: Number(activity.inventory_transaction_line_id),
      },
    };
    const commonLine = {
      line_id: Number(activity.inventory_transaction_line_id),
      inventory_item_code: activity.item_code,
      description: activity.item_name,
      quantity_delta: Number(activity.quantity_change),
      gl_account_code: rule.offset_gl_account_code,
    };

    let posting;
    let financeDocumentType: "INVENTORY_RECEIPT" | "INVENTORY_ISSUE" | "INVENTORY_ADJUSTMENT";
    if (activity.inventory_document_type === "RECEIPT") {
      if (rule.action !== InventoryProcessingRuleAction.CreateInventoryReceiptJournal) {
        throw new BusinessRuleError(`${rule.action} is not valid for a receipt movement`);
      }
      const request: InventoryReceiptRequestDto = {
        ...common,
        document_type: "INVENTORY_RECEIPT",
        receipt_date: activityDate(activity.activity_date),
        lines: [{
          ...commonLine,
          valuation_method: "CURRENT_AVERAGE_BOOK_VALUE",
        }],
      };
      posting = await processInventoryReceipt(request, { db });
      financeDocumentType = "INVENTORY_RECEIPT";
    } else if (activity.inventory_document_type === "ISSUE") {
      if (rule.action !== InventoryProcessingRuleAction.CreateInventoryIssueJournal) {
        throw new BusinessRuleError(`${rule.action} is not valid for an issue movement`);
      }
      const request: InventoryIssueRequestDto = {
        ...common,
        document_type: "INVENTORY_ISSUE",
        issue_date: activityDate(activity.activity_date),
        lines: [{
          ...commonLine,
          issue_purpose: "CONSUMED",
        }],
      };
      posting = await processInventoryIssue(request, { db });
      financeDocumentType = "INVENTORY_ISSUE";
    } else {
      if (rule.action !== InventoryProcessingRuleAction.CreateInventoryAdjustmentJournal) {
        throw new BusinessRuleError(`${rule.action} is not valid for an adjustment movement`);
      }
      const request: InventoryAdjustmentRequestDto = {
        ...common,
        document_type: "INVENTORY_ADJUSTMENT",
        adjustment_date: activityDate(activity.activity_date),
        lines: [{
          ...commonLine,
          adjustment_type: "QUANTITY_ADJUSTMENT",
          reason_code: activity.reason_code,
        }],
      };
      posting = await processInventoryAdjustment(request, { db });
      financeDocumentType = "INVENTORY_ADJUSTMENT";
    }
    const document = posting.posting_details.journal_header;
    if (document.id == null || document.code == null) {
      throw new DataError("Inventory posting engine did not return a persisted document");
    }
    await repo.markActivityProcessed(
      financeOrganizationId,
      financeInventoryActivityId,
      financeDocumentType,
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
