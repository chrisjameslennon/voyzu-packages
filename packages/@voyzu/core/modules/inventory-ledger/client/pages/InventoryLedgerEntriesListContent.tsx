"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { CompanyPageTitleBadges, getStatusSemanticColor } from "@voyzu/core/common/client";
import type { InventoryLedgerControlAccountBalanceDto, InventoryLedgerEntryResponseDto } from "@voyzu/core/types/modules/inventory-ledger";
import {
  Badge,
  Breadcrumbs,
  Button,
  DataTable,
  DropdownMenu,
  FilterChips,
  FilterPanel,
  Input,
  type DataTableColumn,
  type DropdownMenuItem,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./inventory-ledger-list.module.css";

const ITEMS_PER_PAGE = 100;

type InventoryLedgerRow = InventoryLedgerEntryResponseDto & { id: number };

const quantityFormat = new Intl.NumberFormat("en-NZ", { maximumFractionDigits: 2 });
const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatNumber(value: number | null | undefined) {
  return value == null ? "-" : quantityFormat.format(value);
}

function formatMoney(value: number | null | undefined) {
  return value == null ? "-" : moneyFormat.format(value);
}

function balanceMoney(value: number) {
  if (value === 0) return "-";
  const formatted = Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value < 0 ? `(${formatted})` : formatted;
}

const columns: DataTableColumn<InventoryLedgerRow>[] = [
  { key: "code", label: "Entry #", width: "10rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "postingDate", label: "Date", width: "8rem" },
  { key: "sourceDocument", label: "Document", width: "10rem" },
  { key: "documentId", label: "Document ID", width: "11rem" },
  { key: "itemCode", label: "Item", width: "10rem", render: (row) => <span className={listStyles.codeCell}>{row.itemCode}</span> },
  { key: "movement", label: "Movement", width: "10rem" },
  { key: "qtyDelta", label: "Qty", width: "7rem", align: "right", render: (row) => formatNumber(row.qtyDelta) },
  { key: "bookValueDelta", label: "Book Value", width: "9rem", align: "right", render: (row) => formatMoney(row.bookValueDelta) },
  {
    key: "status",
    label: "Status",
    width: "7rem",
    align: "center",
    render: (row) => <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge>,
  },
];

export function InventoryLedgerEntriesListContent({ entries }: { entries: InventoryLedgerEntryResponseDto[] }) {
  const router = useRouter();
  const rows = entries as InventoryLedgerRow[];
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [entries]);

  const movements = useMemo(() => [...new Set(rows.map((row) => row.movement))].sort(), [rows]);
  const documents = useMemo(() => [...new Set(rows.map((row) => row.sourceDocument))].sort(), [rows]);
  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort(), [rows]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "movement", label: "Movement", type: "checkbox", options: movements },
    { key: "sourceDocument", label: "Document", type: "checkbox", options: documents },
    { key: "status", label: "Status", type: "checkbox", options: statuses },
  ], [documents, movements, statuses]);

  const balances = useMemo<InventoryLedgerControlAccountBalanceDto[]>(() => {
    const map = new Map<string, InventoryLedgerControlAccountBalanceDto>();
    for (const row of rows) {
      for (const balance of row.controlAccountBalances ?? []) {
        map.set(balance.controlAccountCode, balance);
      }
    }
    if (map.size > 0) return [...map.values()];

    const latestByItem = new Map<string, InventoryLedgerRow>();
    for (const entry of rows) {
      const existing = latestByItem.get(entry.itemCode);
      if (!existing || entry.postingDate > existing.postingDate || (entry.postingDate === existing.postingDate && entry.code > existing.code)) {
        latestByItem.set(entry.itemCode, entry);
      }
    }
    const balance = [...latestByItem.values()].reduce((sum, entry) => sum + entry.bookValueBalance, 0);
    const first = rows[0];
    return [
      {
        controlAccountCode: first?.controlAccountCode ?? "INVENTORY_CONTROL",
        controlAccountName: first?.controlAccountName ?? "Inventory Control",
        glAccountCode: first?.glAccountCode ?? "130000",
        glAccountName: first?.glAccountName ?? "Inventory Control",
        balance,
      },
    ];
  }, [rows]);

  const totalBalance = useMemo(() => balances.reduce((sum, balance) => sum + balance.balance, 0), [balances]);

  const filtered = useMemo(() => {
    let result = rows;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((row) =>
        row.code.toLowerCase().includes(query) ||
        row.journalCode.toLowerCase().includes(query) ||
        row.sourceDocument.toLowerCase().includes(query) ||
        row.documentId.toLowerCase().includes(query) ||
        row.itemCode.toLowerCase().includes(query) ||
        row.itemName.toLowerCase().includes(query) ||
        row.movement.toLowerCase().includes(query),
      );
    }
    const movementFilter = activeFilters.movement as string[] | undefined;
    if (movementFilter?.length) result = result.filter((row) => movementFilter.includes(row.movement));
    const documentFilter = activeFilters.sourceDocument as string[] | undefined;
    if (documentFilter?.length) result = result.filter((row) => documentFilter.includes(row.sourceDocument));
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

  const removeFilter = (key: string) => {
    setActiveFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      router.refresh();
      setRefreshing(false);
    }, 500);
  };

  const handleExport = async (exportRows: InventoryLedgerRow[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "code", label: "Entry #" },
          { key: "postingDate", label: "Date" },
          { key: "journalCode", label: "Journal" },
          { key: "sourceDocument", label: "Document" },
          { key: "documentId", label: "Document ID" },
          { key: "itemCode", label: "Item Code" },
          { key: "itemName", label: "Item Name" },
          { key: "movement", label: "Movement" },
          { key: "qtyDelta", label: "Qty Delta" },
          { key: "bookValueDelta", label: "Book Value Delta" },
          { key: "status", label: "Status" },
        ],
        rows: exportRows,
      }),
    });
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
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "inventory_ledger_entries_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "inventory_ledger_entries_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "inventory_ledger_entries_full_dataset"); } },
  ], [filtered, rows, selectedRows]);

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={`${layout.slotTitle} ${localStyles.titleSlot}`}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>receipt_long</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Inventory Ledger Entries</h1>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Inventory ledger entries show posted inventory quantity and book value movements.</p></div>
        </div>
        <div className={`${layout.slotSearch} ${localStyles.balancesSlot}`}>
          <section className={localStyles.balancesCard} aria-label="Control account balances">
            <h2 className={localStyles.balancesTitle}>Control Account Balances</h2>
            <div className={localStyles.balanceRows}>
              {balances.map((balance) => (
                <div key={balance.controlAccountCode} className={localStyles.balanceRow}>
                  <span className={localStyles.balanceLabel}>{balance.glAccountName}</span>
                  <span className={localStyles.codeChip}>{balance.glAccountCode}</span>
                  <span className={localStyles.balanceValue}>{balanceMoney(balance.balance)}</span>
                </div>
              ))}
              <div className={`${localStyles.totalRow} ${localStyles.balanceTotalRow}`}>
                <span className={localStyles.balanceLabel}>Total</span>
                <span className={localStyles.balanceValue}>{balanceMoney(totalBalance)}</span>
              </div>
            </div>
          </section>
        </div>
      </header>

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search inventory ledger..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={refresh} />
            <DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} />
          </div>
        </div>
      </div>

      {(hasActiveFilters || hasSearch) && (
        <div className={layout.chipsRow}>
          <div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={activeFilters} additionalChips={hasSearch ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setCurrentPage(1); } }] : []} onClear={() => { setActiveFilters({}); setSearch(""); setCurrentPage(1); }} onRemoveFilter={removeFilter} /></div>
        </div>
      )}

      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          <DataTable
            columns={columns}
            rows={paginated}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={() => setSelectedIds((current) => isAllSelected ? new Set([...current].filter((id) => !paginated.some((row) => row.id === id))) : new Set([...current, ...paginated.map((row) => row.id)]))}
            onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })}
            onRowClick={(row) => router.push(`/finance/inventory/ledger/${encodeURIComponent(row.code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={rows.length}
            filteredCount={filtered.length}
            itemLabel="entries"
            hasData={rows.length > 0}
            emptyIcon="inventory_2"
            emptyTitle="No inventory ledger entries found"
            emptyText="No inventory ledger entries have been posted"
            emptyFilterText="No entries match your search"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.itemName}</span></div><div className={listStyles.mobileMeta}>{row.itemCode} - {formatNumber(row.qtyDelta)} - {formatMoney(row.bookValueDelta)}</div><Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge></div>}
          />
        </div>
      </div>
    </div>
  );
}
