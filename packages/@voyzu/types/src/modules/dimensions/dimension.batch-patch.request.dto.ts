import type { DimensionPatchRequestDto } from "./dimension.patch.request.dto";

export interface DimensionBatchPatchRequestDto extends DimensionPatchRequestDto {
  /** Dimension business code identifying the dimension to patch. */
  code: string;
}
