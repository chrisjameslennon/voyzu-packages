"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog, Toast, ValidationAlert, Alert, Badge, Breadcrumbs, Button, SplitButton, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { ChangeProductCategoryModal } from "./ChangeProductCategoryModal";
import { AddProductModal } from "./AddProductModal";
import { transitionProductsAction } from "../server/actions/product.actions";
import type { ProductListRowDto } from "../types/product-list.dto";

const productColumns = (pricingCategories: { code: string; name: string }[]): DataTableColumn<ProductListRowDto>[] => [
  { key: "code", label: "Product Code", header: <>Product<br />Code</>, width: "10%", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  { key: "type", label: "Type", width: "7%" },
  { key: "category", label: "Category", width: "11%", render: (row) => row.category ?? "—" },
  { key: "pricingCategoryCode", label: "Pricing Category", header: <>Pricing<br />Category</>, width: "11%", render: (row) => pricingCategories.find((category) => category.code === row.pricingCategoryCode)?.name ?? row.pricingCategoryCode ?? "—" },
  { key: "itemSku", label: "Item SKU", width: "10%", render: (row) => row.itemSku ?? "" },
  { key: "basePrice", label: "Base Price", width: "8%", align: "right", render: (row) => row.basePrice.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
  { key: "numberOfVariants", label: "Number of Variants", header: <>Number of<br />Variants</>, width: "8%", align: "center", render: (row) => row.numberOfVariants === 1 ? "\u2014" : row.numberOfVariants },
  { key: "status", label: "Status", width: "8%", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge> },
];
const PAGE_SIZE = 25;

export function ProductsList({ products, hasOrganization, categories, pricingCategories, initialPricingCategoryCodes, showAllStatuses }: { products: ProductListRowDto[]; hasOrganization: boolean; categories: { code: string; name: string }[]; pricingCategories: { code: string; name: string; status: string }[]; initialPricingCategoryCodes: string[]; showAllStatuses: boolean }) {
  const router = useRouter();
  const columns = productColumns(pricingCategories);
  const [categoryChange, setCategoryChange] = useState<"category" | "pricingCategory" | null>(null);
  const [adding, setAdding] = useState<"normal" | "inventory" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const pricingCategoryLabel = (code: string) => { const category = pricingCategories.find((row) => row.code === code); return category ? category.code + " - " + category.name : code; };
  const filterTabs: FilterTab[] = [
    { key: "category", label: "Category", type: "checkbox", options: [...new Set(products.map((row) => row.category).filter((value): value is string => Boolean(value)))].sort() },
    { key: "pricingCategory", label: "Pricing Category", type: "checkbox", options: pricingCategories.map((row) => pricingCategoryLabel(row.code)) },
    { key: "type", label: "Type", type: "checkbox", options: ["Physical", "Service", "Other"] },
    { key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] },
  ];
  const [refreshing, startRefresh] = useTransition();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({ status: showAllStatuses ? [] : ["ACTIVE"], pricingCategory: initialPricingCategoryCodes.map(pricingCategoryLabel) });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const statuses = filters.status as string[] | undefined;
    const types = filters.type as string[] | undefined;
    const pricing = filters.pricingCategory as string[] | undefined;
    const categories = filters.category as string[] | undefined;
    return products.filter((row) => (
      (!query || [row.code, row.name, row.type, row.category, row.brand].some((value) => value?.toLowerCase().includes(query)))
      && (!statuses?.length || statuses.includes(row.status))
      && (!types?.length || types.includes(row.type))
      && (!pricing?.length || (row.pricingCategoryCode !== null && pricing.includes(pricingCategoryLabel(row.pricingCategoryCode))))
      && (!categories?.length || (row.category !== null && categories.includes(row.category)))
    ));
  }, [products, search, filters, pricingCategories]);
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = visibleRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selectedRows = products.filter(({ id }) => selectedIds.has(id));
  const transition = (operation: "activate" | "deactivate" | "delete") => { setError(""); startTransition(async () => { try { const result = await transitionProductsAction(selectedRows.map((row) => row.code), operation); if (result.error) { setError(result.error); return; } setSelectedIds(new Set()); setToast(operation === "delete" ? "Products deleted" : operation === "activate" ? "Products activated" : "Products deactivated"); router.refresh(); } catch { setError("Unable to update products. Please try again."); } }); };
  const allSelected = pageRows.length > 0 && pageRows.every(({ id }) => selectedIds.has(id));
  const removeFilter = (key: string) => {
    setFilters((current) => { const next = { ...current }; delete next[key]; return next; });
    setPage(1);
  };
  const clearFilters = () => { setFilters({}); setSearch(""); setPage(1); };
  const exportRows = async (rows: ProductListRowDto[], suffix: string) => {
    setExporting(true);
    setExportError("");
    try {
      const response = await fetch("/api/capability/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `products_${suffix}`,
          columns: columns.map(({ key, label }) => ({ key, label })),
          rows: rows.map((row) => ({ ...row, pricingCategoryCode: pricingCategories.find((category) => category.code === row.pricingCategoryCode)?.name ?? row.pricingCategoryCode })),
        }),
      });
      if (!response.ok) throw new Error("Export failed");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `products_${suffix}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Products could not be exported. Please try again.");
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
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Products</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Manage your product catalogue.</p></div>
        </div>
        <div className={layout.slotActions}><div className={layout.slotPrimaryAction}><SplitButton variant="primary" icon="add" label="Add Product" disabled={!hasOrganization || pending} onClick={() => setAdding("normal")} items={[{ label: "Add from Inventory", icon: "inventory_2", onClick: () => setAdding("inventory") }]} /></div></div>
        <div className={layout.slotAlert}><ValidationAlert errors={error ? [error] : []} visible={!!error} onDismiss={() => setError("")} /></div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={filters} onApply={(next) => { setFilters(next); setPage(1); }} onClear={() => { setFilters({}); setPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search placeholder="Search products..." aria-label="Search products" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <DropdownMenu
              trigger={<Button variant="secondary" disabled={pending || !selectedRows.length}>Actions <span className="material-symbols-outlined">expand_more</span></Button>}
              items={[
                { value: "activate", label: "Activate", icon: "check_circle", disabled: pending || !selectedRows.some((row) => row.status === "INACTIVE"), onSelect: () => transition("activate") },
                { value: "deactivate", label: "Deactivate", icon: "block", disabled: pending || !selectedRows.some((row) => row.status === "ACTIVE"), onSelect: () => transition("deactivate") },
                { value: "category", label: "Change Category", icon: "sync_alt", disabled: pending || !selectedRows.length, onSelect: () => setCategoryChange("category") },
                { value: "pricing-category", label: "Change Pricing Category", icon: "sync_alt", disabled: pending || !selectedRows.length, onSelect: () => setCategoryChange("pricingCategory") },
              ]}
              alignment="right" width={260}
            />
            <Button variant="secondary-destructive" icon="delete" aria-label="Delete selected products" disabled={pending || !selectedRows.length} onClick={() => setConfirmDelete(true)} />
            <Button variant="plain" icon="sync" title="Refresh" aria-label="Refresh products" disabled={refreshing} onClick={() => startRefresh(() => router.refresh())} />
            <DropdownMenu
              trigger={<Button variant="plain" icon="file_download" title="Export" aria-label="Export products" disabled={exporting || products.length === 0} />}
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
          <DataTable<ProductListRowDto, number>
            columns={columns}
            onRowClick={(row) => router.push(`/commercial/products/${encodeURIComponent(row.code)}`)}
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
            itemLabel="products"
            hasData={products.length > 0}
            loading={refreshing}
            emptyIcon="inventory_2"
            emptyTitle={hasOrganization ? "No products yet" : "Select an organization"}
            emptyText={hasOrganization ? "Your product catalogue is empty." : "Select an organization to view its products."}
            emptyFilterText="No products match your search or filters"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.name}</span></div><div className={listStyles.mobileMeta}>{[row.type, row.category].filter(Boolean).join(" · ")}</div><div className={listStyles.mobileMeta}>Base Price: {row.basePrice.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className={listStyles.mobileMeta}>Pricing Category: {pricingCategories.find((category) => category.code === row.pricingCategoryCode)?.name ?? row.pricingCategoryCode ?? "—"}</div><div className={listStyles.mobileMeta}>Item SKU: {row.itemSku ?? ""}</div><div className={listStyles.mobileMeta}>Variants: {row.numberOfVariants === 1 ? "\u2014" : row.numberOfVariants}</div><Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge></div>}
          />
        </div>
      </div>
      {categoryChange && <ChangeProductCategoryModal kind={categoryChange} codes={selectedRows.map((row) => row.code)} options={categoryChange === "category" ? categories : pricingCategories.filter((row) => row.status === "ACTIVE")} onClose={() => setCategoryChange(null)} onSaved={() => { setToast(categoryChange === "category" ? "Product categories changed" : "Product pricing categories changed"); setCategoryChange(null); setSelectedIds(new Set()); router.refresh(); }} />}
      {adding && <AddProductModal fromInventory={adding === "inventory"} onClose={() => setAdding(null)} />}
      <ConfirmDialog isOpen={confirmDelete} title="Delete Products" message="Permanently delete the selected products?" confirmLabel="Delete" confirmVariant="danger" onClose={() => setConfirmDelete(false)} onConfirm={() => { setConfirmDelete(false); transition("delete"); }} />
      <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}
