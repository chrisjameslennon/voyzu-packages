import type { ArRefundRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-refund.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArAdjustment, type ProcessArAdjustmentOptions } from "../../core/ar_adjustments/lib/ar-adjustment.service";

async function processArRefundUnchecked(
  input: ArRefundRequestDto,
  options: ProcessArAdjustmentOptions = {},
): Promise<ArAdjustmentPostingResponseDto> {
  return processArAdjustment("AR_REFUND", input, options);
}

export const processArRefund = processArRefundUnchecked;
