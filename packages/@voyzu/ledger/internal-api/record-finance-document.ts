import { internalApi } from "@voyzu/capability/internal-api";
import { AsyncLocalStorage } from "node:async_hooks";
import type { DbExecutor } from "@voyzu/capability/db";
import type { InsertJournalHeaderRow } from "../modules/journals/server/db/journal.row.types";

const sourceCapture = new AsyncLocalStorage<boolean>();

export function withFinanceDocumentCapture<T>(operation: () => Promise<T>): Promise<T> {
  return sourceCapture.run(true, operation);
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

/** Preserve operational source documents when Finance participates in a posting. */
export async function recordFinanceDocument(db: DbExecutor, row: InsertJournalHeaderRow) {
  if (!sourceCapture.getStore() || !/^(AR|AP)_/.test(row.document_type_code) || !internalApi.has("@erp/finance-documents")) return;
  const { rows } = await db.query("SELECT organization_id::int FROM finance_organization WHERE id = $1", [row.finance_organization_id]);
  const organization_id = Number(rows[0]?.organization_id);
  const document = object(row.document_snapshot_json);
  const details = object(row.detailed_document_snapshot_json);
  const side = row.document_type_code.startsWith("AR_") ? "ar" : "ap";
  const counterparty = object(details[side + "_counterparty"] ?? document[side + "_counterparty"]);
  if (typeof counterparty.code === "string" && typeof counterparty.name === "string") {
    await internalApi.callOptional(side === "ar" ? "@erp/ar-counterparties" : "@erp/ap-counterparties", "ensure", {
      organization_id, code: counterparty.code, name: counterparty.name,
      ...(typeof counterparty.country_code === "string" && counterparty.country_code ? { country_code: counterparty.country_code } : {}),
      ...(typeof counterparty.tax_region_or_province === "string" ? { tax_region_or_province: counterparty.tax_region_or_province } : {}),
    });
  }
  await internalApi.call("@erp/finance-documents", "record", {
    organization_id, document_type: row.document_type_code, code: row.document_id, document, details,
  });
}
