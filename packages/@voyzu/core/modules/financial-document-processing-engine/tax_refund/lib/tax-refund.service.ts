import type { TaxRefundRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/tax-processing.request.dto";
import { processTaxDocument } from "../../core/tax_processing/tax-processing.service";

export function processTaxRefund(input: TaxRefundRequestDto, options: { preview?: boolean } = {}) {
  return processTaxDocument("TAX_REFUND", input, options);
}
