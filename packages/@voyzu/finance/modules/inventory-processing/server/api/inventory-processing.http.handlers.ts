import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import { businessRuleError, notFoundError, ok, parseBody, serverError } from "@voyzu/capability/http";
import { resolveApiCompanyIdFromPath } from "../../../finance-companies/server/lib/settings-scope";
import type { FinanceInventoryActivity, FinanceInventoryProcessingRule, FinanceInventoryProcessingRulePatch } from "../../types/index";
import type {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InputValidationErrorResponseDto,
  InternalServerErrorResponseDto,
} from "@voyzu/types/errors";
import { type NextRequest, NextResponse } from "next/server";

import {
  getFinanceInventoryActivity,
  getFinanceInventoryProcessingRule,
  listFinanceInventoryActivities,
  listFinanceInventoryProcessingRules,
  updateFinanceInventoryProcessingRule,
} from "../lib/inventory-processing.service";

type ErrorResponse = BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | InternalServerErrorResponseDto;

export async function handleListRules(request: NextRequest): Promise<NextResponse<FinanceInventoryProcessingRule[] | ErrorResponse>> {
  try {
    return ok(await listFinanceInventoryProcessingRules(await resolveApiCompanyIdFromPath(request)));
  } catch (error) {
    return serverError(error);
  }
}

export async function handleGetRule(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<FinanceInventoryProcessingRule | ErrorResponse | EntityNotFoundErrorResponseDto>> {
  try {
    const { id } = await context.params;
    const rule = await getFinanceInventoryProcessingRule(await resolveApiCompanyIdFromPath(request), Number(id));
    return rule ? ok(rule) : notFoundError("Inventory processing rule not found");
  } catch (error) {
    return serverError(error);
  }
}

export async function handlePatchRule(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<FinanceInventoryProcessingRule | ErrorResponse | EntityNotFoundErrorResponseDto>> {
  try {
    const { id } = await context.params;
    const input = await parseBody<FinanceInventoryProcessingRulePatch>(request);
    return ok(await updateFinanceInventoryProcessingRule(
      await resolveApiCompanyIdFromPath(request),
      Number(id),
      input,
    ));
  } catch (error) {
    if (error instanceof BusinessRuleError) return businessRuleError(error.message);
    if (error instanceof NotFoundError) return notFoundError(error.message);
    return serverError(error);
  }
}

export async function handleListInventoryTransactions(
  request: NextRequest,
): Promise<NextResponse<FinanceInventoryActivity[] | ErrorResponse>> {
  try {
    return ok(await listFinanceInventoryActivities(await resolveApiCompanyIdFromPath(request)));
  } catch (error) {
    return serverError(error);
  }
}

export async function handleGetInventoryTransaction(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<FinanceInventoryActivity | ErrorResponse | EntityNotFoundErrorResponseDto>> {
  try {
    const { id } = await context.params;
    const activity = await getFinanceInventoryActivity(
      await resolveApiCompanyIdFromPath(request),
      Number(id),
    );
    return activity ? ok(activity) : notFoundError("Inventory transaction not found");
  } catch (error) {
    return serverError(error);
  }
}
