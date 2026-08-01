import type { TaxAdjustmentRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/tax-processing.request.dto";
import { processTaxDocument } from "../../core/tax_processing/tax-processing.service";

export function processTaxAdjustment(input: TaxAdjustmentRequestDto, options: { preview?: boolean } = {}) {
  return processTaxDocument("TAX_ADJUSTMENT", input, options);
}
