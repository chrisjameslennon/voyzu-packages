"use client";

import { Badge, Button } from "@voyzu/ui-components";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import styles from "./ControlAccountSummaryPanel.module.css";

export interface ControlAccountSummaryPanelProps {
  title: string;
  code: string;
  description: string;
  supportingLedger: string;
  glAccountName?: string | null;
  glAccountCode?: string | null;
  hasPostings: boolean;
  onViewEdit: () => void;
}

export function ControlAccountSummaryPanel({
  title,
  code,
  description,
  supportingLedger,
  glAccountName,
  glAccountCode,
  hasPostings,
  onViewEdit,
}: ControlAccountSummaryPanelProps) {
  return (
    <section className={styles.panel}>
      <div>
        <h2 className={`${typography.sectionHeading} ${styles.panelTitle}`}>{title}</h2>
        <Badge variant="soft" size="small" color="neutral">{code}</Badge>
      </div>

      <p className={styles.blurb}>{description}</p>

      <dl className={styles.detailList}>
        <div className={styles.detailRow}>
          <dt className={typography.fieldLabel}>Supporting Ledger</dt>
          <dd>{supportingLedger}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt className={typography.fieldLabel}>Posts to</dt>
          <dd>
            {glAccountName && glAccountCode ? (
              <span className={styles.accountValue}>
                <span className={styles.accountName}>{glAccountName}</span>
                <Badge variant="soft" size="small" color="neutral">{glAccountCode}</Badge>
              </span>
            ) : "Not assigned"}
          </dd>
        </div>
        <div className={styles.detailRow}>
          <dt className={typography.fieldLabel}>Has Postings</dt>
          <dd>{hasPostings ? "Yes" : "No"}</dd>
        </div>
      </dl>

      <div className={styles.panelActions}>
        <Button variant="secondary" icon="edit_square" onClick={onViewEdit}>
          View / Edit
        </Button>
      </div>
    </section>
  );
}
