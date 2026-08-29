import type { NextRequest } from "next/server";
import { ok, parseBody, serverError } from "@voyzu/capability/http";
import { resolveApiCompanyIdFromPath } from "../../../common/server/settings-scope";
import type { AssignPostingProfileRequest } from "../../types";
import { assignPostingProfile, listPostingProfileAssignments } from "../lib/posting-profile-assignment.service";

export async function handleList(request: NextRequest) {
  try { return ok(await listPostingProfileAssignments(await resolveApiCompanyIdFromPath(request))); }
  catch (error) { return serverError(error); }
}

export async function handleAssign(request: NextRequest) {
  try { return ok(await assignPostingProfile(await resolveApiCompanyIdFromPath(request), await parseBody<AssignPostingProfileRequest>(request))); }
  catch (error) { return serverError(error); }
}
