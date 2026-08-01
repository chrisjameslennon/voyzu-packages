import type { AccountType } from "@voyzu/core/types/modules/core";

export interface GlAccountUpdateRequestDto {
  /** Business code of the GL account. */
  code: string;
  /** Display name of the GL account. */
  name: string;
  /** The accounting type of this GL account (e.g. ASSET, LIABILITY). */
  accountType: AccountType;
  /** ID of the GL account category this account belongs to. */
  accountCategoryId?: number;
}
