import type { DimensionValueStatus } from "./dimension-value.response.dto";

export interface DimensionValueCreateRequestDto {
  /** Display name, limited to 14 letters, numbers, spaces, dashes or underscores. */
  name: string;
  /** Initial lifecycle status of the dimension value. Defaults to ACTIVE if omitted. */
  status?: DimensionValueStatus;
}
