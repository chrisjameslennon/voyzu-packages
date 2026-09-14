import "server-only";
import { resolveServerCompanyHttpApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";
import { PostingProfileAssignmentsView } from "../../client/PostingProfileAssignmentsView";
import { listPostingProfileAssignments } from "../lib/posting-profile-assignment.service";

export async function InventoryItemPostingProfileAssignmentsPage() {
  const [{ companyId }, { companyCode }] = await Promise.all([resolveServerSettingsScope(), resolveServerCompanyHttpApiContext()]);
  return <PostingProfileAssignmentsView data={await listPostingProfileAssignments(companyId)} httpApiPath={`/api/ledger/${encodeURIComponent(companyCode)}/inventory/item-posting-profile-assignments`} />;
}
