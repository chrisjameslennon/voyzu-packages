import type { ArCreditNoteRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-credit-note.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArAdjustment, type ProcessArAdjustmentOptions } from "../../core/ar_adjustments/lib/ar-adjustment.service";

async function processArCreditNoteUnchecked(
  input: ArCreditNoteRequestDto,
  options: ProcessArAdjustmentOptions = {},
): Promise<ArAdjustmentPostingResponseDto> {
  return processArAdjustment("AR_CREDIT_NOTE", input, options);
}

export const processArCreditNote = processArCreditNoteUnchecked;
