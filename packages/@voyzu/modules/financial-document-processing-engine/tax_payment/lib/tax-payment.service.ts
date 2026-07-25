import type { TaxPaymentRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/tax-processing.request.dto";
import { processTaxDocument } from "../../core/tax_processing/tax-processing.service";

export function processTaxPayment(input: TaxPaymentRequestDto, options: { preview?: boolean } = {}) {
  return processTaxDocument("TAX_PAYMENT", input, options);
}
