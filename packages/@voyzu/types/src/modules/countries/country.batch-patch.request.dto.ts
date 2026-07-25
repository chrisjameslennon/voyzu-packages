import type { CountryPatchRequestDto } from "./country.patch.request.dto";

export interface CountryBatchPatchRequestDto extends CountryPatchRequestDto {
  /** Stable country code identifying the row to patch. */
  code: string;
}
