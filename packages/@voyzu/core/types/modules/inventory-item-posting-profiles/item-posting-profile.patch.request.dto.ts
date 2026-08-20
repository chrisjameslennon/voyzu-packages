import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { ItemPostingProfileUpdateRequestDto } from "./item-posting-profile.update.request.dto";

export const ItemPostingProfilePatchRequestDto = Type.Partial(ItemPostingProfileUpdateRequestDto, {
  additionalProperties: false,
  minProperties: 1,
});
export type ItemPostingProfilePatchRequestDto = Type.Static<typeof ItemPostingProfilePatchRequestDto>;
