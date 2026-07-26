import type { ArRefundRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-refund.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArAdjustment, type ProcessArAdjustmentOptions } from "../../core/ar_adjustments/lib/ar-adjustment.service";

export async function processArRefund(
  input: ArRefundRequestDto,
  options: ProcessArAdjustmentOptions = {},
): Promise<ArAdjustmentPostingResponseDto> {
  return processArAdjustment("AR_REFUND", input, options);
}
