import "server-only";
import Type from "typebox";
import { operation } from "@voyzu/capability/operations";
import { AssignPostingProfileRequestDto, PostingAssignmentsDto } from "./types";

export const listInventoryItemPostingProfileAssignments = operation.defineLazy({ parameters: Type.Tuple([Type.Number()]), result: PostingAssignmentsDto }, () => import("./server/lib/posting-profile-assignment.service").then((module) => module.listPostingProfileAssignments));
export const assignInventoryItemPostingProfile = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), AssignPostingProfileRequestDto]), result: PostingAssignmentsDto }, () => import("./server/lib/posting-profile-assignment.service").then((module) => module.assignPostingProfile));
export const operations = { listInventoryItemPostingProfileAssignments, assignInventoryItemPostingProfile } as const;
