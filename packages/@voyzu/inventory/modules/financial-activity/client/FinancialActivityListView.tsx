"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumbs,
  Badge,
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
import { InventoryListActions } from "../../../client/InventoryListActions";
import inventoryListStyles from "../../../client/inventory-list-actions.module.css";
import type { FinancialActivitySummary } from "../types/financial-activity.types";

const date = (value: string) => new Date(value).toLocaleDateString("en-NZ");
const label = (value: string) => value.replaceAll("_", " ");

export function FinancialActivityListView({ rows }: { rows: FinancialActivitySummary[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const movementTypes = filters.movementType as string[] | undefined;
  const visible = rows.filter((row) =>
    (!movementTypes?.length || movementTypes.includes(row.movementType)) &&
    (!(filters.status as string[] | undefined)?.length || (filters.status as string[]).includes(row.status)) &&
    (!search.trim() || [row.transactionCode, row.itemCode, row.itemName, row.warehouseName, row.reasonCode, row.status]
      .some((value) => value.toLowerCase().includes(search.trim().toLowerCase()))),
  );
  const filterTabs: FilterTab[] = [
    { key: "movementType", label: "Movement Type", type: "checkbox", options: [...new Set(rows.map((row) => row.movementType))].sort() },
    { key: "status", label: "Status", type: "checkbox", options: ["AVAILABLE", "PROCESSED"] },
  ];
  const removeFilter = (key: string) => setFilters((current) => {
    const next = { ...current };
    delete next[key];
    return next;
  });
  const columns: DataTableColumn<FinancialActivitySummary>[] = [
    { key: "transactionCode", label: "Code", width: "14%" },
    { key: "transactionDate", label: "Date", width: "10%", render: (row) => date(row.transactionDate) },
    { key: "movementType", label: "Movement", width: "11%", render: (row) => label(row.movementType) },
    { key: "reasonCode", label: "Reason", width: "15%", render: (row) => label(row.reasonCode) },
    { key: "itemCode", label: "Item", width: "12%" },
    { key: "warehouseName", label: "Warehouse", width: "15%" },
    { key: "quantityChange", label: "Quantity", width: "10%", align: "right" },
    { key: "status", label: "Status", width: "9rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "PROCESSED" ? "success" : "neutral"}>{label(row.status)}</Badge> },
  ];
  const allSelected = visible.length > 0 && visible.every(({ id }) => selectedIds.has(id));

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_balance</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Financial Activity</h1>
          <div className={layout.slotTitleByline}>
            <p className={typography.headingByline}>Read-only inventory movements with financial significance for integration by other packages.</p>
          </div>
        </div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}>
          <FilterPanel tabs={filterTabs} filters={filters} onApply={setFilters} onClear={() => setFilters({})} onRemoveFilter={removeFilter} showChips={false} />
        </div>
        <div className={layout.slotToolbarSearch}>
          <Input search containerClassName={layout.slotSearchControl} placeholder="Search financial activity..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className={`${layout.slotToolbarRight} ${inventoryListStyles.toolbarLayer}`}>
          <div className={listStyles.toolbarActions}>
            <InventoryListActions
              rows={rows}
              visibleRows={visible}
              selectedIds={selectedIds}
              filename="inventory_financial_activity"
              columns={[
                { key: "transactionCode", label: "Code" }, { key: "transactionDate", label: "Date" },
                { key: "movementType", label: "Movement" }, { key: "reasonCode", label: "Reason" },
                { key: "itemCode", label: "Item Code" }, { key: "itemName", label: "Item Name" },
                { key: "warehouseName", label: "Warehouse" }, { key: "quantityChange", label: "Quantity Change" }, { key: "status", label: "Status" },
              ]}
              toExportRow={(row) => ({ ...row, transactionDate: date(row.transactionDate) })}
            />
          </div>
        </div>
      </div>
      {search.trim() || Object.keys(filters).length ? (
        <div className={layout.chipsRow}><div className={layout.slotChips}>
          <FilterChips
            tabs={filterTabs}
            filters={filters}
            additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => setSearch("") }] : []}
            onClear={() => { setFilters({}); setSearch(""); }}
            onRemoveFilter={removeFilter}
          />
        </div></div>
      ) : null}
      <div className={layout.listBody}><div className={layout.slotBody}>
        <DataTable
          columns={columns}
          rows={visible}
          selectedIds={selectedIds}
          isAllSelected={allSelected}
          isSomeSelected={!allSelected && visible.some(({ id }) => selectedIds.has(id))}
          onSelectAll={() => setSelectedIds(allSelected ? new Set() : new Set(visible.map(({ id }) => id)))}
          onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })}
          onRowClick={(row) => router.push(`/inventory/financial-activity/${row.id}`)}
          currentPage={1}
          totalPages={1}
          onPageChange={() => undefined}
          totalCount={rows.length}
          filteredCount={visible.length}
          itemLabel="financial activity records"
          hasData={rows.length > 0}
          emptyIcon="account_balance"
          emptyTitle="No financial activity"
          emptyText="Receipts, issues, and adjustments will appear here"
          emptyFilterText="No financial activity matches the current filters"
          mobileRender={(row) => <div><strong>{row.transactionCode}</strong><div>{row.itemCode} · {row.itemName}</div><div>{label(row.movementType)} · {row.quantityChange} · {row.warehouseName} · {label(row.status)}</div></div>}
        />
      </div></div>
    </div>
  );
}
