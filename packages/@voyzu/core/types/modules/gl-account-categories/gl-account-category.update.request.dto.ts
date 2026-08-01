import type { AccountType } from "@voyzu/core/types/modules/core";

export interface GlAccountCategoryUpdateRequestDto {
  /** GL account category display name. */
  name: string;
  /** Account type grouped by this category. */
  accountType: AccountType;
  /** Sort sequence for the category. */
  sequence: number;
}
