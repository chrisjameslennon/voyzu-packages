import type { GlAccountPatchRequestDto } from "./gl-account.patch.request.dto";

export interface GlAccountBatchPatchRequestDto extends GlAccountPatchRequestDto {
  /** GL account business code identifying the account to patch. */
  code: string;
}
