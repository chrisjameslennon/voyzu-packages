import "server-only";

import * as service0 from "./server/lib/journal.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listJournals = operation(service0.listJournals);
export const listJournalsWithLines = operation(service0.listJournalsWithLines);
export const getJournal = operation(service0.getJournal);

export const operations = {
  listJournals,
  listJournalsWithLines,
  getJournal,
} as const;
