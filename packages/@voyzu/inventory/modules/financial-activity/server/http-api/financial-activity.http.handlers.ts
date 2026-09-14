import type { NextRequest } from "next/server";
import { businessRuleError, notFoundError, ok, serverError } from "@voyzu/capability/http";
import { BusinessRuleError } from "@voyzu/capability/errors";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import {
  getFinancialActivity,
  listFinancialActivity,
} from "../lib/financial-activity.service";

type RouteContext = { params: Promise<{ id: string }> };
async function organizationId() {
  const organization = await getSelectedOrganization();
  if (!organization) throw new BusinessRuleError("Select an organization before viewing financial activity");
  return organization.id;
}
const errorResponse = (error: unknown) =>
  error instanceof BusinessRuleError
    ? businessRuleError(error.message)
    : serverError(error);

export async function handleList() {
  try {
    return ok(await listFinancialActivity(await organizationId()));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function handleGet(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const record = await getFinancialActivity(await organizationId(), Number(id));
    return record ? ok(record) : notFoundError(`Financial activity ${id} was not found`);
  } catch (error) {
    return errorResponse(error);
  }
}
