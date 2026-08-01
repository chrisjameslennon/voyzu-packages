import type { ArCreditNoteRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-credit-note.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArAdjustment, type ProcessArAdjustmentOptions } from "../../core/ar_adjustments/lib/ar-adjustment.service";

export async function processArCreditNote(
  input: ArCreditNoteRequestDto,
  options: ProcessArAdjustmentOptions = {},
): Promise<ArAdjustmentPostingResponseDto> {
  return processArAdjustment("AR_CREDIT_NOTE", input, options);
}
