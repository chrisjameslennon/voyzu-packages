import type { ApPaymentRequestDto } from "../../types/ap-payment.request.dto";
import type { ApProcessingPostingResponseDto } from "../../types/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApPaymentUnchecked(
  input: ApPaymentRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_PAYMENT", input, options);
}

export const processApPayment = processApPaymentUnchecked;
