"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Breadcrumbs,
  Button,
  DataTable,
  FilterChips,
  FilterPanel,
  Input,
  type DataTableColumn,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import type { ItemListRow } from "../types/item-list.types";

const currency = new Intl.NumberFormat("en-NZ", {
  style: "currency",
  currency: "NZD",
});

const columns: DataTableColumn<ItemListRow>[] = [
  {
    key: "sku",
    label: "SKU",
    width: "12rem",
    render: (row) => <span className={listStyles.codeCell}>{row.sku}</span>,
  },
  {
    key: "name",
    label: "Item Name",
    width: "18rem",
    render: (row) => <span className={listStyles.nameCell}>{row.name}</span>,
  },
  { key: "category", label: "Category", width: "16rem", render: (row) => row.category ?? "—" },
  { key: "itemType", label: "Type", width: "10rem", render: (row) => row.itemType === "ASSEMBLY" ? "Assembly" : "Item" },
  { key: "unit", label: "Unit", width: "7rem" },
  { key: "quantityTracked", label: "Quantity Tracked", width: "11rem", align: "center", render: (row) => row.quantityTracked ? "Yes" : "No" },
  { key: "cost", label: "Cost", width: "9rem", align: "right", render: (row) => row.cost === null ? "—" : currency.format(row.cost) },
  {
    key: "status",
    label: "Status",
    width: "8rem",
    align: "center",
    render: (row) => (
      <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>
        {row.status}
      </Badge>
    ),
  },
];

export function ItemsList({ items }: { items: ItemListRow[] }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "category", label: "Category", type: "checkbox", options: [...new Set(items.map((item) => item.category).filter((value): value is string => value !== null))].sort() },
    { key: "itemType", label: "Type", type: "checkbox", options: ["Item", "Assembly"] },
    { key: "unit", label: "Unit", type: "checkbox", options: [...new Set(items.map((item) => item.unit))].sort() },
    { key: "quantityTracked", label: "Quantity Tracked", type: "checkbox", options: ["Yes", "No"] },
    { key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] },
  ], [items]);

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const categories = filters.category as string[] | undefined;
    const itemTypes = filters.itemType as string[] | undefined;
    const units = filters.unit as string[] | undefined;
    const quantityTracked = filters.quantityTracked as string[] | undefined;
    const statuses = filters.status as string[] | undefined;

    return items.filter((item) => {
      const displayType = item.itemType === "ASSEMBLY" ? "Assembly" : "Item";
      const displayQuantityTracked = item.quantityTracked ? "Yes" : "No";
      return (
        (!query || [item.sku, item.name, item.category ?? "", displayType, item.unit].some((value) => value.toLowerCase().includes(query)))
        && (!categories?.length || (item.category !== null && categories.includes(item.category)))
        && (!itemTypes?.length || itemTypes.includes(displayType))
        && (!units?.length || units.includes(item.unit))
        && (!quantityTracked?.length || quantityTracked.includes(displayQuantityTracked))
        && (!statuses?.length || statuses.includes(item.status))
      );
    });
  }, [filters, items, search]);

  const allSelected = visibleRows.length > 0 && visibleRows.every(({ id }) => selectedIds.has(id));
  const hasFilters = search.trim().length > 0 || Object.keys(filters).length > 0;
  const removeFilter = (key: string) => setFilters((current) => {
    const next = { ...current };
    delete next[key];
    return next;
  });

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>deployed_code</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Items</h1>
          <div className={layout.slotTitleByline}>
            <p className={typography.headingByline}>Physical inventory items that can be stocked, purchased, consumed, sold, or used as components.</p>
          </div>
        </div>
        <div className={layout.slotActions}>
          <Button variant="primary" icon="add" className={layout.slotPrimaryAction}>Add Item</Button>
        </div>
      </header>

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}>
          <FilterPanel
            tabs={filterTabs}
            filters={filters}
            onApply={setFilters}
            onClear={() => setFilters({})}
            onRemoveFilter={removeFilter}
            showChips={false}
          />
        </div>
        <div className={layout.slotToolbarSearch}>
          <Input
            search
            containerClassName={layout.slotSearchControl}
            placeholder="Search items..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary" icon="check_circle" disabled>Activate</Button>
            <Button variant="secondary" icon="block" disabled>Deactivate</Button>
            <Button variant="secondary-destructive" icon="delete" disabled title="Delete selected" />
            <Button variant="secondary" icon="category" disabled>Change Category</Button>
          </div>
        </div>
      </div>

      {hasFilters ? (
        <div className={layout.chipsRow}>
          <div className={layout.slotChips}>
            <FilterChips
              tabs={filterTabs}
              filters={filters}
              additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => setSearch("") }] : []}
              onClear={() => { setFilters({}); setSearch(""); }}
              onRemoveFilter={removeFilter}
            />
          </div>
        </div>
      ) : null}

      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          <DataTable
            columns={columns}
            rows={visibleRows}
            selectedIds={selectedIds}
            isAllSelected={allSelected}
            isSomeSelected={!allSelected && visibleRows.some(({ id }) => selectedIds.has(id))}
            onSelectAll={() => setSelectedIds(allSelected ? new Set() : new Set(visibleRows.map(({ id }) => id)))}
            onSelectOne={(id) => setSelectedIds((current) => {
              const next = new Set(current);
              next.has(id) ? next.delete(id) : next.add(id);
              return next;
            })}
            currentPage={1}
            totalPages={1}
            onPageChange={() => undefined}
            totalCount={items.length}
            filteredCount={visibleRows.length}
            itemLabel="items"
            hasData={items.length > 0}
            emptyIcon="deployed_code"
            emptyTitle="No items"
            emptyText="Add the first inventory item"
            emptyFilterText="No items match the current filters"
            mobileRender={(row) => (
              <div>
                <strong>{row.name}</strong>
                <div>{row.sku} · {row.category ?? "Uncategorised"} · {row.status}</div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
