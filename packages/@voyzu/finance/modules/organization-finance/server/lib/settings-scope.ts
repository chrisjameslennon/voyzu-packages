import { internalApi } from "@voyzu/capability/internal-api";
import { BusinessRuleError } from "@voyzu/capability/errors";
import type { NextRequest } from "next/server";
export async function resolveHttpApiCompanyIdFromPath(request: NextRequest) {
 const code = request.nextUrl.pathname.split("/").filter(Boolean)[2];
 const { organizations } = await internalApi.call("@core/organization-context", "get", {});
 const organization = organizations.find(item => item.code === decodeURIComponent(code ?? ""));
 if (!organization) throw new BusinessRuleError("Organization is not accessible");
 return organization.organization_id;
}
