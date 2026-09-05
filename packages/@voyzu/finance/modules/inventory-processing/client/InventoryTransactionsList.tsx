"use client";

import type { FinanceInventoryActivity } from "@voyzu/finance/types/modules/inventory-processing";
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
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 100;
const label = (value: string | null) => value ? value.replaceAll("_", " ") : "-";
const date = (value: string) => new Date(value).toLocaleDateString();
const quantity = new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 });

const columns: DataTableColumn<FinanceInventoryActivity>[] = [
  { key: "inventoryDocumentCode", label: "Document", width: "13rem", render: (row) => <span className={listStyles.codeCell}>{row.inventoryDocumentCode}</span> },
  { key: "activityDate", label: "Date", width: "8rem", render: (row) => date(row.activityDate) },
  { key: "inventoryDocumentType", label: "Movement", width: "10rem", render: (row) => label(row.inventoryDocumentType) },
  { key: "reasonCode", label: "Reason", width: "13rem", render: (row) => label(row.reasonCode) },
  { key: "itemCode", label: "Item", width: "11rem", render: (row) => <span className={listStyles.codeCell}>{row.itemCode}</span> },
  { key: "itemName", label: "Item Name" },
  { key: "quantityChange", label: "Quantity", width: "8rem", align: "right", render: (row) => quantity.format(row.quantityChange) },
  { key: "processingStatus", label: "Status", width: "9rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={row.processingStatus === "PROCESSED" ? "success" : row.processingStatus === "ERROR" ? "danger" : "neutral"}>{label(row.processingStatus)}</Badge> },
];

export function InventoryTransactionsList({ activities, apiPath }: { activities: FinanceInventoryActivity[]; apiPath: string }) {
  const router = useRouter();
  const [rows, setRows] = useState(activities);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "inventoryDocumentType", label: "Movement", type: "checkbox", options: [...new Set(rows.map((row) => row.inventoryDocumentType))].sort() },
    { key: "processingStatus", label: "Status", type: "checkbox", options: ["RECEIVED", "PROCESSED", "ERROR"] },
  ], [rows]);
  const visible = useMemo(() => rows.filter((row) => {
    const movements = filters.inventoryDocumentType as string[] | undefined;
    const statuses = filters.processingStatus as string[] | undefined;
    const query = search.trim().toLowerCase();
    return (!movements?.length || movements.includes(row.inventoryDocumentType))
      && (!statuses?.length || statuses.includes(row.processingStatus))
      && (!query || [row.inventoryDocumentCode, row.itemCode, row.itemName, row.reasonCode ?? "", row.processingStatus]
        .some((value) => value.toLowerCase().includes(query)));
  }), [filters, rows, search]);
  const totalPages = Math.max(1, Math.ceil(visible.length / ITEMS_PER_PAGE));
  const page = visible.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const allSelected = page.length > 0 && page.every((row) => selectedIds.has(row.id));
  const selectedRows = rows.filter((row) => selectedIds.has(row.id));
  const removeFilter = (key: string) => setFilters((current) => {
    const next = { ...current };
    delete next[key];
    return next;
  });
  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await fetch(apiPath);
      if (response.ok) {
        setRows(await response.json() as FinanceInventoryActivity[]);
        setSelectedIds(new Set());
      }
    } finally {
      window.setTimeout(() => setRefreshing(false), 500);
    }
  };
  const exportRows = async (items: FinanceInventoryActivity[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "inventoryDocumentCode", label: "Document" },
          { key: "activityDate", label: "Activity Date" },
          { key: "inventoryDocumentType", label: "Movement" },
          { key: "reasonCode", label: "Reason" },
          { key: "itemCode", label: "Item Code" },
          { key: "itemName", label: "Item Name" },
          { key: "quantityChange", label: "Quantity" },
          { key: "processingStatus", label: "Status" },
        ],
        rows: items,
      }),
    });
    if (!response.ok) return;
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const exportItems: DropdownMenuItem[] = [
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void exportRows(selectedRows, "finance_inventory_transactions_selected"); } },
    { value: "current", label: `Current view (${visible.length})`, icon: "visibility", disabled: visible.length === 0, onSelect: () => { void exportRows(visible, "finance_inventory_transactions_current_view"); } },
    { value: "all", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void exportRows(rows, "finance_inventory_transactions"); } },
  ];
  const hasFilters = Object.values(filters).some((value) => Array.isArray(value) && value.length > 0);

  return (
    <div className={layout.listView}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>sync_alt</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Inventory Transactions</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Inventory financial activity received for Finance processing.</p></div>
        </div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={filters} onApply={(value) => { setFilters(value); setCurrentPage(1); }} onClear={() => setFilters({})} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search inventory transactions..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div>
        <div className={layout.slotToolbarRight}><div className={listStyles.toolbarActions}>
          <Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={() => { void refresh(); }} />
          <DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} />
        </div></div>
      </div>
      {(hasFilters || search.trim()) && <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={filters} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => setSearch("") }] : []} onClear={() => { setFilters({}); setSearch(""); }} onRemoveFilter={removeFilter} /></div></div>}
      <div className={layout.listBody}><div className={layout.slotBody}>
        <DataTable
          columns={columns}
          rows={page}
          selectedIds={selectedIds}
          isAllSelected={allSelected}
          isSomeSelected={!allSelected && page.some((row) => selectedIds.has(row.id))}
          onSelectAll={() => setSelectedIds((current) => allSelected ? new Set([...current].filter((id) => !page.some((row) => row.id === id))) : new Set([...current, ...page.map((row) => row.id)]))}
          onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })}
          onRowClick={(row) => router.push(`/finance/integration/inventory-processing/inventory-transactions/${row.id}`)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalCount={rows.length}
          filteredCount={visible.length}
          itemLabel="inventory transactions"
          hasData={rows.length > 0}
          emptyIcon="sync_alt"
          emptyTitle="No inventory transactions"
          emptyText="Inventory financial activity received by Finance will appear here"
          emptyFilterText="No inventory transactions match the current filters"
          mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.inventoryDocumentCode}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.itemName}</span></div><div className={listStyles.mobileMeta}>{label(row.inventoryDocumentType)} · {quantity.format(row.quantityChange)} · {label(row.processingStatus)}</div></div>}
        />
      </div></div>
    </div>
  );
}
