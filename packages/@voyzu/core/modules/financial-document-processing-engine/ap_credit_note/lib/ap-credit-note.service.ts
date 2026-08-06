import { withResponseValidation } from "@voyzu/capability/validation";
import type { ApCreditNoteRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApCreditNoteUnchecked(
  input: ApCreditNoteRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_CREDIT_NOTE", input, options);
}

export const processApCreditNote = withResponseValidation(processApCreditNoteUnchecked, "processApCreditNote");
