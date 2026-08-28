import { operation } from "@voyzu/capability/operations";
import type { PostingProfileOption } from "../../types/item.types";

function isPostingProfile(value: unknown): value is PostingProfileOption {
  if (!value || typeof value !== "object") return false;
  const profile = value as Record<string, unknown>;
  return typeof profile.id === "number" && typeof profile.profile_code === "string"
    && typeof profile.name === "string" && (profile.status === "ACTIVE" || profile.status === "INACTIVE");
}

export async function listPostingProfileOptions(): Promise<PostingProfileOption[]> {
  const result = await operation.callOptional("@voyzu/finance.listItemPostingProfilesOrganizationInventoryItemPostingProfiles");
  if (!Array.isArray(result)) return [];
  return result.filter(isPostingProfile).map((profile) => ({
    id: profile.id,
    code: (profile as unknown as { profile_code: string }).profile_code,
    name: profile.name,
    status: profile.status,
  }));
}
