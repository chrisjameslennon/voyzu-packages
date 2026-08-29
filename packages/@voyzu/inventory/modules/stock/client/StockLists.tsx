"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Breadcrumbs,
  Button,
  ConfirmDialog,
  DataTable,
  FilterChips,
  FilterPanel,
  Input,
  Toast,
  ValidationAlert,
  type DataTableColumn,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  StockActivity,
  StockCountRow,
  StockPosition,
} from "../types/stock.types";
const date = (value: string) => new Date(value).toLocaleDateString("en-NZ");
function Shell({
  title,
  description,
  icon,
  primaryAction,
  toolbarLeft,
  toolbarRight,
  chips,
  search,
  setSearch,
  children,
  error,
  onDismissError,
}: {
  title: string;
  description: string;
  icon: string;
  primaryAction?: React.ReactNode;
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  chips?: React.ReactNode;
  search: string;
  setSearch: (x: string) => void;
  children: React.ReactNode;
  error?: string;
  onDismissError?: () => void;
}) {
  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span
              className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}
            >
              {icon}
            </span>
          </div>
          <h1
            className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
          >
            {title}
          </h1>
          <div className={layout.slotTitleByline}>
            <p className={typography.headingByline}>{description}</p>
          </div>
        </div>
        {primaryAction ? (
          <div className={layout.slotActions}>{primaryAction}</div>
        ) : null}
        <div className={layout.slotAlert}>
          <ValidationAlert
            errors={error ? [error] : []}
            visible={!!error}
            onDismiss={onDismissError ?? (() => undefined)}
          />
        </div>
      </header>
      <div className={layout.listToolbar}>
        {toolbarLeft ? (
          <div className={layout.slotToolbarLeft}>{toolbarLeft}</div>
        ) : null}
        <div className={layout.slotToolbarSearch}>
          <Input
            search
            containerClassName={layout.slotSearchControl}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </div>
        {toolbarRight ? (
          <div className={layout.slotToolbarRight}>{toolbarRight}</div>
        ) : null}
      </div>
      {chips ? (
        <div className={layout.chipsRow}>
          <div className={layout.slotChips}>{chips}</div>
        </div>
      ) : null}
      <div className={layout.listBody}>
        <div className={layout.slotBody}>{children}</div>
      </div>
    </div>
  );
}
export function StockPositionsView({
  positions,
}: {
  positions: StockPosition[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [warehouseFilter, setWarehouseFilter] = useState<number | null>(null);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get(
      "warehouseId",
    );
    setWarehouseFilter(value ? Number(value) : null);
  }, []);
  const visible = useMemo(() => {
    const q = search.toLowerCase();
    const warehouses = filters.warehouse as string[] | undefined;
    return positions.filter(
      (p) =>
        (warehouseFilter === null || p.warehouseId === warehouseFilter) &&
        (!warehouses?.length || warehouses.includes(p.warehouseName)) &&
        (!q ||
          [p.sku, p.itemName, p.warehouseName].some((v) =>
            v.toLowerCase().includes(q),
          )),
    );
  }, [filters, positions, search, warehouseFilter]);
  const filterTabs: FilterTab[] = [
    {
      key: "warehouse",
      label: "Warehouse",
      type: "checkbox",
      options: [
        ...new Set(positions.map((position) => position.warehouseName)),
      ].sort(),
    },
  ];
  const removeFilter = (key: string) =>
    setFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  const columns: DataTableColumn<StockPosition>[] = [
    {
      key: "sku",
      label: "SKU",
      render: (r) => <span className={listStyles.codeCell}>{r.sku}</span>,
    },
    { key: "itemName", label: "Item Name" },
    { key: "warehouseName", label: "Warehouse" },
    { key: "onHand", label: "On Hand", align: "right" },
    { key: "reserved", label: "Reserved", align: "right" },
    { key: "available", label: "Available", align: "right" },
  ];
  const primaryAction = (
    <Button
      variant="primary"
      icon="add"
      className={layout.slotPrimaryAction}
      onClick={() => router.push("/inventory/stock/receive")}
    >
      Receive Stock
    </Button>
  );
  const toolbarActions = (
    <div className={listStyles.toolbarActions}>
      {(
        [
          ["issue", "Issue Stock"],
          ["transfer", "Transfer Stock"],
          ["reserve", "Reserve Stock"],
          ["adjust", "Adjust Quantity"],
        ] as const
      ).map(([path, label]) => (
        <Button
          key={path}
          variant="secondary"
          onClick={() => router.push(`/inventory/stock/${path}`)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
  return (
    <Shell
      title="Stock"
      description="Current stock position by item and warehouse."
      icon="inventory"
      primaryAction={primaryAction}
      toolbarLeft={
        <FilterPanel
          tabs={filterTabs}
          filters={filters}
          onApply={setFilters}
          onClear={() => {
            setFilters({});
            setWarehouseFilter(null);
          }}
          onRemoveFilter={removeFilter}
          showChips={false}
        />
      }
      toolbarRight={toolbarActions}
      chips={
        search.trim() || Object.keys(filters).length || warehouseFilter ? (
          <FilterChips
            tabs={filterTabs}
            filters={filters}
            additionalChips={[
              ...(search.trim()
                ? [
                    {
                      key: "search",
                      label: "Search contains",
                      value: search.trim(),
                      onRemove: () => setSearch(""),
                    },
                  ]
                : []),
              ...(warehouseFilter
                ? [
                    {
                      key: "warehouse-link",
                      label: "Warehouse",
                      value:
                        positions.find(
                          (position) =>
                            position.warehouseId === warehouseFilter,
                        )?.warehouseName ?? String(warehouseFilter),
                      onRemove: () => setWarehouseFilter(null),
                    },
                  ]
                : []),
            ]}
            onClear={() => {
              setFilters({});
              setSearch("");
              setWarehouseFilter(null);
            }}
            onRemoveFilter={removeFilter}
          />
        ) : null
      }
      search={search}
      setSearch={setSearch}
    >
      <DataTable
        columns={columns}
        rows={visible}
        selectedIds={new Set<number>()}
        isAllSelected={false}
        isSomeSelected={false}
        onSelectAll={() => undefined}
        onSelectOne={() => undefined}
        onRowClick={() => undefined}
        currentPage={1}
        totalPages={1}
        onPageChange={() => undefined}
        totalCount={positions.length}
        filteredCount={visible.length}
        itemLabel="stock positions"
        hasData={positions.length > 0}
        emptyIcon="inventory"
        emptyTitle="No stock"
        emptyText="Receive stock to create the first stock position"
        emptyFilterText="No stock positions match the current filters"
      />
    </Shell>
  );
}
export function StockActivityView({ rows }: { rows: StockActivity[] }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const selectedTypes = filters.type as string[] | undefined;
  const visible = rows.filter(
    (r) =>
      (!selectedTypes?.length || selectedTypes.includes(r.type)) &&
      (!search ||
        [
          r.type,
          r.sku,
          r.itemName,
          r.warehouse,
          r.source ?? "",
          r.sourceId ?? "",
        ].some((v) => v.toLowerCase().includes(search.toLowerCase()))),
  );
  const filterTabs: FilterTab[] = [
    {
      key: "type",
      label: "Type",
      type: "checkbox",
      options: [...new Set(rows.map((row) => row.type))].sort(),
    },
  ];
  const removeFilter = (key: string) =>
    setFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  const columns: DataTableColumn<StockActivity>[] = [
    { key: "date", label: "Date", render: (r) => date(r.date) },
    { key: "type", label: "Type" },
    { key: "sku", label: "SKU" },
    { key: "itemName", label: "Item Name" },
    { key: "warehouse", label: "Warehouse" },
    {
      key: "quantityChange",
      label: "Qty Change",
      align: "right",
      render: (r) =>
        r.quantityChange === null
          ? "—"
          : `${r.quantityChange > 0 ? "+" : ""}${r.quantityChange}`,
    },
    { key: "source", label: "Source", render: (r) => r.source ?? "—" },
    {
      key: "sourceId",
      label: "Source ID",
      render: (r) => r.sourceId ?? r.reference ?? "—",
    },
  ];
  return (
    <Shell
      title="Stock Activity"
      description="Read-only history of stock changes, reservations, transfers, and quantity adjustments."
      icon="history"
      search={search}
      setSearch={setSearch}
      toolbarLeft={
        <FilterPanel
          tabs={filterTabs}
          filters={filters}
          onApply={setFilters}
          onClear={() => setFilters({})}
          onRemoveFilter={removeFilter}
          showChips={false}
        />
      }
      chips={
        search.trim() || Object.keys(filters).length ? (
          <FilterChips
            tabs={filterTabs}
            filters={filters}
            additionalChips={
              search.trim()
                ? [
                    {
                      key: "search",
                      label: "Search contains",
                      value: search.trim(),
                      onRemove: () => setSearch(""),
                    },
                  ]
                : []
            }
            onClear={() => {
              setFilters({});
              setSearch("");
            }}
            onRemoveFilter={removeFilter}
          />
        ) : null
      }
    >
      <DataTable
        columns={columns}
        rows={visible}
        selectedIds={new Set<number>()}
        isAllSelected={false}
        isSomeSelected={false}
        onSelectAll={() => undefined}
        onSelectOne={() => undefined}
        onRowClick={() => undefined}
        currentPage={1}
        totalPages={1}
        onPageChange={() => undefined}
        totalCount={rows.length}
        filteredCount={visible.length}
        itemLabel="stock activity records"
        hasData={rows.length > 0}
        emptyIcon="history"
        emptyTitle="No stock activity"
        emptyText="Stock movements will appear here"
        emptyFilterText="No stock activity matches the current filters"
      />
    </Shell>
  );
}
export function StockCountsView({ rows: initial }: { rows: StockCountRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const selectedStatuses = filters.status as string[] | undefined;
  const visible = rows.filter(
    (r) =>
      (!selectedStatuses?.length || selectedStatuses.includes(r.status)) &&
      (!search ||
        [r.countNo, r.warehouse, r.status].some((v) =>
          v.toLowerCase().includes(search.toLowerCase()),
        )),
  );
  const filterTabs: FilterTab[] = [
    {
      key: "status",
      label: "Status",
      type: "checkbox",
      options: ["DRAFT", "IN_PROGRESS", "COMPLETED"],
    },
  ];
  const removeFilter = (key: string) =>
    setFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  const columns: DataTableColumn<StockCountRow>[] = [
    {
      key: "countNo",
      label: "Count No.",
      render: (r) => <span className={listStyles.codeCell}>{r.countNo}</span>,
    },
    { key: "warehouse", label: "Warehouse" },
    { key: "countDate", label: "Count Date", render: (r) => date(r.countDate) },
    { key: "items", label: "Items", align: "right" },
    { key: "adjustments", label: "Adjustments", align: "right" },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <Badge
          variant="soft"
          size="x-small"
          color={
            r.status === "COMPLETED"
              ? "success"
              : r.status === "IN_PROGRESS"
                ? "info"
                : "neutral"
          }
        >
          {r.status.replace("_", " ")}
        </Badge>
      ),
    },
  ];
  const remove = async () => {
    for (const id of selected) {
      const response = await fetch(`/api/inventory/stock-counts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const b = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        setError(b?.message ?? "Stocktake could not be deleted");
        return;
      }
    }
    setRows((c) => c.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
    setConfirm(false);
    setToast("Stocktake deleted");
  };
  const actions = (
    <Button
      variant="primary"
      icon="add"
      className={layout.slotPrimaryAction}
      onClick={() => router.push("/inventory/stock-counts/new")}
    >
      New Stocktake
    </Button>
  );
  return (
    <>
      <Shell
        title="Stock Counts"
        description="Physical stocktake records by warehouse."
        icon="fact_check"
        primaryAction={actions}
        toolbarLeft={
          <FilterPanel
            tabs={filterTabs}
            filters={filters}
            onApply={setFilters}
            onClear={() => setFilters({})}
            onRemoveFilter={removeFilter}
            showChips={false}
          />
        }
        toolbarRight={
          <div className={listStyles.toolbarActions}>
            <Button
              variant="secondary-destructive"
              icon="delete"
              disabled={!selected.size}
              title="Delete selected"
              onClick={() => setConfirm(true)}
            />
          </div>
        }
        chips={
          search.trim() || Object.keys(filters).length ? (
            <FilterChips
              tabs={filterTabs}
              filters={filters}
              additionalChips={
                search.trim()
                  ? [
                      {
                        key: "search",
                        label: "Search contains",
                        value: search.trim(),
                        onRemove: () => setSearch(""),
                      },
                    ]
                  : []
              }
              onClear={() => {
                setFilters({});
                setSearch("");
              }}
              onRemoveFilter={removeFilter}
            />
          ) : null
        }
        search={search}
        setSearch={setSearch}
        error={error}
        onDismissError={() => setError("")}
      >
        <DataTable
          columns={columns}
          rows={visible}
          selectedIds={selected}
          isAllSelected={
            visible.length > 0 && visible.every((row) => selected.has(row.id))
          }
          isSomeSelected={visible.some((row) => selected.has(row.id))}
          onSelectAll={() =>
            setSelected(
              visible.every((row) => selected.has(row.id))
                ? new Set()
                : new Set(visible.map((row) => row.id)),
            )
          }
          onSelectOne={(id) =>
            setSelected((c) => {
              const n = new Set(c);
              n.has(id) ? n.delete(id) : n.add(id);
              return n;
            })
          }
          onRowClick={(r) => router.push(`/inventory/stock-counts/${r.id}`)}
          currentPage={1}
          totalPages={1}
          onPageChange={() => undefined}
          totalCount={rows.length}
          filteredCount={visible.length}
          itemLabel="stock counts"
          hasData={rows.length > 0}
          emptyIcon="fact_check"
          emptyTitle="No stock counts"
          emptyText="Create the first stocktake"
          emptyFilterText="No stock counts match the current filters"
        />
      </Shell>
      <ConfirmDialog
        isOpen={confirm}
        title="Delete Stocktake"
        message="Delete the selected draft or in-progress stocktake? Completed stocktakes cannot be deleted."
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setConfirm(false)}
        onConfirm={() => void remove()}
      />
      <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
    </>
  );
}
