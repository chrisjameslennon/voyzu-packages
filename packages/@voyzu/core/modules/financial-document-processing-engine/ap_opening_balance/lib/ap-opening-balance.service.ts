import type { ApOpeningBalanceRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApOpeningBalanceUnchecked(
  input: ApOpeningBalanceRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_OPENING_BALANCE", input, options);
}

export const processApOpeningBalance = processApOpeningBalanceUnchecked;
