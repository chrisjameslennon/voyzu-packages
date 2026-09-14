import type { ApCreditNoteRequestDto } from "../../types/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "../../types/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApCreditNoteUnchecked(
  input: ApCreditNoteRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_CREDIT_NOTE", input, options);
}

export const processApCreditNote = processApCreditNoteUnchecked;
