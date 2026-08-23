import type { ApBillCancellationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-bill-cancellation.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApBillCancellationUnchecked(
  input: ApBillCancellationRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_BILL_CANCELLATION", input, options);
}

export const processApBillCancellation = processApBillCancellationUnchecked;
