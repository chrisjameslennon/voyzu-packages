"use client";

import { useMemo, useState } from "react";
import { Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  inventoryLinked: boolean;
  status: "ACTIVE" | "INACTIVE";
}

const items: Product[] = [
  { id: "COFFEE", code: "COFFEE", name: "Premium Coffee Beans", price: 32.5, inventoryLinked: true, status: "ACTIVE" },
  { id: "BOX", code: "BOX", name: "Gift Shipping Box", price: 4.5, inventoryLinked: true, status: "ACTIVE" },
  { id: "GIFT", code: "GIFT", name: "Coffee Gift Set", price: 65, inventoryLinked: true, status: "ACTIVE" },
  { id: "MUG", code: "MUG", name: "Ceramic Coffee Mug", price: 18, inventoryLinked: true, status: "ACTIVE" },
  { id: "FILTER", code: "FILTER", name: "Reusable Coffee Filter", price: 24.9, inventoryLinked: false, status: "INACTIVE" },
  { id: "TEA", code: "TEA", name: "Earl Grey Tea", price: 14.5, inventoryLinked: true, status: "ACTIVE" },
  { id: "BOTTLE", code: "BOTTLE", name: "Insulated Water Bottle", price: 39.9, inventoryLinked: true, status: "ACTIVE" },
  { id: "DELIVERY", code: "DELIVERY", name: "Local Delivery", price: 8, inventoryLinked: false, status: "ACTIVE" },
  { id: "TRAINING", code: "TRAINING", name: "Barista Training Session", price: 150, inventoryLinked: false, status: "ACTIVE" },
  { id: "APRON", code: "APRON", name: "Canvas Apron", price: 45, inventoryLinked: true, status: "INACTIVE" },
];
const priceFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const columns: DataTableColumn<Product>[] = [
  { key: "code", label: "Code", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", width: "24rem", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  { key: "price", label: "Price", width: "10rem", align: "right", render: (row) => priceFormat.format(row.price) },
  { key: "inventoryLinked", label: "Inventory Linked", width: "12rem", align: "center", render: (row) => row.inventoryLinked ? "Yes" : "No" },
  { key: "status", label: "Status", width: "10rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge> },
];
const filterTabs: FilterTab[] = [{ key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] }, { key: "inventoryLinked", label: "Inventory Linked", type: "checkbox", options: ["Yes", "No"] }];

export function ProductsList() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const statuses = filters.status as string[] | undefined;
    const inventoryFilter = filters.inventoryLinked as string[] | undefined;
    return items.filter((row) => (
      (!query || [row.code, row.name].some((value) => value.toLowerCase().includes(query)))
      && (!statuses?.length || statuses.includes(row.status))
      && (!inventoryFilter?.length || inventoryFilter.includes(row.inventoryLinked ? "Yes" : "No"))
    ));
  }, [search, filters]);
  const allSelected = visibleRows.length > 0 && visibleRows.every(({ id }) => selectedIds.has(id));
  const removeFilter = (key: string) => setFilters((current) => { const next = { ...current }; delete next[key]; return next; });

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>inventory_2</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Products</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Manage products, prices and availability.</p></div>
        </div>
        <div className={layout.slotActions}><Button variant="primary" icon="add">Add Product</Button></div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={filters} onApply={setFilters} onClear={() => setFilters({})} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
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
          <DataTable<Product, string>
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
            itemLabel="products"
            hasData={items.length > 0}
            emptyIcon="inventory_2"
            emptyTitle="No products found"
            emptyText="No products available"
            emptyFilterText="No products match your search or filters"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.name}</span></div><div className={listStyles.mobileMeta}>Price {priceFormat.format(row.price)}</div><div className={listStyles.mobileMeta}>Inventory Linked: {row.inventoryLinked ? "Yes" : "No"}</div><Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge></div>}
          />
        </div>
      </div>
    </div>
  );
}
