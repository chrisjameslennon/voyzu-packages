import type { AccountType } from "@voyzu/types/modules/core";

export interface GlAccountCategoryCreateRequestDto {
  code: string;
  name: string;
  accountType: AccountType;
  sequence: number;
}
