"use client";

import type { AuditEventResponseDto } from "@voyzu/audit/types";
import { Badge, Breadcrumbs } from "@voyzu/ui-components";
import { getAuditActionColor } from "@voyzu/audit/client";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import styles from "./ice-cream-audit.module.css";

export function IceCreamAuditEventDetail({ event }: { event: AuditEventResponseDto }) {
  return (
    <div className={styles.page}>
      <Breadcrumbs />
      <div className={styles.detailTitleRow}>
        <h1>Audit Event {event.code}</h1>
        <DetailBackButton fallbackHref="/ice-creams/audit" preserveSearchParams />
      </div>
      <section className={styles.card}>
        <dl className={styles.details}>
          <dt>Package</dt><dd>{event.packageCode}</dd>
          <dt>Timestamp</dt><dd>{new Date(event.creationDate).toLocaleString()}</dd>
          <dt>Action</dt><dd><Badge variant="soft" size="small" color={getAuditActionColor(event.action)}>{event.action}</Badge></dd>
          <dt>Entity</dt><dd>{event.entityType} — {event.entityCode ?? event.entityId}</dd>
          <dt>User</dt><dd>{event.actorDisplayName ?? event.actorCode ?? event.actorId ?? `(${event.actorType})`}</dd>
          <dt>Mutation</dt><dd>{event.mutationId ?? "-"}</dd>
        </dl>
      </section>
      <section className={styles.card}>
        <h2>Changes</h2>
        <table className={styles.changes}>
          <thead><tr><th>Field</th><th>Old value</th><th>New value</th></tr></thead>
          <tbody>{event.changes?.map((change) => <tr key={change.id}><td>{change.fieldPath}</td><td>{JSON.stringify(change.oldValue)}</td><td>{JSON.stringify(change.newValue)}</td></tr>)}</tbody>
        </table>
      </section>
    </div>
  );
}
