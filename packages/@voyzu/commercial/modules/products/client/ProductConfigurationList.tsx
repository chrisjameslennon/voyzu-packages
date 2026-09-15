"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { ProductConfigurationKind, ProductConfigurationRowDto } from "../types/product-configuration.dto";

const filterTabs: FilterTab[] = [
  { key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] },
];
const PAGE_SIZE = 25;

export function ProductConfigurationList({ products, hasOrganization, kind }: { products: ProductConfigurationRowDto[]; hasOrganization: boolean; kind: ProductConfigurationKind }) {
  const isList = kind !== "categories";
  const title = kind === "optionLists" ? "Product Option Lists" : isList ? "Manage Lists" : "Product Categories";
  const itemLabel = isList ? "lists" : "categories";
  const columns: DataTableColumn<ProductConfigurationRowDto>[] = [
    { key: "name", label: isList ? "List" : "Category", width: "16rem", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
    { key: "description", label: "Description", width: "24rem" },
    ...(isList ? [{ key: "values", label: "Values", width: "26rem", render: (row: ProductConfigurationRowDto) => row.values.join(", ") }] : []),
    { key: "count", label: isList ? "Number of Values" : "Number of Products", width: "10rem", align: "center" },
    { key: "status", label: "Status", width: "9rem", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge> },
  ];
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const statuses = filters.status as string[] | undefined;
    return products.filter((row) => (
      (!query || [row.code, row.name, row.description, ...row.values].some((value) => value?.toLowerCase().includes(query)))
      && (!statuses?.length || statuses.includes(row.status))
    ));
  }, [products, search, filters]);
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = visibleRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selectedRows = products.filter(({ id }) => selectedIds.has(id));
  const allSelected = pageRows.length > 0 && pageRows.every(({ id }) => selectedIds.has(id));
  const removeFilter = (key: string) => {
    setFilters((current) => { const next = { ...current }; delete next[key]; return next; });
    setPage(1);
  };
  const clearFilters = () => { setFilters({}); setSearch(""); setPage(1); };
  const exportRows = async (rows: ProductConfigurationRowDto[], suffix: string) => {
    setExporting(true);
    setExportError("");
    try {
      const response = await fetch("/api/capability/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `${kind}_${suffix}`,
          columns: columns.map(({ key, label }) => ({ key, label })),
          rows: rows.map((row) => ({ ...row })),
        }),
      });
      if (!response.ok) throw new Error("Export failed");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `${kind}_${suffix}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Reference data could not be exported. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>inventory_2</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{title}</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Maintain your product reference data.</p></div>
        </div>
        <div className={layout.slotActions}><Button variant="primary" icon="add">{isList ? "Add List" : "Add Category"}</Button></div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={filters} onApply={(next) => { setFilters(next); setPage(1); }} onClear={() => { setFilters({}); setPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search placeholder={`Search ${itemLabel}...`} aria-label={`Search ${itemLabel}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="plain" icon="sync" title="Refresh" aria-label="Refresh reference data" disabled={refreshing} onClick={() => startRefresh(() => router.refresh())} />
            <DropdownMenu
              trigger={<Button variant="plain" icon="file_download" title="Export" aria-label="Export reference data" disabled={exporting || products.length === 0} />}
              items={[
                { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: exporting || selectedRows.length === 0, onSelect: () => void exportRows(selectedRows, "selected") },
                { value: "current-view", label: `Current view (${visibleRows.length})`, icon: "visibility", disabled: exporting || visibleRows.length === 0, onSelect: () => void exportRows(visibleRows, "current_view") },
                { value: "full-dataset", label: `Full dataset (${products.length})`, icon: "database", disabled: exporting || products.length === 0, onSelect: () => void exportRows(products, "full_dataset") },
              ]}
              alignment="right"
              width={260}
            />
          </div>
        </div>
      </div>
      {(search.trim() || Object.values(filters).some((value) => Array.isArray(value) && value.length > 0)) && (
        <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={filters} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setPage(1); } }] : []} onClear={clearFilters} onRemoveFilter={removeFilter} /></div></div>
      )}
      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          {exportError && <Alert variant="soft" color="danger" title="Export failed" text={exportError} />}
          <DataTable<ProductConfigurationRowDto, number>
            columns={columns}
            rows={pageRows}
            selectedIds={selectedIds}
            isAllSelected={allSelected}
            isSomeSelected={!allSelected && pageRows.some(({ id }) => selectedIds.has(id))}
            onSelectAll={() => setSelectedIds((current) => {
              const next = new Set(current);
              pageRows.forEach(({ id }) => { if (allSelected) next.delete(id); else next.add(id); });
              return next;
            })}
            onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalCount={products.length}
            filteredCount={visibleRows.length}
            itemLabel={itemLabel}
            hasData={products.length > 0}
            loading={refreshing}
            emptyIcon="inventory_2"
            emptyTitle={hasOrganization ? `No ${itemLabel} yet` : "Select an organization"}
            emptyText={hasOrganization ? "Add sample data from Dashboard to populate this list." : "Select an organization to view its reference data."}
            emptyFilterText="No records match your search or filters"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileName}>{row.name}</div><div className={listStyles.mobileMeta}>{row.description}</div>{isList && <div className={listStyles.mobileMeta}>{row.values.join(", ")}</div>}<div className={listStyles.mobileMeta}>{row.count} {isList ? "values" : "products"}</div><Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge></div>}
          />
        </div>
      </div>
    </div>
  );
}
