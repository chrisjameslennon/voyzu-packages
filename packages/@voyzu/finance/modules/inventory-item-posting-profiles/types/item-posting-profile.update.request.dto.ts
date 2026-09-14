import Type from "typebox";
import { StrictObject } from "@voyzu/types/http-api";
import { ItemPostingProfileCreateRequestDto } from "./item-posting-profile.create.request.dto";

export const ItemPostingProfileUpdateRequestDto = ItemPostingProfileCreateRequestDto;
export type ItemPostingProfileUpdateRequestDto = Type.Static<typeof ItemPostingProfileUpdateRequestDto>;
