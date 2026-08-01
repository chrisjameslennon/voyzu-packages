"use client";

import { CompanyPageTitleBadges, getStatusSemanticColor } from "@voyzu/core/common/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { ArCounterpartyResponseDto } from "@voyzu/core/types/modules/ar-subledger";
import { Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type DropdownMenuItem, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const ITEMS_PER_PAGE = 100;
type ArCounterpartyRow = ArCounterpartyResponseDto & { id: number };

const columns: DataTableColumn<ArCounterpartyRow>[] = [
  { key: "code", label: "Code", width: "11rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", width: "18rem", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  { key: "countryName", label: "Country", width: "12rem", render: (row) => row.countryName ?? row.countryCode ?? "-" },
  { key: "taxRegionOrProvince", label: "Tax Region", width: "12rem", render: (row) => row.taxRegionOrProvince ?? "-" },
  { key: "status", label: "Status", width: "8rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge> },
];

export function ArCounterpartiesListContent({ counterparties }: { counterparties: ArCounterpartyResponseDto[] }) {
  const router = useRouter();
  const rows = counterparties as ArCounterpartyRow[];
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [counterparties]);

  const countries = useMemo(() => [...new Set(rows.map((row) => row.countryName ?? row.countryCode ?? "-"))].sort(), [rows]);
  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort(), [rows]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "country", label: "Country", type: "checkbox", options: countries },
    { key: "status", label: "Status", type: "checkbox", options: statuses },
  ], [countries, statuses]);
  const filtered = useMemo(() => {
    let result = rows;
    const query = search.trim().toLowerCase();
    if (query) result = result.filter((row) => row.code.toLowerCase().includes(query) || row.name.toLowerCase().includes(query) || (row.countryName ?? row.countryCode ?? "").toLowerCase().includes(query));
    const countryFilter = activeFilters.country as string[] | undefined;
    if (countryFilter?.length) result = result.filter((row) => countryFilter.includes(row.countryName ?? row.countryCode ?? "-"));
    const statusFilter = activeFilters.status as string[] | undefined;
    if (statusFilter?.length) result = result.filter((row) => statusFilter.includes(row.status));
    return result;
  }, [activeFilters, rows, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const isAllSelected = paginated.length > 0 && paginated.every((row) => selectedIds.has(row.id));
  const isSomeSelected = !isAllSelected && paginated.some((row) => selectedIds.has(row.id));
  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.has(row.id)), [rows, selectedIds]);
  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;
  const removeFilter = (key: string) => setActiveFilters((current) => { const next = { ...current }; delete next[key]; return next; });
  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => { router.refresh(); setRefreshing(false); }, 500);
  };
  const handleExport = async (exportRows: ArCounterpartyRow[], filename: string) => {
    const response = await fetch("/api/capability/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename, columns: [{ key: "code", label: "Code" }, { key: "name", label: "Name" }, { key: "countryName", label: "Country" }, { key: "taxRegionOrProvince", label: "Tax Region" }, { key: "status", label: "Status" }], rows: exportRows }) });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const exportItems = useMemo<DropdownMenuItem[]>(() => [
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "ar_counterparties_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "ar_counterparties_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "ar_counterparties_full_dataset"); } },
  ], [filtered, rows, selectedRows]);
  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={layout.slotTitle}><div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>groups</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>AR Counterparties</h1><div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div><div className={layout.slotTitleByline}><p className={typography.headingByline}>Supplier counterparties recognised by the accounts payable subledger.</p></div></div></header>
      <div className={layout.listToolbar}><div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div><div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search AR counterparties..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div><div className={layout.slotToolbarRight}><div className={listStyles.toolbarActions}><Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={refresh} /><DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} /></div></div></div>
      {(hasActiveFilters || hasSearch) && <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={activeFilters} additionalChips={hasSearch ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setCurrentPage(1); } }] : []} onClear={() => { setActiveFilters({}); setSearch(""); setCurrentPage(1); }} onRemoveFilter={removeFilter} /></div></div>}
      <div className={layout.listBody}><div className={layout.slotBody}><DataTable columns={columns} rows={paginated} selectedIds={selectedIds} isAllSelected={isAllSelected} isSomeSelected={isSomeSelected} onSelectAll={() => setSelectedIds((current) => isAllSelected ? new Set([...current].filter((id) => !paginated.some((row) => row.id === id))) : new Set([...current, ...paginated.map((row) => row.id)]))} onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })} onRowClick={(row) => router.push(`/finance/subledgers/ar/counterparties/${encodeURIComponent(row.code)}`)} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalCount={rows.length} filteredCount={filtered.length} itemLabel="counterparties" hasData={rows.length > 0} emptyIcon="groups" emptyTitle="No AR counterparties found" emptyText="No AR counterparties have been configured" emptyFilterText="No counterparties match your search" mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.name}</span></div><div className={listStyles.mobileMeta}>{row.countryName ?? row.countryCode ?? "-"}</div><Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge></div>} /></div></div>
    </div>
  );
}
