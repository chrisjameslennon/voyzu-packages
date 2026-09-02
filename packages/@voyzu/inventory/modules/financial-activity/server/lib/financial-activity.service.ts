import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import { createUpdateAuditStamp, withAuditActors, withUpdateAudit } from "@voyzu/audit/stamps";
import { FinancialActivityRepo } from "../db/financial-activity.repo";
import { MarkProcessed } from "../../domain/operation-policy";

export const listFinancialActivity = (organizationId: number) =>
  new FinancialActivityRepo(getDb()).list(organizationId);

export async function getFinancialActivity(organizationId: number, id: number) {
  const record = await new FinancialActivityRepo(getDb()).get(organizationId, id);
  return record
    ? withAuditActors(record, {
        creation_user_id: record.audit.created.userId,
        updated_user_id: record.audit.updated.userId,
      })
    : null;
}

export async function markFinancialActivityProcessed(
  organizationId: number,
  id: number,
) {
  return withTransaction(async (db) => {
    const repo = new FinancialActivityRepo(db);
    const existing = await repo.get(organizationId, id);
    if (!existing)
      throw new NotFoundError(`Financial activity ${id} was not found`);
    const blockers = MarkProcessed();
    if (blockers.length) throw new BusinessRuleError(blockers[0]!.message);
    if (existing.status === "AVAILABLE") {
      await repo.markProcessed(
        organizationId,
        id,
        withUpdateAudit({}, await createUpdateAuditStamp()),
      );
    }
    const processed = await repo.get(organizationId, id);
    if (!processed)
      throw new NotFoundError(`Financial activity ${id} was not found`);
    return withAuditActors(processed, {
      creation_user_id: processed.audit.created.userId,
      updated_user_id: processed.audit.updated.userId,
    });
  });
}
