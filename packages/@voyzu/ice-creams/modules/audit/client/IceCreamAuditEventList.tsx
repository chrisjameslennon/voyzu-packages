"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuditActionColor } from "@voyzu/audit/client";
import type { AuditEventListResponseDto, AuditEventResponseDto } from "@voyzu/audit/types";
import {
  Badge,
  Breadcrumbs,
  Button,
  DataTable,
  DatePicker,
  DropdownMenu,
  Input,
  SearchableSelect,
  type DataTableColumn,
  type DropdownMenuItem,
} from "@voyzu/ui-components";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import styles from "./ice-cream-audit-list.module.css";

const PACKAGE_CODE = "@voyzu/ice-creams";
const PAGE_SIZE = 50;

const entityTypeOptions = [
  { value: "", label: "All types" },
  { value: "ice_cream", label: "Ice Cream" },
  { value: "ice_cream_flavor", label: "Ice Cream Flavour" },
];

const columns: DataTableColumn<AuditEventResponseDto>[] = [
  { key: "code", label: "Code", width: 130 },
  {
    key: "creationDate",
    label: "Timestamp",
    width: 190,
    render: (event) => new Date(event.creationDate).toLocaleString(),
  },
  { key: "entityType", label: "Entity Type", width: 180 },
  { key: "entityCode", label: "Entity Code", render: (event) => event.entityCode ?? "-" },
  { key: "entityId", label: "Entity ID", width: 120 },
  {
    key: "action",
    label: "Action",
    width: 100,
    render: (event) => (
      <Badge variant="soft" size="x-small" color={getAuditActionColor(event.action)}>
        {event.action}
      </Badge>
    ),
  },
  {
    key: "actorCode",
    label: "User",
    render: (event) => event.actorDisplayName ?? event.actorCode ?? event.actorId ?? `(${event.actorType})`,
  },
];

function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function presetRange(value: string): { dateFrom: string; dateTo: string } {
  const today = new Date();
  if (value === "month-to-date") {
    return { dateFrom: toIso(new Date(today.getFullYear(), today.getMonth(), 1)), dateTo: toIso(today) };
  }
  if (value === "previous-month") {
    return {
      dateFrom: toIso(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
      dateTo: toIso(new Date(today.getFullYear(), today.getMonth(), 0)),
    };
  }
  const fullMonths = value === "previous-2-full-months" ? 2 : value === "previous-3-full-months" ? 3 : value === "previous-6-full-months" ? 6 : 0;
  if (fullMonths) {
    return {
      dateFrom: toIso(new Date(today.getFullYear(), today.getMonth() - fullMonths, 1)),
      dateTo: toIso(new Date(today.getFullYear(), today.getMonth(), 0)),
    };
  }
  if (value === "previous-90-days") {
    return {
      dateFrom: toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90)),
      dateTo: toIso(today),
    };
  }
  return { dateFrom: "", dateTo: "" };
}

export function IceCreamAuditEventList({ initialFilters = {} }: { initialFilters?: Record<string, string> }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [entityType, setEntityType] = useState(initialFilters.entityType ?? "");
  const [entityCode, setEntityCode] = useState(initialFilters.entityCode ?? "");
  const [entityId, setEntityId] = useState(initialFilters.entityId ?? "");
  const [userCode, setUserCode] = useState(initialFilters.actorId ?? "");
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom ?? "");
  const [dateTo, setDateTo] = useState(initialFilters.dateTo ?? "");
  const [rangePreset, setRangePreset] = useState(dateFrom || dateTo ? "custom" : "all-dates");
  const [rangeLabel, setRangeLabel] = useState(dateFrom || dateTo ? "Custom" : "All dates");
  const [items, setItems] = useState<AuditEventResponseDto[]>([]);
  const [totalMatching, setTotalMatching] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);
  const cursors = useRef<(string | null)[]>([null]);
  const backCode = initialFilters.from === "ice-cream" ? initialFilters.fromCode : undefined;

  const resetPage = useCallback(() => {
    cursors.current = [null];
    setPage(1);
    setCursor(null);
  }, []);

  const query = useMemo(() => {
    const params = new URLSearchParams({ packageCode: PACKAGE_CODE });
    if (search) params.set("search", search);
    if (entityType) params.set("entityType", entityType);
    if (entityCode) params.set("entityCode", entityCode);
    if (entityId) params.set("entityId", entityId);
    if (userCode) params.set("actorId", userCode);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (initialFilters.mutationId) params.set("mutationId", initialFilters.mutationId);
    if (cursor) params.set("cursor", cursor);
    return params.toString();
  }, [cursor, dateFrom, dateTo, entityCode, entityId, entityType, initialFilters.mutationId, search, userCode]);

  const detailQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (entityType) params.set("entityType", entityType);
    if (entityCode) params.set("entityCode", entityCode);
    if (entityId) params.set("entityId", entityId);
    if (userCode) params.set("actorId", userCode);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    for (const key of ["mutationId", "from", "fromCode"] as const) {
      if (initialFilters[key]) params.set(key, initialFilters[key]);
    }
    return params.toString();
  }, [dateFrom, dateTo, entityCode, entityId, entityType, initialFilters, search, userCode]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    void (async () => {
      try {
        const fetchResponse = await fetch(`/api/audit?${query}`, { signal: controller.signal });
        if (!fetchResponse.ok) return;
        const response = await fetchResponse.json() as AuditEventListResponseDto;
        setItems(response.items);
        setTotalMatching(response.totalMatching);
        setSelectedIds(new Set());
        cursors.current[page] = response.nextCursor;
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Failed to load Ice Cream audit events", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    })();
    return () => controller.abort();
  }, [page, query, refreshKey]);

  const applyPreset = (value: string, label: string) => {
    const range = presetRange(value);
    setRangePreset(value);
    setRangeLabel(label);
    setDateFrom(range.dateFrom);
    setDateTo(range.dateTo);
    resetPage();
  };

  const setCustomDateFrom = (value: string) => {
    setDateFrom(value);
    setRangePreset("custom");
    setRangeLabel(value || dateTo ? "Custom" : "All dates");
    resetPage();
  };

  const setCustomDateTo = (value: string) => {
    setDateTo(value);
    setRangePreset("custom");
    setRangeLabel(dateFrom || value ? "Custom" : "All dates");
    resetPage();
  };

  const rangeItems: DropdownMenuItem[] = [
    { value: "all-dates", label: "All dates", onSelect: () => applyPreset("all-dates", "All dates") },
    { value: "month-to-date", label: "Month to date", onSelect: () => applyPreset("month-to-date", "Month to date") },
    { value: "previous-month", label: "Previous month", onSelect: () => applyPreset("previous-month", "Previous month") },
    { value: "previous-2-full-months", label: "Previous 2 full months", onSelect: () => applyPreset("previous-2-full-months", "Previous 2 full months") },
    { value: "previous-3-full-months", label: "Previous 3 full months", onSelect: () => applyPreset("previous-3-full-months", "Previous 3 full months") },
    { value: "previous-6-full-months", label: "Previous 6 full months", onSelect: () => applyPreset("previous-6-full-months", "Previous 6 full months") },
    { value: "previous-90-days", label: "Previous 90 days", onSelect: () => applyPreset("previous-90-days", "Previous 90 days") },
  ];

  const csvColumns = [
    { key: "code", label: "Code" },
    { key: "creationDate", label: "Timestamp" },
    { key: "entityType", label: "Entity Type" },
    { key: "entityCode", label: "Entity Code" },
    { key: "entityId", label: "Entity ID" },
    { key: "action", label: "Action" },
    { key: "actorType", label: "Actor Type" },
    { key: "actorDisplayName", label: "User" },
  ];

  const downloadCsv = async (rows: AuditEventResponseDto[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, columns: csvColumns, rows }),
    });
    if (!response.ok) return;
    const url = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${filename}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportAll = async () => {
    const exportQuery = new URLSearchParams(query);
    exportQuery.delete("cursor");
    const response = await fetch(`/api/audit/export?${exportQuery.toString()}`);
    if (!response.ok) return;
    await downloadCsv(await response.json() as AuditEventResponseDto[], "ice_cream_audit_full_dataset");
  };

  const exportItems = useMemo<DropdownMenuItem[]>(() => [
    {
      value: "selected",
      label: `Selected (${selectedIds.size})`,
      icon: "check_box",
      disabled: selectedIds.size === 0,
      onSelect: () => void downloadCsv(items.filter((event) => selectedIds.has(event.id)), "ice_cream_audit_selected"),
    },
    {
      value: "current-page",
      label: `Current page (${items.length})`,
      icon: "visibility",
      onSelect: () => void downloadCsv(items, "ice_cream_audit_current_page"),
    },
    {
      value: "full-dataset",
      label: `Full dataset (${totalMatching})`,
      icon: "database",
      onSelect: () => void exportAll(),
    },
  ], [items, selectedIds, totalMatching, query]);

  const clearAll = () => {
    setSearch("");
    setEntityType("");
    setEntityCode("");
    setEntityId("");
    setUserCode("");
    setDateFrom("");
    setDateTo("");
    setRangePreset("all-dates");
    setRangeLabel("All dates");
    resetPage();
  };

  const activeFilters = entityType || entityCode || entityId || userCode || dateFrom || dateTo || search;
  const isAllSelected = items.length > 0 && items.every((event) => selectedIds.has(event.id));
  const isSomeSelected = items.some((event) => selectedIds.has(event.id)) && !isAllSelected;

  return (
    <div className={styles.page}>
      <div className={styles.topRow}><Breadcrumbs /></div>
      <div className={styles.titleRow}>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>history</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Ice Cream Audit Log</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Changes recorded by the Ice Creams package.</p></div>
        </div>
        {backCode ? <div className={styles.titleActions}><DetailBackButton fallbackHref={`/ice-creams/${encodeURIComponent(backCode)}`} /></div> : null}
      </div>

      <div className={styles.scopeRow}>
        <div className={styles.dateRangeGroup}>
          <label className={styles.filterLabel}>Date Range</label>
          <div className={styles.dateRangeControls}>
            <DropdownMenu alignment="left" width={240} selectedValue={rangePreset} items={rangeItems} trigger={<Button variant="secondary" icon="date_range">{rangeLabel}</Button>} />
            <div className={styles.dateControl}><DatePicker value={dateFrom} onChange={setCustomDateFrom} placeholder="Any date" /></div>
            <span className={styles.dateSeparator}>-</span>
            <div className={styles.dateControl}><DatePicker value={dateTo} onChange={setCustomDateTo} placeholder="Any date" /></div>
          </div>
        </div>
      </div>

      <div className={styles.filterSearchRow}>
        <div className={styles.filterRow}>
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Entity Type</label>
            <div className={styles.filterSelect}><SearchableSelect value={entityType} onChange={(value) => { setEntityType(value); resetPage(); }} options={entityTypeOptions} placeholder="All types" searchable={false} /></div>
          </div>
          <div className={styles.filterField}><label className={styles.filterLabel}>Entity Code</label><Input containerClassName={styles.filterInput} placeholder="e.g. CLASSIC_VANILLA" value={entityCode} onChange={(event) => { setEntityCode(event.target.value); resetPage(); }} /></div>
          <div className={styles.filterField}><label className={styles.filterLabel}>Entity ID</label><Input containerClassName={styles.filterInput} placeholder="e.g. 10001" value={entityId} onChange={(event) => { setEntityId(event.target.value); resetPage(); }} /></div>
          <div className={styles.filterField}><label className={styles.filterLabel}>User</label><Input containerClassName={styles.filterInput} placeholder="User Code" value={userCode} onChange={(event) => { setUserCode(event.target.value); resetPage(); }} /></div>
        </div>
        <div className={styles.filterSeparator} />
        <Input search containerClassName={styles.searchWrap} value={search} placeholder="Search audit log..." onChange={(event) => { setSearch(event.target.value); resetPage(); }} />
      </div>

      <div className={styles.actionsRow}>
        <div>{activeFilters ? <button className={styles.clearAll} onClick={clearAll}>Clear all</button> : null}</div>
        <div className={styles.actionsRight}>
          <button className={styles.btnIcon} disabled={refreshing} title="Refresh" onClick={() => { setRefreshing(true); setRefreshKey((value) => value + 1); }}><span className={`material-symbols-outlined ${refreshing ? styles.spinning : ""}`}>sync</span></button>
          <div className={styles.toolbarDivider} />
          <DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        onSelectAll={() => setSelectedIds(isAllSelected ? new Set() : new Set(items.map((event) => event.id)))}
        onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })}
        onRowClick={(event) => router.push(`/ice-creams/audit/${event.id}${detailQuery ? `?${detailQuery}` : ""}`)}
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(totalMatching / PAGE_SIZE))}
        onPageChange={(nextPage) => { setPage(nextPage); setCursor(cursors.current[nextPage - 1] ?? null); }}
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
        emptyFilterText="Try adjusting your search or filters."
      />
    </div>
  );
}
