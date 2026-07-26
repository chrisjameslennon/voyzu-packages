import { type NextRequest, type NextResponse } from "next/server";

import type { InventoryIssueRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/inventory-issue.request.dto";
import type { InventoryProcessingPostingResponseDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/inventory-processing.response.dto";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";

import { processInventoryIssue } from "../lib/inventory-processing.service";
import { validateInventoryRequest } from "../lib/inventory-processing.validator";

export async function handleProcess(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await parseBody<InventoryIssueRequestDto>(req);
    validateInventoryRequest(body, "INVENTORY_ISSUE");
    const result: InventoryProcessingPostingResponseDto = await processInventoryIssue(body, { preview: req.nextUrl.searchParams.has("preview") });
    return ok(result);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


