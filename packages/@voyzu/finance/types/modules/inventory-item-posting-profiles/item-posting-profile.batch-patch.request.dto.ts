import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { ItemPostingProfilePatchRequestDto } from "./item-posting-profile.patch.request.dto";
import { BusinessCode } from "@voyzu/finance/types/constraints";

export const ItemPostingProfileBatchPatchRequestDto = StrictObject({
  ...ItemPostingProfilePatchRequestDto.properties,
  profile_code: BusinessCode,
});
export type ItemPostingProfileBatchPatchRequestDto = Type.Static<typeof ItemPostingProfileBatchPatchRequestDto>;
