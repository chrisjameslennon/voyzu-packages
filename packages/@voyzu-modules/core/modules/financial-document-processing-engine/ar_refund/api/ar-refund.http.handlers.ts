import { NextResponse, type NextRequest } from "next/server";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import { parseBody } from "@voyzu/capability/http";
import type { ArRefundRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-refund.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArRefund } from "../lib/ar-refund.service";

export async function handleProcess(req: NextRequest) {
  try {
    const body = await parseBody<ArRefundRequestDto>(req);
    const result: ArAdjustmentPostingResponseDto = await processArRefund(body, { preview: req.nextUrl.searchParams.has("preview") });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InputValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof BusinessRuleError) return NextResponse.json({ error: error.message }, { status: 422 });
    throw error;
  }
}

