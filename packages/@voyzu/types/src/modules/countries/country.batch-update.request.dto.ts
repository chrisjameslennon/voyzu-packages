import type { CountryUpdateRequestDto } from "./country.update.request.dto";

export interface CountryBatchUpdateRequestDto extends CountryUpdateRequestDto {
  /** Stable country code identifying the row to update. */
  code: string;
}
