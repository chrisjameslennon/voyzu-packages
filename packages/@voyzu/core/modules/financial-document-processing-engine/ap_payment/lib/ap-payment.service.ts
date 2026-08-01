import type { ApPaymentRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-payment.request.dto";
import type { ApProcessingPostingResponseDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

export async function processApPayment(
  input: ApPaymentRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_PAYMENT", input, options);
}
