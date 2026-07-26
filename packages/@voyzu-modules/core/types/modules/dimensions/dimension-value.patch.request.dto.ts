import type { DimensionValueStatus } from "./dimension-value.response.dto";

export interface DimensionValuePatchRequestDto {
  /** Display name, limited to 14 letters, numbers, spaces, dashes or underscores. */
  name?: string;
  /** Current lifecycle status of the dimension value. */
  status?: DimensionValueStatus;
}
