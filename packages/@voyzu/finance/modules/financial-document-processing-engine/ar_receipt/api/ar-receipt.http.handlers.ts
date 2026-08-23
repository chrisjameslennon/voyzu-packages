import { type NextRequest, type NextResponse } from "next/server";

import type { ArReceiptRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt.request.dto";
import type { ArReceiptPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt.response.dto";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";

import { processArReceipt } from "../lib/ar-receipt.service";


export async function handleProcess(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await parseBody<ArReceiptRequestDto>(req);
    const result: ArReceiptPostingResponseDto = await processArReceipt(body, { preview: req.nextUrl.searchParams.has("preview") });
    return ok(result);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


