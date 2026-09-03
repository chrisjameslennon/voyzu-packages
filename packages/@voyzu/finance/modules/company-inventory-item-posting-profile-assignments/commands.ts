import "server-only";
import Type from "typebox";
import { command } from "@voyzu/capability/commands";
import { AssignPostingProfileRequestDto, PostingAssignmentsDto } from "./types";

export const listInventoryItemPostingProfileAssignments = command.defineLazy({ parameters: Type.Tuple([Type.Number()]), result: PostingAssignmentsDto }, () => import("./server/lib/posting-profile-assignment.service").then((module) => module.listPostingProfileAssignments));
export const assignInventoryItemPostingProfile = command.defineLazy({ parameters: Type.Tuple([Type.Number(), AssignPostingProfileRequestDto]), result: PostingAssignmentsDto }, () => import("./server/lib/posting-profile-assignment.service").then((module) => module.assignPostingProfile));
export const commands = { listInventoryItemPostingProfileAssignments, assignInventoryItemPostingProfile } as const;
