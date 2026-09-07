"use client";

import { useMemo, useState } from "react";
import { Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { AddSalesItemModal } from "./AddSalesItemModal";

interface SalesItem {
  id: string;
  code: string;
  name: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
}

const items: SalesItem[] = [
  { id: "COFFEE", code: "COFFEE", name: "Premium Coffee Beans", price: 32.5, status: "ACTIVE" },
  { id: "BOX", code: "BOX", name: "Gift Shipping Box", price: 4.5, status: "ACTIVE" },
  { id: "GIFT", code: "GIFT", name: "Coffee Gift Set", price: 65, status: "ACTIVE" },
  { id: "MUG", code: "MUG", name: "Ceramic Coffee Mug", price: 18, status: "ACTIVE" },
  { id: "FILTER", code: "FILTER", name: "Reusable Coffee Filter", price: 24.9, status: "INACTIVE" },
];
const priceFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const columns: DataTableColumn<SalesItem>[] = [
  { key: "code", label: "Code", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", width: "24rem", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  { key: "price", label: "Price", width: "10rem", align: "right", render: (row) => priceFormat.format(row.price) },
  { key: "status", label: "Status", width: "10rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge> },
];
const filterTabs: FilterTab[] = [{ key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] }];

export function SalesItemsList() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const statuses = filters.status as string[] | undefined;
    return items.filter((row) => (
      (!query || [row.code, row.name].some((value) => value.toLowerCase().includes(query)))
      && (!statuses?.length || statuses.includes(row.status))
    ));
  }, [search, filters]);
  const allSelected = visibleRows.length > 0 && visibleRows.every(({ id }) => selectedIds.has(id));
  const removeFilter = (key: string) => setFilters((current) => { const next = { ...current }; delete next[key]; return next; });

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>sell</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Sales Items</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Manage sales items, prices and availability.</p></div>
        </div>
        <div className={layout.slotActions}><Button variant="primary" icon="add" onClick={() => setShowAdd(true)}>Add Sales Item</Button></div>
      </header>
      {showAdd && <AddSalesItemModal onClose={() => setShowAdd(false)} />}
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={filters} onApply={setFilters} onClear={() => setFilters({})} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search placeholder="Search sales items..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="plain" icon="sync" title="Refresh" />
            <DropdownMenu
              trigger={<Button variant="plain" icon="file_download" title="Export" />}
              items={[
                { value: "selected", label: `Selected (${selectedIds.size})`, icon: "check_box", disabled: selectedIds.size === 0, onSelect: () => undefined },
                { value: "current-view", label: `Current view (${visibleRows.length})`, icon: "visibility", disabled: visibleRows.length === 0, onSelect: () => undefined },
                { value: "full-dataset", label: `Full dataset (${items.length})`, icon: "database", onSelect: () => undefined },
              ]}
              alignment="right"
              width={260}
            />
          </div>
        </div>
      </div>
      {(search.trim() || Object.values(filters).some((value) => Array.isArray(value) && value.length > 0)) && (
        <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={filters} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => setSearch("") }] : []} onClear={() => { setFilters({}); setSearch(""); }} onRemoveFilter={removeFilter} /></div></div>
      )}
      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          <DataTable<SalesItem, string>
            columns={columns}
            rows={visibleRows}
            selectedIds={selectedIds}
            isAllSelected={allSelected}
            isSomeSelected={!allSelected && visibleRows.some(({ id }) => selectedIds.has(id))}
            onSelectAll={() => setSelectedIds(allSelected ? new Set() : new Set(visibleRows.map(({ id }) => id)))}
            onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })}
            currentPage={1}
            totalPages={1}
            onPageChange={() => undefined}
            totalCount={items.length}
            filteredCount={visibleRows.length}
            itemLabel="sales items"
            hasData={items.length > 0}
            emptyIcon="sell"
            emptyTitle="No sales items found"
            emptyText="No sales items available"
            emptyFilterText="No sales items match your search or filters"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.name}</span></div><div className={listStyles.mobileMeta}>Price {priceFormat.format(row.price)}</div><Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge></div>}
          />
        </div>
      </div>
    </div>
  );
}
