import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { ItemPostingProfileUpdateRequestDto } from "./item-posting-profile.update.request.dto";
import { BusinessCode } from "@voyzu/core/types/constraints";

export const ItemPostingProfileBatchUpdateRequestDto = StrictObject({
  ...ItemPostingProfileUpdateRequestDto.properties,
  profile_code: BusinessCode,
});
export type ItemPostingProfileBatchUpdateRequestDto = Type.Static<typeof ItemPostingProfileBatchUpdateRequestDto>;
