import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { JournalResponseDto } from "@voyzu/finance/types/modules/journals";



export const listJournals = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(JournalResponseDto) },
  () => import("./server/lib/journal.service").then((module) => module.listJournals),
);
export const listJournalsWithLines = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(JournalResponseDto) },
  () => import("./server/lib/journal.service").then((module) => module.listJournalsWithLines),
);
export const getJournal = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([JournalResponseDto, Type.Null()]) },
  () => import("./server/lib/journal.service").then((module) => module.getJournal),
);

export const operations = {
  listJournals,
  listJournalsWithLines,
  getJournal,
} as const;
