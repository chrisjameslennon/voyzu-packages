import type { AccountType } from "../core";

export interface GlAccountCategoryCreateRequestDto {
  code: string;
  name: string;
  accountType: AccountType;
  sequence: number;
}
