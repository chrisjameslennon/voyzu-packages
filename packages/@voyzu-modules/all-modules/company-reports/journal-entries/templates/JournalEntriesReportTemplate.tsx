import type { JournalEntriesFieldDto, JournalEntriesResponseDto } from "@voyzu-modules/types/modules/company-reports";

import { journalEntriesReportCss, journalEntriesReportStyles as styles } from "./journal-entries-report.css";

type JournalEntriesLine = JournalEntriesResponseDto["lines"][number];

function Field({ field }: { field: JournalEntriesFieldDto }) {
  return (
    <span className={styles.field}>
      <span className={styles.fieldLabel}>{field.label}:</span>
      <span className={styles.fieldValue}>{field.value ?? "-"}</span>
    </span>
  );
}

function JsonField({ field }: { field: JournalEntriesFieldDto }) {
  return (
    <div className={styles.jsonField}>
      <div className={styles.jsonFieldLabel}>{field.label}:</div>
      <div className={styles.jsonFieldValue}>{field.value ?? "-"}</div>
    </div>
  );
}

function fieldValue(fields: JournalEntriesFieldDto[], label: string): string {
  return fields.find((field) => field.label === label)?.value ?? "";
}

function groupByJournal(lines: JournalEntriesLine[]): Array<{ journalId: string; headerFields: JournalEntriesFieldDto[]; lines: JournalEntriesLine[] }> {
  const journals = new Map<string, { journalId: string; headerFields: JournalEntriesFieldDto[]; lines: JournalEntriesLine[] }>();
  for (const line of lines) {
    const journalId = fieldValue(line.headerFields, "Journal ID") || line.id;
    const existing = journals.get(journalId);
    if (existing) {
      existing.lines.push(line);
    } else {
      journals.set(journalId, { journalId, headerFields: line.headerFields, lines: [line] });
    }
  }
  return [...journals.values()];
}

interface JournalEntriesReportTemplateProps {
  data: JournalEntriesResponseDto;
  generatedAt: string;
  showSnapshotData: boolean;
}

const JSON_FIELD_LABELS = new Set(["Document Snapshot JSON", "Detailed Document Snapshot JSON"]);

export function JournalEntriesReportTemplate({ data, generatedAt, showSnapshotData }: JournalEntriesReportTemplateProps) {
  const journals = groupByJournal(data.lines);

  return (
    <div className={styles.reportPage}>
      <style>{journalEntriesReportCss}</style>
      <style>{"@media print { @page { size: A4 landscape; } }"}</style>

      <section className={styles.reportSection}>
        <h1 className={styles.reportTitle}>{data.companyName}</h1>
        <div className={styles.reportSubTitle}>Journal Entries</div>
        <div className={styles.reportSubTitle}>{data.fromDate} to {data.toDate}</div>

        <div className={styles.journalList}>
          {journals.map((journal) => (
            <div key={journal.journalId} className={styles.journal}>
              <div className={styles.headerRow}>
                {journal.headerFields.filter((field) => !JSON_FIELD_LABELS.has(field.label)).map((field) => (
                  <Field key={`${journal.journalId}-${field.label}`} field={field} />
                ))}
              </div>
              {showSnapshotData && (
                <div className={styles.fullWidthFields}>
                  {journal.headerFields.filter((field) => JSON_FIELD_LABELS.has(field.label)).map((field) => (
                    <JsonField key={`${journal.journalId}-${field.label}`} field={field} />
                  ))}
                </div>
              )}

              <div className={styles.lineList}>
                {journal.lines.map((line) => (
                  <div key={line.id} className={styles.lineRow}>
                    {line.lineFields.map((field) => (
                      <Field key={`${line.id}-${field.label}`} field={field} />
                    ))}
                  </div>
                ))}
              </div>
              <div className={styles.journalDivider} />
            </div>
          ))}
          {data.lines.length === 0 && (
            <div className={styles.empty}>No journal lines found for this date range.</div>
          )}
        </div>
      </section>

      <footer className={styles.reportFooter}>
        <span>Generated {generatedAt}</span>
      </footer>
    </div>
  );
}
