import { NextResponse, type NextRequest } from "next/server";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import { parseBody } from "@voyzu/capability/http";
import type { TaxPaymentRequestDto } from "@voyzu-modules/types/modules/financial-document-processing-engine/tax-processing.request.dto";
import type { TaxProcessingPostingResponseDto } from "@voyzu-modules/types/modules/financial-document-processing-engine/tax-processing.response.dto";

import { processTaxPayment } from "../lib/tax-payment.service";

export async function handleProcess(req: NextRequest) {
  try {
    const body = await parseBody<TaxPaymentRequestDto>(req);
    const result: TaxProcessingPostingResponseDto = await processTaxPayment(body, { preview: req.nextUrl.searchParams.has("preview") });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InputValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof BusinessRuleError) return NextResponse.json({ error: error.message }, { status: 422 });
    throw error;
  }
}

