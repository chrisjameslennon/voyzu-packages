import type { ArWriteOffRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/ar-write-off.request.dto";
import type { ArAdjustmentPostingResponseDto } from "@voyzu/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";

import { processArAdjustment, type ProcessArAdjustmentOptions } from "../../core/ar_adjustments/lib/ar-adjustment.service";

export async function processArWriteOff(
  input: ArWriteOffRequestDto,
  options: ProcessArAdjustmentOptions = {},
): Promise<ArAdjustmentPostingResponseDto> {
  return processArAdjustment("AR_WRITE_OFF", input, options);
}
