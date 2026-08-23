"use client";

import { CompanyPageTitleBadges, getDrCrColor, getStatusSemanticColor } from "@voyzu/finance/common/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { ApSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/ap-subledger";
import { Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type DropdownMenuItem, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./ap-subledger-list.module.css";

const ITEMS_PER_PAGE = 100;
type ApEntryRow = ApSubledgerEntryResponseDto & { id: number };
const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value: number | null | undefined) => value == null ? "-" : moneyFormat.format(value);
const balanceMoney = (value: number) => {
  const formatted = moneyFormat.format(Math.abs(value));
  return value < 0 ? `(${formatted})` : formatted;
};

const AP_CONTROL_ACCOUNT_BALANCES = [
  { controlAccountCode: "AP_TRADE_PAYABLES", controlAccountName: "Trade Payables", glAccountCode: "200000", glAccountName: "Accounts Payable - Trade", balance: 0 },
  { controlAccountCode: "AP_UNAPPLIED_PAYMENTS", controlAccountName: "Supplier Payments Awaiting Allocation", glAccountCode: "201000", glAccountName: "Accounts Payable - Unapplied Payments / Credits", balance: 0 },
];

const columns: DataTableColumn<ApEntryRow>[] = [
  { key: "code", label: "Entry #", width: "10rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "postingDate", label: "Date", width: "7.5rem" },
  { key: "documentTypeLabel", label: "Document", width: "11rem" },
  { key: "documentId", label: "Document ID", width: "11rem" },
  { key: "counterpartyName", label: "Counterparty", width: "14rem", render: (row) => <span className={listStyles.nameCell}>{row.counterpartyName}</span> },
  { key: "entryType", label: "DR / CR", width: "5.5rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={getDrCrColor(row.entryType)}>{row.entryType}</Badge> },
  { key: "baseCurrencyAmount", label: "Amount", width: "8rem", align: "right", render: (row) => money(row.baseCurrencyAmount) },
  { key: "openBalance", label: "Open", width: "7rem", align: "right", render: (row) => money(row.openBalance) },
  { key: "paymentStatus", label: "Payment", width: "7rem", render: (row) => row.paymentStatus ?? "-" },
  { key: "status", label: "Status", width: "6.5rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge> },
];

export function ApLedgerEntriesListContent({ entries }: { entries: ApSubledgerEntryResponseDto[] }) {
  const router = useRouter();
  const rows = entries as ApEntryRow[];
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [entries]);

  const documentTypes = useMemo(() => [...new Set(rows.map((row) => row.documentTypeLabel))].sort(), [rows]);
  const entryTypes = useMemo(() => [...new Set(rows.map((row) => row.entryType))].sort(), [rows]);
  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort(), [rows]);
  const balances = useMemo(() => {
    const map = new Map<string, typeof AP_CONTROL_ACCOUNT_BALANCES[number]>();
    for (const row of rows) {
      for (const movement of row.controlAccountBalances ?? []) {
        const existing = map.get(movement.controlAccountCode);
        if (existing) existing.balance += movement.balance;
        else map.set(movement.controlAccountCode, { ...movement });
      }
    }
    return AP_CONTROL_ACCOUNT_BALANCES.map((defaultBalance) => map.get(defaultBalance.controlAccountCode) ?? defaultBalance);
  }, [rows]);
  const totalBalance = useMemo(() => balances.reduce((sum, balance) => sum + balance.balance, 0), [balances]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "documentTypeLabel", label: "Document", type: "checkbox", options: documentTypes },
    { key: "entryType", label: "DR / CR", type: "checkbox", options: entryTypes },
    { key: "status", label: "Status", type: "checkbox", options: statuses },
  ], [documentTypes, entryTypes, statuses]);
  const filtered = useMemo(() => {
    let result = rows;
    const query = search.trim().toLowerCase();
    if (query) result = result.filter((row) => row.code.toLowerCase().includes(query) || row.documentId.toLowerCase().includes(query) || row.documentTypeLabel.toLowerCase().includes(query) || row.counterpartyCode.toLowerCase().includes(query) || row.counterpartyName.toLowerCase().includes(query) || row.description.toLowerCase().includes(query));
    const documentFilter = activeFilters.documentTypeLabel as string[] | undefined;
    if (documentFilter?.length) result = result.filter((row) => documentFilter.includes(row.documentTypeLabel));
    const entryFilter = activeFilters.entryType as string[] | undefined;
    if (entryFilter?.length) result = result.filter((row) => entryFilter.includes(row.entryType));
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
  const handleExport = async (exportRows: ApEntryRow[], filename: string) => {
    const response = await fetch("/api/capability/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename, columns: [{ key: "code", label: "Entry #" }, { key: "postingDate", label: "Date" }, { key: "documentTypeLabel", label: "Document" }, { key: "documentId", label: "Document ID" }, { key: "counterpartyCode", label: "Counterparty Code" }, { key: "counterpartyName", label: "Counterparty" }, { key: "entryType", label: "DR / CR" }, { key: "baseCurrencyAmount", label: "Amount" }, { key: "openBalance", label: "Open Balance" }, { key: "status", label: "Status" }], rows: exportRows }) });
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
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "ap_ledger_entries_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "ap_ledger_entries_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "ap_ledger_entries_full_dataset"); } },
  ], [filtered, rows, selectedRows]);
  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={`${layout.slotTitle} ${localStyles.titleSlot}`}><div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>receipt_long</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>AP Ledger Entries</h1><div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div><div className={layout.slotTitleByline}><p className={typography.headingByline}>Accounts payable subledger entries recorded from supplier documents and payments.</p></div></div><div className={`${layout.slotSearch} ${localStyles.balancesSlot}`}><section className={localStyles.balancesCard} aria-label="Control account balances"><h2 className={localStyles.balancesTitle}>Control Account Balances</h2><div className={localStyles.balanceRows}>{balances.map((balance) => <div key={balance.controlAccountCode} className={localStyles.balanceRow}><span className={localStyles.balanceLabel}>{balance.glAccountName}</span><span className={localStyles.codeChip}>{balance.glAccountCode}</span><span className={localStyles.balanceValue}>{balanceMoney(balance.balance)}</span></div>)}<div className={`${localStyles.totalRow} ${localStyles.balanceTotalRow}`}><span className={localStyles.balanceLabel}>Total</span><span className={localStyles.balanceValue}>{balanceMoney(totalBalance)}</span></div></div></section></div></header>
      <div className={layout.listToolbar}><div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div><div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search AP entries..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div><div className={layout.slotToolbarRight}><div className={listStyles.toolbarActions}><Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={refresh} /><DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} /></div></div></div>
      {(hasActiveFilters || hasSearch) && <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={activeFilters} additionalChips={hasSearch ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setCurrentPage(1); } }] : []} onClear={() => { setActiveFilters({}); setSearch(""); setCurrentPage(1); }} onRemoveFilter={removeFilter} /></div></div>}
      <div className={layout.listBody}><div className={layout.slotBody}><DataTable columns={columns} rows={paginated} selectedIds={selectedIds} isAllSelected={isAllSelected} isSomeSelected={isSomeSelected} onSelectAll={() => setSelectedIds((current) => isAllSelected ? new Set([...current].filter((id) => !paginated.some((row) => row.id === id))) : new Set([...current, ...paginated.map((row) => row.id)]))} onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })} onRowClick={(row) => router.push(`/finance/subledgers/ap/ledger-entries/${encodeURIComponent(row.code)}`)} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalCount={rows.length} filteredCount={filtered.length} itemLabel="entries" hasData={rows.length > 0} emptyIcon="receipt_long" emptyTitle="No AP ledger entries found" emptyText="No AP ledger entries have been posted" emptyFilterText="No entries match your search" mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.counterpartyName}</span></div><div className={listStyles.mobileMeta}>{row.documentId} - {money(row.baseCurrencyAmount)}</div><Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge></div>} /></div></div>
    </div>
  );
}
