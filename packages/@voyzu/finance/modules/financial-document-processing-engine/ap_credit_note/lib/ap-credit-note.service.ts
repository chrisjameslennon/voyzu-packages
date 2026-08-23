import type { ApCreditNoteRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApCreditNoteUnchecked(
  input: ApCreditNoteRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_CREDIT_NOTE", input, options);
}

export const processApCreditNote = processApCreditNoteUnchecked;
