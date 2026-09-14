import { NextResponse, type NextRequest } from "next/server";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import { parseBody } from "@voyzu/capability/http";
import type { ArCreditNoteRequestDto } from "../../types/ar-credit-note.request.dto";
import type { ArAdjustmentPostingResponseDto } from "../../types/ar-adjustment.response.dto";

import { processArCreditNote } from "../lib/ar-credit-note.service";

export async function handleProcess(req: NextRequest) {
  try {
    const body = await parseBody<ArCreditNoteRequestDto>(req);
    const result: ArAdjustmentPostingResponseDto = await processArCreditNote(body, { preview: req.nextUrl.searchParams.has("preview") });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InputValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof BusinessRuleError) return NextResponse.json({ error: error.message }, { status: 422 });
    throw error;
  }
}

