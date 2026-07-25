import type { AccountType } from "../core";

export interface GlAccountCategoryPatchRequestDto {
  /** GL account category display name. */
  name?: string;
  /** Account type grouped by this category. */
  accountType?: AccountType;
  /** Sort sequence for the category. */
  sequence?: number;
}
