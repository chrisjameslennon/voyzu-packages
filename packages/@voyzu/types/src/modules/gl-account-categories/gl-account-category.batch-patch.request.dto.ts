import type { GlAccountCategoryPatchRequestDto } from "./gl-account-category.patch.request.dto";

export interface GlAccountCategoryBatchPatchRequestDto extends GlAccountCategoryPatchRequestDto {
  /** GL account category business code identifying the category to patch. */
  code: string;
}
