import { withResponseValidation } from "@voyzu/capability/validation";
import type { ApRefundRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApRefundUnchecked(
  input: ApRefundRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_REFUND", input, options);
}

export const processApRefund = withResponseValidation(processApRefundUnchecked, "processApRefund");
