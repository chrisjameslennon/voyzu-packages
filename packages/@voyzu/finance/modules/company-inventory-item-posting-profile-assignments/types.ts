import Type, { type Static } from "typebox";
import { StrictObject } from "@voyzu/types/api";

export const PostingProfileOptionDto = StrictObject({ id: Type.Integer(), code: Type.String(), name: Type.String(), status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]) });
export const PostingAssignmentDto = StrictObject({
  id: Type.Integer(), sku: Type.String(), name: Type.String(), category: Type.Union([Type.String(), Type.Null()]),
  itemType: Type.String(), unit: Type.Union([Type.String(), Type.Null()]), postingProfileId: Type.Union([Type.Integer(), Type.Null()]),
  postingCode: Type.Union([Type.String(), Type.Null()]), status: Type.String(),
});
export const PostingAssignmentsDto = StrictObject({ inventoryInstalled: Type.Boolean(), profiles: Type.Array(PostingProfileOptionDto), items: Type.Array(PostingAssignmentDto) });
export const AssignPostingProfileRequestDto = StrictObject({ itemIds: Type.Array(Type.Integer({ minimum: 1 }), { minItems: 1 }), postingProfileId: Type.Integer({ minimum: 1 }) });

export type PostingAssignment = Static<typeof PostingAssignmentDto>;
export type PostingAssignments = Static<typeof PostingAssignmentsDto>;
export type AssignPostingProfileRequest = Static<typeof AssignPostingProfileRequestDto>;
