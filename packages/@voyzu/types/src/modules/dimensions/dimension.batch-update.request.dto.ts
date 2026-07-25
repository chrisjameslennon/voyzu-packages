import type { DimensionUpdateRequestDto } from "./dimension.update.request.dto";

export interface DimensionBatchUpdateRequestDto extends DimensionUpdateRequestDto {
  /** Dimension business code identifying the dimension to update. */
  code: string;
}
