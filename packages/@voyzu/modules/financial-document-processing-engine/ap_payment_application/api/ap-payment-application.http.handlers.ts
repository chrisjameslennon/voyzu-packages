import { NextResponse, type NextRequest } from "next/server";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import { parseBody } from "@voyzu/capability/http";
import type { ApPaymentApplicationRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/ap-payment-application.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApPaymentApplication } from "../lib/ap-payment-application.service";

export async function handleProcess(req: NextRequest) {
  try {
    const body = await parseBody<ApPaymentApplicationRequestDto>(req);
    const result: ApProcessingPostingResponseDto = await processApPaymentApplication(body, { preview: req.nextUrl.searchParams.has("preview") });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InputValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof BusinessRuleError) return NextResponse.json({ error: error.message }, { status: 422 });
    throw error;
  }
}

