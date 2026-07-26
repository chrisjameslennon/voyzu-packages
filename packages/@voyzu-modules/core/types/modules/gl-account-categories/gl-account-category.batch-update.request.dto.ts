import type { GlAccountCategoryUpdateRequestDto } from "./gl-account-category.update.request.dto";

export interface GlAccountCategoryBatchUpdateRequestDto extends GlAccountCategoryUpdateRequestDto {
  /** GL account category business code identifying the category to update. */
  code: string;
}
