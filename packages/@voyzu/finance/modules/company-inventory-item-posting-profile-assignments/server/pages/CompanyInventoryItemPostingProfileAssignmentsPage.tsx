import "server-only";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";
import { PostingProfileAssignmentsView } from "../../client/PostingProfileAssignmentsView";
import { listPostingProfileAssignments } from "../lib/posting-profile-assignment.service";

export async function CompanyInventoryItemPostingProfileAssignmentsPage() {
  const [{ companyId }, { companyCode }] = await Promise.all([resolveServerSettingsScope(), resolveServerCompanyApiContext()]);
  return <PostingProfileAssignmentsView data={await listPostingProfileAssignments(companyId)} apiPath={`/api/finance/${encodeURIComponent(companyCode)}/inventory/item-posting-profile-assignments`} />;
}
