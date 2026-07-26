import type { ApCreditNoteRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

export async function processApCreditNote(
  input: ApCreditNoteRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_CREDIT_NOTE", input, options);
}
