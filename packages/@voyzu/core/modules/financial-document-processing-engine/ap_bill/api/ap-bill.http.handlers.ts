import { type NextRequest, type NextResponse } from "next/server";

import type { ApBillRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-bill.request.dto";
import type { ApBillPostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-bill.response.dto";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";

import { processApBill } from "../lib/ap-bill.service";
import { validateRequest } from "../lib/ap-bill.validator";


export async function handleProcess(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await parseBody<ApBillRequestDto>(req);
    validateRequest(body);
    const result: ApBillPostingResponseDto = await processApBill(body, { preview: req.nextUrl.searchParams.has("preview") });
    return ok(result);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


