import type { TaxRefundRequestDto } from "../../types/tax-processing.request.dto";
import { processTaxDocument } from "../../core/tax_processing/tax-processing.service";

export function processTaxRefund(input: TaxRefundRequestDto, options: { preview?: boolean } = {}) {
  return processTaxDocument("TAX_REFUND", input, options);
}
