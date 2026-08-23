import type { ArOpeningBalanceRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-opening-balance.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArAdjustment, type ProcessArAdjustmentOptions } from "../../core/ar_adjustments/lib/ar-adjustment.service";

async function processArOpeningBalanceUnchecked(
  input: ArOpeningBalanceRequestDto,
  options: ProcessArAdjustmentOptions = {},
): Promise<ArAdjustmentPostingResponseDto> {
  return processArAdjustment("AR_OPENING_BALANCE", input, options);
}

export const processArOpeningBalance = processArOpeningBalanceUnchecked;
