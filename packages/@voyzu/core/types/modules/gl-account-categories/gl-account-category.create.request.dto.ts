import type { AccountType } from "@voyzu/core/types/modules/core";

export interface GlAccountCategoryCreateRequestDto {
  code: string;
  name: string;
  accountType: AccountType;
  sequence: number;
}
