import { type NextRequest, type NextResponse } from "next/server";

import type { ArInvoiceRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import type { ArInvoicePostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-invoice.response.dto";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";

import { processArInvoice } from "../lib/ar-invoice.service";
import { validateRequest } from "../lib/ar-invoice.validator";


export async function handleProcess(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await parseBody<ArInvoiceRequestDto>(req);
    validateRequest(body);
    const result: ArInvoicePostingResponseDto = await processArInvoice(body, { preview: req.nextUrl.searchParams.has("preview") });
    return ok(result);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


