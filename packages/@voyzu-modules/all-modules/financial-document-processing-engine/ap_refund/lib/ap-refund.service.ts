import type { ApRefundRequestDto } from "@voyzu-modules/types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu-modules/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

export async function processApRefund(
  input: ApRefundRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_REFUND", input, options);
}
