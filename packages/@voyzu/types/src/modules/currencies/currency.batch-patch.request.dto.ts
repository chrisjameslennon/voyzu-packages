import type { CurrencyPatchRequestDto } from "./currency.patch.request.dto";

export interface CurrencyBatchPatchRequestDto extends CurrencyPatchRequestDto {
  /** Currency business code identifying the currency to patch. */
  code: string;
}
