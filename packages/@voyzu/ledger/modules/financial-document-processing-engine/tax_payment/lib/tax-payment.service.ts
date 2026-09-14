import type { TaxPaymentRequestDto } from "../../types/tax-processing.request.dto";
import { processTaxDocument } from "../../core/tax_processing/tax-processing.service";

export function processTaxPayment(input: TaxPaymentRequestDto, options: { preview?: boolean } = {}) {
  return processTaxDocument("TAX_PAYMENT", input, options);
}
