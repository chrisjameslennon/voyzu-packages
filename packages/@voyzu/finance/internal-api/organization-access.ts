import { internalApi } from "@voyzu/capability/internal-api";
import { BusinessRuleError } from "@voyzu/capability/errors";

export async function getAccessibleOrganization(input: { organization_id: number } | { code: string }) {
  const { user } = await internalApi.call("@core/auth", "get", {});
  if (!user || user.status !== "ACTIVE") throw new BusinessRuleError("An active user is required");
  const organization = await internalApi.call("@core/organization", "get", input);
  if (!organization) throw new BusinessRuleError("Organization was not found");
  if (user.role !== "ADMIN") {
    const access = await internalApi.call("@core/organization-access", "get", { userId: Number(user.id) });
    if (!access.organization_ids.includes(organization.organization_id)) throw new BusinessRuleError("Organization is not accessible");
  }
  return organization;
}
