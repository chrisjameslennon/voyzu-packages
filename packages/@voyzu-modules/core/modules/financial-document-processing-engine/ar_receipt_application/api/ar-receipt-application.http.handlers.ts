import { type NextRequest, type NextResponse } from "next/server";

import type { ArReceiptApplicationRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-receipt-application.request.dto";
import type { ArReceiptApplicationPostingResponseDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-receipt-application.response.dto";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";

import { processArReceiptApplication } from "../lib/ar-receipt-application.service";


export async function handleProcess(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await parseBody<ArReceiptApplicationRequestDto>(req);
    const result: ArReceiptApplicationPostingResponseDto = await processArReceiptApplication(body, { preview: req.nextUrl.searchParams.has("preview") });
    return ok(result);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


