import type { DbExecutor } from "@voyzu/capability/db";

export class OperationalInventoryRepo {
  constructor(private readonly db: DbExecutor) {}

  listAssignmentsForItems(organizationId: number, itemIds: number[]) {
    return this.db.query(`SELECT assignment.inventory_item_id::int, assignment.item_posting_profile_id::int
     FROM inventory_item_posting_profile_assignment assignment
     JOIN finance_organization finance ON finance.id = assignment.finance_organization_id
     WHERE finance.organization_id = $1 AND assignment.inventory_item_id = ANY($2::bigint[])`, [organizationId, itemIds]);
  }

  listProfileUsages(postingProfileIds: number[]) {
    return this.db.query(`SELECT assignment.item_posting_profile_id::int, assignment.inventory_item_id::int, finance.organization_id::int
     FROM inventory_item_posting_profile_assignment assignment
     JOIN finance_organization finance ON finance.id = assignment.finance_organization_id
     WHERE assignment.item_posting_profile_id = ANY($1::bigint[])`, [postingProfileIds]);
  }
}
