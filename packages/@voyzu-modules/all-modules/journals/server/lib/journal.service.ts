import { getDb } from "@voyzu/capability";
import { withAuditActors } from "@voyzu-modules/all-modules/common/server";
import type { JournalResponseDto } from "@voyzu-modules/types/modules/journals";

import { JournalRepo } from "../db/journal.repo";
import { toDto } from "./journal.mapper";

export async function listJournals(companyId: number): Promise<JournalResponseDto[]> {
  const rows = await new JournalRepo(getDb()).listByCompany(companyId);
  return Promise.all(rows.map(async (row) => withAuditActors(toDto(row), row)));
}

export async function listJournalsWithLines(companyId: number): Promise<JournalResponseDto[]> {
  const repo = new JournalRepo(getDb());
  const rows = await repo.listByCompany(companyId);
  const lines = await repo.listLinesByJournalIds(rows.map((row) => row.id));
  const linesByJournalId = new Map<number, typeof lines>();

  for (const line of lines) {
    const journalLines = linesByJournalId.get(line.journal_header_id) ?? [];
    journalLines.push(line);
    linesByJournalId.set(line.journal_header_id, journalLines);
  }

  return Promise.all(rows.map(async (row) => (
    withAuditActors(toDto(row, linesByJournalId.get(row.id) ?? []), row)
  )));
}

export async function getJournal(companyId: number, code: string): Promise<JournalResponseDto | null> {
  const repo = new JournalRepo(getDb());
  const row = await repo.get(companyId, code);
  if (!row) return null;

  const lines = await repo.listLines(row.id);
  const lineDimensionsMap = new Map<number, Awaited<ReturnType<JournalRepo["listLineDimensions"]>>>();
  await Promise.all(lines.map(async (line) => {
    lineDimensionsMap.set(line.id, await repo.listLineDimensions(line.id));
  }));

  return withAuditActors(toDto(row, lines, lineDimensionsMap), row);
}
