import "server-only";
import { PostingProfileAssignmentRepo } from "../db/posting-profile-assignment.repo";

import { getDb } from "@voyzu/capability/db";
import { semanticData } from "@voyzu/capability/contracts";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import type { AssignPostingProfileRequest, PostingAssignments } from "../../types";

async function organizationId(companyId: number): Promise<number> {
  const { rows } = await new PostingProfileAssignmentRepo(getDb()).findOrganization(companyId);
  if (rows[0]?.organization_id == null) throw new NotFoundError("Finance company was not found");
  return Number(rows[0].organization_id);
}

export async function listPostingProfileAssignments(companyId: number): Promise<PostingAssignments> {
  const orgId = await organizationId(companyId);
  const result = await semanticData.queryOptional("inventoryItem", "byOrganization", { organizationId: orgId });
  const items = result ?? [];
  const { rows: profileRows } = await new PostingProfileAssignmentRepo(getDb()).listProfiles(companyId);
  const profiles = profileRows.map((row: Record<string, unknown>) => ({ id: Number(row.id), code: String(row.code), name: String(row.name), status: row.status === "INACTIVE" ? "INACTIVE" as const : "ACTIVE" as const }));
  const { rows: assignmentRows } = await new PostingProfileAssignmentRepo(getDb()).listAssignments(companyId);
  const profileByItem = new Map(assignmentRows.map((row: Record<string, unknown>) => [Number(row.inventory_item_id), Number(row.item_posting_profile_id)]));
  const codeByProfile = new Map(profiles.map((profile) => [profile.id, profile.code]));
  return { inventoryInstalled: result !== null, profiles, items: items.map((item) => { const postingProfileId = profileByItem.get(item.id) ?? null; return { ...item, postingProfileId, postingCode: postingProfileId == null ? null : codeByProfile.get(postingProfileId) ?? null }; }) };
}

export async function assignPostingProfile(companyId: number, input: AssignPostingProfileRequest): Promise<PostingAssignments> {
  const current = await listPostingProfileAssignments(companyId);
  if (!current.inventoryInstalled) throw new BusinessRuleError("The Inventory package is not installed");
  const profile = current.profiles.find(({ id }) => id === input.postingProfileId);
  if (!profile || profile.status !== "ACTIVE") throw new BusinessRuleError("Select an active item posting profile");
  const knownItemIds = new Set(current.items.map(({ id }) => id));
  if (input.itemIds.some((id) => !knownItemIds.has(id))) throw new BusinessRuleError("One or more inventory items were not found");
  for (const itemId of [...new Set(input.itemIds)]) {
    await new PostingProfileAssignmentRepo(getDb()).assign(companyId, itemId, input.postingProfileId);
  }
  return listPostingProfileAssignments(companyId);
}
