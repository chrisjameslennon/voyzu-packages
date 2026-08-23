import type { ArWriteOffRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-write-off.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArAdjustment, type ProcessArAdjustmentOptions } from "../../core/ar_adjustments/lib/ar-adjustment.service";

async function processArWriteOffUnchecked(
  input: ArWriteOffRequestDto,
  options: ProcessArAdjustmentOptions = {},
): Promise<ArAdjustmentPostingResponseDto> {
  return processArAdjustment("AR_WRITE_OFF", input, options);
}

export const processArWriteOff = processArWriteOffUnchecked;
