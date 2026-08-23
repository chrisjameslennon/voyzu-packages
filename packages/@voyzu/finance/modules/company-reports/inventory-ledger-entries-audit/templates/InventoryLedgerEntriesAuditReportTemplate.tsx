import type { InventoryLedgerEntriesAuditFieldDto, InventoryLedgerEntriesAuditResponseDto } from "@voyzu/finance/types/modules/company-reports";

import { journalEntriesReportCss, journalEntriesReportStyles as styles } from "./journal-entries-report.css";

function Field({ field }: { field: InventoryLedgerEntriesAuditFieldDto }) {
  return (
    <span className={styles.field}>
      <span className={styles.fieldLabel}>{field.label}:</span>
      <span className={styles.fieldValue}>{field.value ?? "-"}</span>
    </span>
  );
}

function JsonField({ field }: { field: InventoryLedgerEntriesAuditFieldDto }) {
  return (
    <div className={styles.jsonField}>
      <div className={styles.jsonFieldLabel}>{field.label}:</div>
      <div className={styles.jsonFieldValue}>{field.value ?? "-"}</div>
    </div>
  );
}

interface InventoryLedgerEntriesAuditReportTemplateProps {
  data: InventoryLedgerEntriesAuditResponseDto;
  generatedAt: string;
  showSnapshotData: boolean;
}

const JSON_FIELD_LABELS = new Set(["Document Snapshot JSON", "Detailed Document Snapshot JSON"]);

export function InventoryLedgerEntriesAuditReportTemplate({ data, generatedAt, showSnapshotData }: InventoryLedgerEntriesAuditReportTemplateProps) {
  return (
    <div className={styles.reportPage}>
      <style>{journalEntriesReportCss}</style>
      <style>{"@media print { @page { size: A4 landscape; } }"}</style>

      <section className={styles.reportSection}>
        <h1 className={styles.reportTitle}>{data.companyName}</h1>
        <div className={styles.reportSubTitle}>Inventory Ledger Entries</div>
        <div className={styles.reportSubTitle}>{data.fromDate} to {data.toDate}</div>

        <div className={styles.journalList}>
          {data.entries.map((entry) => (
            <div key={entry.id} className={styles.journal}>
              <div className={styles.headerRow}>
                {entry.fields.filter((field) => !JSON_FIELD_LABELS.has(field.label)).map((field) => (
                  <Field key={`${entry.id}-${field.label}`} field={field} />
                ))}
              </div>
              {showSnapshotData && (
                <div className={styles.fullWidthFields}>
                  {entry.fields.filter((field) => JSON_FIELD_LABELS.has(field.label)).map((field) => (
                    <JsonField key={`${entry.id}-${field.label}`} field={field} />
                  ))}
                </div>
              )}
              <div className={styles.journalDivider} />
            </div>
          ))}
          {data.entries.length === 0 && (
            <div className={styles.empty}>No Inventory subledger entries found for this date range.</div>
          )}
        </div>
      </section>

      <footer className={styles.reportFooter}>
        <span>Generated {generatedAt}</span>
      </footer>
    </div>
  );
}




