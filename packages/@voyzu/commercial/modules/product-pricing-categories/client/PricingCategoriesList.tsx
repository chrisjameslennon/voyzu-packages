"use client";

import { AdjustPricingModal } from "./AdjustPricingModal";

import { useEffect, useRef, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog, Toast, ValidationAlert, useFormValidation, required, maxLength, pattern, Alert, Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { PricingCategory } from "../types/pricing-category.dto";
import { savePricingCategoryAction, transitionPricingCategoriesAction } from "../server/actions/pricing-category.actions";
import modal from "@voyzu/ui-style/css-modules/modal.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import styles from "./pricing-categories.module.css";

const filterTabs: FilterTab[] = [
  { key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] },
];
const PAGE_SIZE = 25;

export function PricingCategoriesList({ initialRows, hasOrganization }: { initialRows: PricingCategory[]; hasOrganization: boolean }) {
  const [products, setProducts] = useState(initialRows);
  useEffect(() => setProducts(initialRows), [initialRows]);
  const title = "Product Pricing", itemLabel = "pricing categories", kind = "pricing-categories";
  const columns: DataTableColumn<PricingCategory>[] = [
    { key: "code", label: "Pricing Category Code", width: "20%", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
    { key: "name", label: "Name", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
    { key: "count", label: "Number of Products", width: "12rem", align: "center" },
    { key: "status", label: "Status", width: "8rem", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge> },
  ];
  const router = useRouter();
  const [adjusting, setAdjusting] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({ status: ["ACTIVE"] });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [editor, setEditor] = useState<{ code: string; name: string; existingCode?: string } | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, startSave] = useTransition();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (editor) dialog.current?.showModal(); }, [!!editor]);
  const validation = useFormValidation(() => ({
    code: { label: "code", value: editor?.code ?? "", rules: [required(), maxLength(50), pattern(/^[A-Za-z0-9][A-Za-z0-9_-]*$/, "Code may contain letters, numbers, hyphens and underscores")] },
    name: { label: "name", value: editor?.name ?? "", rules: [required(), maxLength(100)] },
  }));
  const openEditor = (row?: PricingCategory) => { validation.reset(); setError(""); setEditor(row ? { code: row.code, name: row.name, existingCode: row.code } : { code: "", name: "" }); };
  const save = () => {
    if (!editor || !validation.attempt()) return;
    startSave(async () => {
      try {
        const result = await savePricingCategoryAction({ code: editor.code.trim(), name: editor.name.trim() }, editor.existingCode);
        if (result.error || !result.rows) { setError(result.error ?? "Unable to save."); return; }
        setProducts(result.rows); setEditor(null); router.push("/commercial/products/pricing-categories/" + encodeURIComponent(editor.code.trim().toUpperCase())); router.refresh();
      } catch { setError("Unable to save pricing category. Please try again."); }
    });
  };
  const transition = (operation: "activate" | "deactivate" | "delete") => {
    setError(""); startSave(async () => {
      try {
        const result = await transitionPricingCategoriesAction(products.filter((row) => selectedIds.has(row.id)).map((row) => row.code), operation);
        if (result.error || !result.rows) { setError(result.error ?? "Unable to update."); return; }
        setProducts(result.rows); setSelectedIds(new Set()); setToast(operation === "delete" ? "Pricing categories deleted" : operation === "activate" ? "Pricing categories activated" : "Pricing categories deactivated"); router.refresh();
      } catch { setError("Unable to update pricing categories. Please try again."); }
    });
  };
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const statuses = filters.status as string[] | undefined;
    return products.filter((row) => (
      (!query || [row.code, row.name].some((value) => value?.toLowerCase().includes(query)))
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
  const exportRows = async (rows: PricingCategory[], suffix: string) => {
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
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Adjust product pricing based on Pricing Category, and create new Pricing Categories</p></div>
        </div>
        <div className={layout.slotActions}><Button variant="primary" icon="add" className={layout.slotPrimaryAction} disabled={!hasOrganization || saving} onClick={() => openEditor()}>Add Pricing Category</Button></div>
        <div className={layout.slotAlert}>{!editor && <ValidationAlert errors={error ? [error] : []} visible={!!error} onDismiss={() => setError("")} />}</div>
      </header>
      <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}>
          <FilterPanel tabs={filterTabs} filters={filters} onApply={(next) => { setFilters(next); setPage(1); }} onClear={() => { setFilters({}); setPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder={`Search ${itemLabel}...`} aria-label={`Search ${itemLabel}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
          <Button variant="secondary" icon="price_change" disabled={!selectedRows.length || saving} onClick={() => setAdjusting(true)}>Adjust Pricing</Button>
          <Button variant="secondary" icon="visibility" disabled={!selectedRows.length || saving} onClick={() => router.push("/commercial/products?" + new URLSearchParams({ pricingCategory: selectedRows.map((row) => row.code).join(","), status: "all" }))}>View Products</Button>
          <Button variant="secondary" icon="check_circle" disabled={!selectedRows.some((row) => row.status === "INACTIVE") || saving} onClick={() => transition("activate")}>Activate</Button>
          <Button variant="secondary" icon="block" disabled={!selectedRows.some((row) => row.status === "ACTIVE") || saving} onClick={() => transition("deactivate")}>Deactivate</Button>
          <Button variant="secondary-destructive" icon="delete" aria-label="Delete selected pricing categories" disabled={!selectedRows.length || saving} onClick={() => setConfirmDelete(true)} />
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
          <DataTable<PricingCategory, number>
            onRowClick={(row) => router.push("/commercial/products/pricing-categories/" + encodeURIComponent(row.code))}
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
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}>{row.name}</div><div className={listStyles.mobileMeta}>{row.count} products</div><Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge></div>}
          />
        </div>
      </div>
      {adjusting && <AdjustPricingModal categories={selectedRows} initialCodes={selectedRows.map((row) => row.code)} onClose={() => setAdjusting(false)} onAdjusted={(message) => { setAdjusting(false); setToast(message); router.refresh(); }} />}
      <ConfirmDialog isOpen={confirmDelete} title="Delete pricing categories" message="Delete the selected pricing categories? Categories assigned to products cannot be deleted." confirmLabel="Delete" onClose={() => setConfirmDelete(false)} onConfirm={() => { setConfirmDelete(false); transition("delete"); }} />
      {editor && <dialog ref={dialog} className={`${modal.modal} ${styles.dialog}`} aria-label={editor.existingCode ? "Edit Pricing Category" : "Add Pricing Category"} onCancel={(event) => { event.preventDefault(); if (!saving) setEditor(null); }}>
        <div className={modal.header}><h2 className={typography.contentTitle}>{editor.existingCode ? "Edit Pricing Category" : "Add Pricing Category"}</h2><Button variant="plain" icon="close" aria-label="Close" disabled={saving} onClick={() => setEditor(null)} /></div>
        <div className={modal.body}>
          <ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} />
          <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="pricing-category-code">Code</label><Input id="pricing-category-code" disabled={!!editor.existingCode || saving} invalid={validation.hasError("code")} value={editor.code} onChange={(event) => setEditor({ ...editor, code: event.target.value.toUpperCase() })} /></div>
          <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="pricing-category-name">Name</label><Input id="pricing-category-name" disabled={saving} invalid={validation.hasError("name")} value={editor.name} onChange={(event) => setEditor({ ...editor, name: event.target.value })} /></div>
        </div>
        <div className={modal.footer}>
          <Button variant="cancel" disabled={saving} onClick={() => setEditor(null)}>Cancel</Button>
          <Button variant="primary" disabled={saving} onClick={save}>{saving ? (editor.existingCode ? "Saving..." : "Creating...") : editor.existingCode ? "Save" : "Create Pricing Category"}</Button>
        </div>
      </dialog>}
    </div>
  );
}
