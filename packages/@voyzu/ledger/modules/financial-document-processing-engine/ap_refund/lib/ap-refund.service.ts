import type { ApRefundRequestDto } from "../../types/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "../../types/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApRefundUnchecked(
  input: ApRefundRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_REFUND", input, options);
}

export const processApRefund = processApRefundUnchecked;
