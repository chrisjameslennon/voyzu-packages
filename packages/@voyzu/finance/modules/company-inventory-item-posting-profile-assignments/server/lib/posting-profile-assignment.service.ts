import "server-only";
import { getDb } from "@voyzu/capability/db";
import { command } from "@voyzu/capability/commands";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import type { AssignPostingProfileRequest, PostingAssignments } from "../../types";

interface InventoryItem { id: number; sku: string; name: string; category: string | null; itemType: string; unit: string | null; status: string; }

async function organizationId(companyId: number): Promise<number> {
  const { rows } = await getDb().query("SELECT organization_id::int FROM finance_organization WHERE id = $1", [companyId]);
  if (rows[0]?.organization_id == null) throw new NotFoundError("Finance company was not found");
  return Number(rows[0].organization_id);
}

export async function listPostingProfileAssignments(companyId: number): Promise<PostingAssignments> {
  const orgId = await organizationId(companyId);
  const inventory = await command.callOptional("@voyzu/inventory.listInventoryItems", orgId);
  const items = Array.isArray(inventory) ? inventory as InventoryItem[] : [];
  const { rows: profileRows } = await getDb().query("SELECT id::int, code, name, status FROM item_posting_profile WHERE finance_organization_id = $1 ORDER BY code", [companyId]);
  const profiles = profileRows.map((row: Record<string, unknown>) => ({ id: Number(row.id), code: String(row.code), name: String(row.name), status: row.status === "INACTIVE" ? "INACTIVE" as const : "ACTIVE" as const }));
  const { rows: assignmentRows } = await getDb().query("SELECT inventory_item_id::int, item_posting_profile_id::int FROM inventory_item_posting_profile_assignment WHERE finance_organization_id = $1", [companyId]);
  const profileByItem = new Map(assignmentRows.map((row: Record<string, unknown>) => [Number(row.inventory_item_id), Number(row.item_posting_profile_id)]));
  const codeByProfile = new Map(profiles.map((profile) => [profile.id, profile.code]));
  return { inventoryInstalled: Array.isArray(inventory), profiles, items: items.map((item) => { const postingProfileId = profileByItem.get(item.id) ?? null; return { ...item, postingProfileId, postingCode: postingProfileId == null ? null : codeByProfile.get(postingProfileId) ?? null }; }) };
}

export async function assignPostingProfile(companyId: number, input: AssignPostingProfileRequest): Promise<PostingAssignments> {
  const current = await listPostingProfileAssignments(companyId);
  if (!current.inventoryInstalled) throw new BusinessRuleError("The Inventory package is not installed");
  const profile = current.profiles.find(({ id }) => id === input.postingProfileId);
  if (!profile || profile.status !== "ACTIVE") throw new BusinessRuleError("Select an active item posting profile");
  const knownItemIds = new Set(current.items.map(({ id }) => id));
  if (input.itemIds.some((id) => !knownItemIds.has(id))) throw new BusinessRuleError("One or more inventory items were not found");
  for (const itemId of [...new Set(input.itemIds)]) {
    await getDb().query(
      `INSERT INTO inventory_item_posting_profile_assignment (finance_organization_id, inventory_item_id, item_posting_profile_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (finance_organization_id, inventory_item_id) DO UPDATE SET item_posting_profile_id = EXCLUDED.item_posting_profile_id`,
      [companyId, itemId, input.postingProfileId],
    );
  }
  return listPostingProfileAssignments(companyId);
}
