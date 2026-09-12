import type { ApPaymentApplicationRequestDto } from "../../types/ap-payment-application.request.dto";
import type { ApProcessingPostingResponseDto } from "../../types/ap-processing.response.dto";

import { processApDocument } from "../../core/ap_processing/ap-processing.service";

async function processApPaymentApplicationUnchecked(
  input: ApPaymentApplicationRequestDto,
  options: { preview?: boolean } = {},
): Promise<ApProcessingPostingResponseDto> {
  return processApDocument("AP_PAYMENT_APPLICATION", input, options);
}

export const processApPaymentApplication = processApPaymentApplicationUnchecked;
