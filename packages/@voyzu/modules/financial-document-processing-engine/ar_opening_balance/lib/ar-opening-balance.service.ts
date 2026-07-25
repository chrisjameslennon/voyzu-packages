import type { ArOpeningBalanceRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/ar-opening-balance.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArAdjustment, type ProcessArAdjustmentOptions } from "../../core/ar_adjustments/lib/ar-adjustment.service";

export async function processArOpeningBalance(
  input: ArOpeningBalanceRequestDto,
  options: ProcessArAdjustmentOptions = {},
): Promise<ArAdjustmentPostingResponseDto> {
  return processArAdjustment("AR_OPENING_BALANCE", input, options);
}
