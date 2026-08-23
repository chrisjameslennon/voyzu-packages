import { NextResponse, type NextRequest } from "next/server";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import { parseBody } from "@voyzu/capability/http";
import type { ApBillCancellationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-bill-cancellation.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApBillCancellation } from "../lib/ap-bill-cancellation.service";

export async function handleProcess(req: NextRequest) {
  try {
    const body = await parseBody<ApBillCancellationRequestDto>(req);
    const result: ApProcessingPostingResponseDto = await processApBillCancellation(body, { preview: req.nextUrl.searchParams.has("preview") });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InputValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof BusinessRuleError) return NextResponse.json({ error: error.message }, { status: 422 });
    throw error;
  }
}

