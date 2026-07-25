import type { ItemPostingProfileUpdateRequestDto } from "./item-posting-profile.update.request.dto";

export interface ItemPostingProfileBatchUpdateRequestDto extends ItemPostingProfileUpdateRequestDto {
  profile_code: string;
}
