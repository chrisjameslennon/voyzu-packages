import { type NextRequest, type NextResponse } from "next/server";

import type { LedgerJournalRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal.request.dto";
import type { LedgerJournalPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal.response.dto";
import { businessRuleError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";
import { ok } from "@voyzu/capability/http";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";

import { processLedgerJournal } from "../lib/ledger-journal.service";


export async function handleProcess(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await parseBody<LedgerJournalRequestDto>(req);
    const result: LedgerJournalPostingResponseDto = await processLedgerJournal(body, { preview: req.nextUrl.searchParams.has("preview") });
    return ok(result);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


