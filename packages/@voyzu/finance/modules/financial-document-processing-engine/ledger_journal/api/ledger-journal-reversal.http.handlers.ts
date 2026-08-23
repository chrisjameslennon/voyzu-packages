import { type NextRequest, type NextResponse } from "next/server";

import type { LedgerJournalReversalRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal-reversal.request.dto";
import type { LedgerJournalReversalPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal-reversal.response.dto";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";

import { processLedgerJournalReversal } from "../lib/ledger-journal-reversal.service";


export async function handleProcess(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await parseBody<LedgerJournalReversalRequestDto>(req);
    const result: LedgerJournalReversalPostingResponseDto = await processLedgerJournalReversal(body, { preview: req.nextUrl.searchParams.has("preview") });
    return ok(result);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


