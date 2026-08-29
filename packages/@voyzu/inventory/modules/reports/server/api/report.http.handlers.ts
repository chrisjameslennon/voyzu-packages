import type { NextRequest } from "next/server";
import { ok, serverError } from "@voyzu/capability/http";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import type { InventoryReportKey } from "../../types/report.types";
import { getInventoryReport } from "../lib/report.service";
export async function handleReport(
  _request: NextRequest,
  { params }: { params: Promise<{ report: InventoryReportKey }> },
) {
  try {
    const organization = await getSelectedOrganization();
    if (!organization)
      return ok({ title: "Inventory Report", headers: [], rows: [] });
    const { report } = await params;
    return ok(await getInventoryReport(organization.id, report));
  } catch (error) {
    return serverError(error);
  }
}
