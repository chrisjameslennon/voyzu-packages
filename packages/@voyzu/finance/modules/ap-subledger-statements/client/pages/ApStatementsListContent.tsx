"use client";

import { CompanyPageTitleBadges } from "@voyzu/finance/common/client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { ApCounterpartySummaryResponseDto } from "@voyzu/finance/types/modules/ap-subledger";
import { Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type DropdownMenuItem, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./ap-statements-list.module.css";

const ITEMS_PER_PAGE = 100;
const BALANCE_FILTER_OPTIONS = ["No balance", "Has balance"];
const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value: number) => value === 0 ? "-" : moneyFormat.format(value);

type StatementRow = ApCounterpartySummaryResponseDto & { id: string };

const columns: DataTableColumn<StatementRow>[] = [
  { key: "counterpartyCode", label: "Code", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.counterpartyCode}</span> },
  { key: "counterpartyName", label: "Counterparty", width: "22rem", render: (row) => <span className={listStyles.nameCell}>{row.counterpartyName}</span> },
  { key: "openBillsAmount", label: "Open Bills", width: "10rem", align: "right", render: (row) => money(row.openBillsAmount) },
  { key: "unappliedPaymentsAmount", label: "Unapplied Payments", width: "12rem", align: "right", render: (row) => money(row.unappliedPaymentsAmount) },
  { key: "netBalance", label: "Net Balance", width: "10rem", align: "right", render: (row) => money(row.netBalance) },
];

export function ApStatementsListContent({ summaries }: { summaries: ApCounterpartySummaryResponseDto[] }) {
  const router = useRouter();
  const rows = useMemo<StatementRow[]>(() => summaries.map((summary) => ({ ...summary, id: summary.counterpartyCode })), [summaries]);
  const totalBalance = useMemo(() => rows.reduce((sum, row) => sum + row.netBalance, 0), [rows]);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [summaries]);

  const filterTabs = useMemo<FilterTab[]>(() => [{ key: "balance", label: "Balance", type: "checkbox", options: BALANCE_FILTER_OPTIONS }], []);
  const filtered = useMemo(() => {
    let result = rows;
    const query = search.trim().toLowerCase();
    if (query) result = result.filter((row) => row.counterpartyCode.toLowerCase().includes(query) || row.counterpartyName.toLowerCase().includes(query));
    const balances = activeFilters.balance as string[] | undefined;
    if (balances?.length === 1) {
      if (balances[0] === "No balance") result = result.filter((row) => row.netBalance === 0);
      if (balances[0] === "Has balance") result = result.filter((row) => row.netBalance !== 0);
    }
    return result;
  }, [activeFilters, rows, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.has(row.id)), [rows, selectedIds]);
  const isAllSelected = paginated.length > 0 && paginated.every((row) => selectedIds.has(row.id));
  const isSomeSelected = !isAllSelected && paginated.some((row) => selectedIds.has(row.id));
  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;
  const removeFilter = (key: string) => setActiveFilters((current) => { const next = { ...current }; delete next[key]; return next; });
  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => { router.refresh(); setRefreshing(false); }, 500);
  };
  const handleExport = async (exportRows: StatementRow[], filename: string) => {
    const response = await fetch("/api/capability/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename, columns: [{ key: "counterpartyCode", label: "Code" }, { key: "counterpartyName", label: "Counterparty" }, { key: "openBillsAmount", label: "Open Bills" }, { key: "unappliedPaymentsAmount", label: "Unapplied Payments" }, { key: "netBalance", label: "Net Balance" }], rows: exportRows }) });
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
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "ap_statements_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "ap_statements_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "ap_statements_full_dataset"); } },
  ], [filtered, rows, selectedRows]);

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={`${layout.slotTitle} ${localStyles.titleSlot}`}><div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>receipt_long</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Statements</h1><div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div><div className={layout.slotTitleByline}><p className={typography.headingByline}>Accounts payable statements by supplier counterparty.</p></div></div><div className={`${layout.slotSearch} ${localStyles.balancesSlot}`}><section className={localStyles.balancesCard} aria-label="Statement totals"><h2 className={localStyles.balancesTitle}>Totals</h2><div className={localStyles.totalRow}><span className={localStyles.balanceLabel}>Total Statements Balance</span><span className={localStyles.balanceValue}>{money(totalBalance)}</span></div></section></div></header>
      <div className={layout.listToolbar}><div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div><div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search statements..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div><div className={layout.slotToolbarRight}><div className={listStyles.toolbarActions}><Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={refresh} /><DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} /></div></div></div>
      {(hasActiveFilters || hasSearch) && <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={activeFilters} additionalChips={hasSearch ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setCurrentPage(1); } }] : []} onClear={() => { setActiveFilters({}); setSearch(""); setCurrentPage(1); }} onRemoveFilter={removeFilter} /></div></div>}
      <div className={layout.listBody}><div className={layout.slotBody}><DataTable<StatementRow, string> columns={columns} rows={paginated} selectedIds={selectedIds} isAllSelected={isAllSelected} isSomeSelected={isSomeSelected} onSelectAll={() => setSelectedIds((current) => isAllSelected ? new Set([...current].filter((id) => !paginated.some((row) => row.id === id))) : new Set([...current, ...paginated.map((row) => row.id)]))} onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })} onRowClick={(row) => router.push(`/finance/subledgers/ap/statements/${encodeURIComponent(row.counterpartyCode)}`)} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalCount={rows.length} filteredCount={filtered.length} itemLabel="statements" hasData={rows.length > 0} emptyIcon="summarize" emptyTitle="No statements found" emptyText="No AP counterparties have statement activity" emptyFilterText="No statements match your search" mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.counterpartyCode}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.counterpartyName}</span></div><div className={listStyles.mobileMeta}>Net {money(row.netBalance)}</div></div>} /></div></div>
    </div>
  );
}
