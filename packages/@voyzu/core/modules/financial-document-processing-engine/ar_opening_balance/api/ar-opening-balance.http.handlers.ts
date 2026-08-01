import { NextResponse, type NextRequest } from "next/server";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import { parseBody } from "@voyzu/capability/http";
import type { ArOpeningBalanceRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-opening-balance.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArOpeningBalance } from "../lib/ar-opening-balance.service";

export async function handleProcess(req: NextRequest) {
  try {
    const body = await parseBody<ArOpeningBalanceRequestDto>(req);
    const result: ArAdjustmentPostingResponseDto = await processArOpeningBalance(body, { preview: req.nextUrl.searchParams.has("preview") });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InputValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof BusinessRuleError) return NextResponse.json({ error: error.message }, { status: 422 });
    throw error;
  }
}

