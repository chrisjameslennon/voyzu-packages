import type { ItemPostingProfilePatchRequestDto } from "./item-posting-profile.patch.request.dto";

export interface ItemPostingProfileBatchPatchRequestDto extends ItemPostingProfilePatchRequestDto {
  profile_code: string;
}
