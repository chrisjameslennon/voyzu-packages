import { NextResponse, type NextRequest } from "next/server";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import { parseBody } from "@voyzu/capability/http";
import type { ApOpeningBalanceRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApOpeningBalance } from "../lib/ap-opening-balance.service";

export async function handleProcess(req: NextRequest) {
  try {
    const body = await parseBody<ApOpeningBalanceRequestDto>(req);
    const result: ApProcessingPostingResponseDto = await processApOpeningBalance(body, { preview: req.nextUrl.searchParams.has("preview") });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InputValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof BusinessRuleError) return NextResponse.json({ error: error.message }, { status: 422 });
    throw error;
  }
}

