import type { ApWriteOffRequestDto } from "../../types/ap-adjustment.request.dto";
import type { ApProcessingPostingResponseDto } from "../../types/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApWriteOffUnchecked(
  input: ApWriteOffRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_WRITE_OFF", input, options);
}

export const processApWriteOff = processApWriteOffUnchecked;
