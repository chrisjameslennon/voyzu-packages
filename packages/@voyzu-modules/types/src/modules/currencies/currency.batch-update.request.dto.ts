import type { CurrencyUpdateRequestDto } from "./currency.update.request.dto";

export interface CurrencyBatchUpdateRequestDto extends CurrencyUpdateRequestDto {
  /** Currency business code identifying the currency to update. */
  code: string;
}
