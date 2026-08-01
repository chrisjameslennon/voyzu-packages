import type { GlAccountUpdateRequestDto } from "./gl-account.update.request.dto";

export interface GlAccountBatchUpdateRequestDto extends GlAccountUpdateRequestDto {
  /** GL account business code identifying the account to update. */
  code: string;
}
