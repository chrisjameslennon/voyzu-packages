import { NextResponse, type NextRequest } from "next/server";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import { parseBody } from "@voyzu/capability/http";
import type { TaxRefundRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/tax-processing.request.dto";
import type { TaxProcessingPostingResponseDto } from "@voyzu/types/modules/financial-document-processing-engine/tax-processing.response.dto";

import { processTaxRefund } from "../lib/tax-refund.service";

export async function handleProcess(req: NextRequest) {
  try {
    const body = await parseBody<TaxRefundRequestDto>(req);
    const result: TaxProcessingPostingResponseDto = await processTaxRefund(body, { preview: req.nextUrl.searchParams.has("preview") });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InputValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof BusinessRuleError) return NextResponse.json({ error: error.message }, { status: 422 });
    throw error;
  }
}

