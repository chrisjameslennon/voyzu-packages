import "server-only";
import type { DbExecutor } from "@voyzu/capability/db";
import type { CreationAuditStamp } from "../../../common/server";

/** One target entity; the caller must include this in the creation transaction. */
export class FinancialEntityInitializationRepo {
  constructor(private readonly db: DbExecutor) {}

  async initialize(financialEntityId: number, audit: CreationAuditStamp): Promise<void> {
    await this.db.query(
      "SELECT finance_initialize_entity($1::bigint, $2::text, $3::text, $4::uuid)",
      [financialEntityId, audit.actorType, audit.userId, audit.mutationId],
    );
  }
}
