import type { DbExecutor } from "@voyzu/capability/db";

export class PostingProfileAssignmentRepo {
  constructor(private readonly db: DbExecutor) {}

  findOrganization(companyId: number) {
    return this.db.query("SELECT organization_id::int FROM finance_organization WHERE id = $1", [companyId]);
  }

  listProfiles(companyId: number) {
    return this.db.query("SELECT id::int, code, name, status FROM item_posting_profile WHERE finance_organization_id = $1 ORDER BY code", [companyId]);
  }

  listAssignments(companyId: number) {
    return this.db.query("SELECT inventory_item_id::int, item_posting_profile_id::int FROM inventory_item_posting_profile_assignment WHERE finance_organization_id = $1", [companyId]);
  }

  assign(companyId: number, itemId: number, profileId: number) {
    return this.db.query(`INSERT INTO inventory_item_posting_profile_assignment (finance_organization_id, inventory_item_id, item_posting_profile_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (finance_organization_id, inventory_item_id) DO UPDATE SET item_posting_profile_id = EXCLUDED.item_posting_profile_id`, [companyId, itemId, profileId]);
  }
}
