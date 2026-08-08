"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuditEventListResponseDto, AuditEventResponseDto } from "@voyzu/audit/types";
import { getAuditActionColor } from "@voyzu/audit/client";
import { Badge, Breadcrumbs, DataTable, Input, type DataTableColumn } from "@voyzu/ui-components";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import styles from "./ice-cream-audit.module.css";

const PACKAGE_CODE = "@voyzu/ice-creams";
const PAGE_SIZE = 50;

const columns: DataTableColumn<AuditEventResponseDto>[] = [
  { key: "code", label: "Code", width: 130 },
  { key: "creationDate", label: "Timestamp", width: 190, render: (event) => new Date(event.creationDate).toLocaleString() },
  { key: "entityType", label: "Entity Type", width: 180 },
  { key: "entityCode", label: "Entity Code", render: (event) => event.entityCode ?? "-" },
  { key: "action", label: "Action", width: 100, render: (event) => <Badge variant="soft" size="x-small" color={getAuditActionColor(event.action)}>{event.action}</Badge> },
  { key: "actorCode", label: "User", render: (event) => event.actorDisplayName ?? event.actorCode ?? event.actorId ?? `(${event.actorType})` },
];

export function IceCreamAuditEventList({ initialFilters = {} }: { initialFilters?: Record<string, string> }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [items, setItems] = useState<AuditEventResponseDto[]>([]);
  const [totalMatching, setTotalMatching] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);
  const cursors = useRef<(string | null)[]>([null]);
  const backCode = initialFilters.from === "ice-cream" ? initialFilters.fromCode : undefined;

  const query = useMemo(() => {
    const params = new URLSearchParams({ packageCode: PACKAGE_CODE });
    if (search) params.set("search", search);
    for (const key of ["entityType", "entityCode", "entityId", "mutationId", "actorId", "dateFrom", "dateTo"] as const) {
      if (initialFilters[key]) params.set(key, initialFilters[key]);
    }
    if (cursor) params.set("cursor", cursor);
    return params.toString();
  }, [cursor, initialFilters, search]);

  const detailQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    for (const key of ["entityType", "entityCode", "entityId", "mutationId", "actorId", "dateFrom", "dateTo", "from", "fromCode"] as const) {
      if (initialFilters[key]) params.set(key, initialFilters[key]);
    }
    return params.toString();
  }, [initialFilters, search]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/audit?${query}`, { signal: controller.signal })
      .then(async (response) => response.ok ? await response.json() as AuditEventListResponseDto : null)
      .then((response) => {
        if (!response) return;
        setItems(response.items);
        setTotalMatching(response.totalMatching);
        cursors.current[page] = response.nextCursor;
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [page, query]);

  const changeSearch = (value: string) => {
    setSearch(value);
    cursors.current = [null];
    setPage(1);
    setCursor(null);
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    setCursor(cursors.current[nextPage - 1] ?? null);
  };

  return (
    <div className={styles.page}>
      <Breadcrumbs />
      <div className={layout.slotTitle}>
        <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>history</span></div>
        <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Ice Cream Audit Log</h1>
        <div className={layout.slotTitleByline}><p className={typography.headingByline}>Changes recorded by the Ice Creams package.</p></div>
        {backCode ? <DetailBackButton fallbackHref={`/ice-creams/${encodeURIComponent(backCode)}`} /> : null}
      </div>
      <div className={styles.toolbar}>
        <Input search value={search} placeholder="Search audit log..." onChange={(event) => changeSearch(event.target.value)} />
      </div>
      <DataTable
        columns={columns}
        rows={items}
        selectedIds={new Set<number>()}
        isAllSelected={false}
        isSomeSelected={false}
        onSelectAll={() => {}}
        onSelectOne={() => {}}
        onRowClick={(event) => router.push(`/ice-creams/audit/${event.id}${detailQuery ? `?${detailQuery}` : ""}`)}
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(totalMatching / PAGE_SIZE))}
        onPageChange={changePage}
        totalCount={totalMatching}
        filteredCount={totalMatching}
        itemLabel="audit events"
        loading={loading}
        loadingText="Loading audit events..."
        hasData={items.length > 0}
        emptyIcon="history"
        emptyFilterIcon="search_off"
        emptyTitle="No audit events"
        emptyText="Ice Cream changes will appear here."
        emptyFilterText="Try adjusting your search."
      />
    </div>
  );
}
