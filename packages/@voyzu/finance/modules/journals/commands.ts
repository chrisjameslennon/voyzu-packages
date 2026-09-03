import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { JournalResponseDto } from "@voyzu/finance/types/modules/journals";



export const listJournals = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(JournalResponseDto) },
  () => import("./server/lib/journal.service").then((module) => module.listJournals),
);
export const listJournalsWithLines = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(JournalResponseDto) },
  () => import("./server/lib/journal.service").then((module) => module.listJournalsWithLines),
);
export const getJournal = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([JournalResponseDto, Type.Null()]) },
  () => import("./server/lib/journal.service").then((module) => module.getJournal),
);

export const commands = {
  listJournals,
  listJournalsWithLines,
  getJournal,
} as const;
