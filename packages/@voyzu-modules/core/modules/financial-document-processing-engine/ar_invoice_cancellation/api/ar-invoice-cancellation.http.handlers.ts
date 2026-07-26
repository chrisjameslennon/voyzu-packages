import { type NextRequest, type NextResponse } from "next/server";

import type { ArInvoiceCancellationRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-invoice-cancellation.request.dto";
import type { ArInvoiceCancellationPostingResponseDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-invoice-cancellation.response.dto";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";

import { processArInvoiceCancellation } from "../lib/ar-invoice-cancellation.service";


export async function handleProcess(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await parseBody<ArInvoiceCancellationRequestDto>(req);
    const result: ArInvoiceCancellationPostingResponseDto = await processArInvoiceCancellation(body, { preview: req.nextUrl.searchParams.has("preview") });
    return ok(result);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


