import { getDb } from "@voyzu/capability";
import { withAuditActors } from "@voyzu/core/common/server";
import type { JournalResponseDto } from "@voyzu/core/types/modules/journals";

import { JournalRepo } from "../db/journal.repo";
import { toDto } from "./journal.mapper";

async function enrichRow(
  row: Parameters<typeof toDto>[0],
  lines?: Parameters<typeof toDto>[1],
  dimensions?: Parameters<typeof toDto>[2],
): Promise<JournalResponseDto> {
  const dto = await withAuditActors(toDto(row, lines, dimensions), row);
  return dto;
}

export async function listJournals(companyId: number): Promise<JournalResponseDto[]> {
  const rows = await new JournalRepo(getDb()).listByCompany(companyId);
  return Promise.all(rows.map((row) => enrichRow(row)));
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

  return Promise.all(rows.map((row) => enrichRow(row, linesByJournalId.get(row.id) ?? [])));
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

  return enrichRow(row, lines, lineDimensionsMap);
}
