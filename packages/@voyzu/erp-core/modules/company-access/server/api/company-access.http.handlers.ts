import type { NextRequest } from "next/server";

import { currentUserCanManageUsers } from "@voyzu/auth/users/server";
import { BusinessRuleError, InputValidationError, NotFoundError } from "@voyzu/capability/errors";
import {
  businessRuleError,
  forbiddenError,
  inputValidationError,
  notFoundError,
  ok,
  parseBody,
  serverError,
} from "@voyzu/capability/http";
import type { CompanyAccessUpdateRequest } from "@voyzu/erp-core/types/modules/company-access";

import { listCompanyAccess, replaceUserCompanyAccess } from "../lib/company-access.service";

async function requireAdmin() {
  return await currentUserCanManageUsers() ? null : forbiddenError("You do not have access");
}

export async function handleList(_request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return ok(await listCompanyAccess());
  } catch (error) {
    return serverError(error);
  }
}

export async function handleReplace(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { code } = await params;
    const body = await parseBody<CompanyAccessUpdateRequest>(request);
    return ok(await replaceUserCompanyAccess(decodeURIComponent(code), body.companyIds));
  } catch (error) {
    if (error instanceof InputValidationError) return inputValidationError(error.message);
    if (error instanceof BusinessRuleError) return businessRuleError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}
