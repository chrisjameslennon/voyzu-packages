import type { ApBillCancellationRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-bill-cancellation.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

export async function processApBillCancellation(
  input: ApBillCancellationRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_BILL_CANCELLATION", input, options);
}
