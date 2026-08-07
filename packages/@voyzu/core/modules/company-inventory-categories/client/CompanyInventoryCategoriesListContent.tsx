"use client";

import { CompanyPageTitleBadges, getStatusSemanticColor } from "@voyzu/core/common/client";
import { Deactivate, Delete } from "@voyzu/core/common/inventory-categories/domain/operation-policy";
import { AddInventoryCategoryModal } from "../../common/inventory-categories/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { InventoryCategoryCreateRequestDto, InventoryCategoryResponseDto } from "@voyzu/core/types/modules/inventory-categories";
import type { ItemPostingProfileResponseDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";
import { Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, Toast, ValidationAlert, type DataTableColumn, type DropdownMenuItem, type FilterState, type FilterTab } from "@voyzu/ui-components";
import { pattern, required, useFormValidation } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const ITEMS_PER_PAGE = 100;
const TOAST_KEY = "voyzu.inventory-categories.toast";
const CODE_PATTERN = /^[A-Z0-9_ -]+$/;
type InventoryCategoryRow = InventoryCategoryResponseDto & { id: number };

const columns: DataTableColumn<InventoryCategoryRow>[] = [
  { key: "code", label: "Category Code", width: "14rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Category Name", width: "16rem", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  { key: "description", label: "Description" },
  { key: "posting_profile_code", label: "Posting Profile", width: "14rem", render: (row) => <span className={listStyles.codeCell}>{row.posting_profile_code}</span> },
  { key: "numberOfItems", label: "Active Items", width: "9rem", align: "center", render: (row) => row.numberOfItems.active },
  {
    key: "status",
    label: "Status",
    width: "8rem",
    align: "center",
    render: (row) => <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge>,
  },
];

export function CompanyInventoryCategoriesListContent({
  categories,
  postingProfiles,
  basePath = "/finance/inventory/categories",
  apiPath = "/api/inventory/categories",
}: {
  categories: InventoryCategoryResponseDto[];
  postingProfiles: ItemPostingProfileResponseDto[];
  basePath?: string;
  apiPath?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState(categories);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [listError, setListError] = useState("");
  const [addCode, setAddCode] = useState("");
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addPostingProfileCode, setAddPostingProfileCode] = useState("");
  const [addServerError, setAddServerError] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const rows = data as InventoryCategoryRow[];
  const postingProfileOptions = useMemo(() => postingProfiles
    .filter((profile) => profile.status === "ACTIVE")
    .map((profile) => ({ value: profile.profile_code, label: profile.profile_name, code: profile.profile_code })), [postingProfiles]);
  const addValidation = useFormValidation(() => ({
    code: { label: "code", value: addCode, rules: [required(), pattern(CODE_PATTERN, "Code can only contain letters, numbers, spaces, underscores or hyphens")] },
    name: { label: "name", value: addName, rules: [required()] },
    description: { label: "description", value: addDescription, rules: [required()] },
    posting_profile_code: { label: "posting profile", value: addPostingProfileCode, rules: [required()] },
  }));

  const apiUrl = (suffix = "") => {
    const [path, query] = apiPath.split("?");
    return `${path}${suffix}${query ? `?${query}` : ""}`;
  };

  useEffect(() => {
    setData(categories);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [categories]);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOAST_KEY);
    if (!stored) return;
    sessionStorage.removeItem(TOAST_KEY);
    setToastMessage(stored);
    setToastVisible(true);
  }, []);

  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort(), [rows]);
  const filterTabs = useMemo<FilterTab[]>(() => [{ key: "status", label: "Status", type: "checkbox", options: statuses }], [statuses]);

  const filtered = useMemo(() => {
    let result = rows;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((row) => row.code.toLowerCase().includes(query) || row.name.toLowerCase().includes(query) || row.description.toLowerCase().includes(query) || row.posting_profile_code.toLowerCase().includes(query));
    }
    const statusFilter = activeFilters.status as string[] | undefined;
    if (statusFilter?.length) result = result.filter((row) => statusFilter.includes(row.status));
    return result;
  }, [activeFilters, rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const isAllSelected = paginated.length > 0 && paginated.every((row) => selectedIds.has(row.id));
  const isSomeSelected = !isAllSelected && paginated.some((row) => selectedIds.has(row.id));
  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.has(row.id)), [rows, selectedIds]);
  const hasSelection = selectedRows.length > 0;
  const canActivateSelection = hasSelection && selectedRows.some((row) => row.status !== "ACTIVE");
  const canDeactivateSelection = hasSelection && selectedRows.some((row) => row.status !== "INACTIVE") && selectedRows.every((row) => Deactivate(row).length === 0);
  const canDeleteSelection = hasSelection && selectedRows.every((row) => Delete(row).length === 0);

  const removeFilter = (key: string) => {
    setActiveFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      router.refresh();
      setRefreshing(false);
    }, 500);
  };

  const transitionSelected = async (action: "activate" | "deactivate") => {
    setListError("");
    const response = await fetch(apiUrl(`/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: selectedRows.map((row) => row.code) }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setListError(body?.message ?? `Unable to ${action} selected categories`);
      return;
    }
    setToastMessage(`Selected categories ${action === "activate" ? "activated" : "deactivated"}`);
    setToastVisible(true);
    setSelectedIds(new Set());
    router.refresh();
  };

  const deleteSelected = async () => {
    setListError("");
    for (const row of selectedRows) {
      const response = await fetch(apiUrl(`/${encodeURIComponent(row.code)}`), { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setListError(body?.message ?? `Unable to delete category ${row.code}`);
        return;
      }
    }
    setToastMessage("Selected categories deleted");
    setToastVisible(true);
    setSelectedIds(new Set());
    router.refresh();
  };

  const handleExport = async (exportRows: InventoryCategoryRow[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [{ key: "code", label: "Category Code" }, { key: "name", label: "Category Name" }, { key: "description", label: "Description" }, { key: "status", label: "Status" }],
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
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "inventory_categories_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "inventory_categories_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "inventory_categories_full_dataset"); } },
  ], [filtered, rows, selectedRows]);

  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;

  const createCategory = async (value: InventoryCategoryCreateRequestDto): Promise<string | undefined> => {
    const response = await fetch(apiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      return body?.message ?? "An unexpected error occurred";
    }
    const created = await response.json() as InventoryCategoryResponseDto;
    setData((current) => [...current, created].sort((left, right) => left.code.localeCompare(right.code)));
    return undefined;
  };

  const resetAddModal = () => {
    setAddCode("");
    setAddName("");
    setAddDescription("");
    setAddPostingProfileCode("");
    setAddServerError("");
    setAddSaving(false);
    addValidation.reset();
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    resetAddModal();
  };

  const submitAddCategory = async () => {
    setAddServerError("");
    if (!addValidation.attempt()) return;
    setAddSaving(true);
    try {
      const createError = await createCategory({
        code: addCode.trim().toUpperCase(),
        name: addName.trim(),
        description: addDescription.trim(),
        posting_profile_code: addPostingProfileCode,
      });
      if (createError) {
        setAddServerError(createError);
        return;
      }
      closeAddModal();
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>package_2</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Categories</h1>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Item categories group inventory, non-inventory, and service items and provide a default posting profile.</p></div>
        </div>
        <div className={layout.slotActions}>
          <Button variant="primary" icon="add" className={layout.slotPrimaryAction} onClick={() => setIsAddOpen(true)}>
            Add Category
          </Button>
        </div>
        <div className={layout.slotAlert}>
          <ValidationAlert errors={listError ? [listError] : []} visible={!!listError} onDismiss={() => setListError("")} />
        </div>
      </header>

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search categories..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary" icon="check_circle" disabled={!canActivateSelection} title="Activate selected" onClick={() => { void transitionSelected("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={!canDeactivateSelection} title="Deactivate selected" onClick={() => { void transitionSelected("deactivate"); }}>Deactivate</Button>
            <Button variant="secondary-destructive" icon="delete" disabled={!canDeleteSelection} title="Delete selected" onClick={() => { void deleteSelected(); }} />
            <div className={listStyles.divider} />
            <Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={handleRefresh} />
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
            onRowClick={(row) => router.push(`${basePath}/${encodeURIComponent(row.code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={rows.length}
            filteredCount={filtered.length}
            itemLabel="categories"
            hasData={rows.length > 0}
            emptyIcon="category"
            emptyTitle="No categories found"
            emptyText="No inventory categories have been configured"
            emptyFilterText="No categories match your search"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.name}</span></div><div className={listStyles.mobileMeta}>{row.numberOfItems.active} active items - {row.status}</div></div>}
          />
        </div>
      </div>

      <AddInventoryCategoryModal
        isOpen={isAddOpen}
        code={addCode}
        name={addName}
        description={addDescription}
        postingProfileCode={addPostingProfileCode}
        postingProfileOptions={postingProfileOptions}
        errors={[...addValidation.errors, ...(addServerError ? [addServerError] : [])]}
        showErrors={addValidation.showErrors || !!addServerError}
        saving={addSaving}
        codeHasError={addValidation.hasError("code")}
        nameHasError={addValidation.hasError("name")}
        descriptionHasError={addValidation.hasError("description")}
        postingProfileHasError={addValidation.hasError("posting_profile_code")}
        onClose={closeAddModal}
        onDismissErrors={() => {
          addValidation.dismiss();
          setAddServerError("");
        }}
        onCodeChange={(value) => setAddCode(value.toUpperCase())}
        onNameChange={setAddName}
        onDescriptionChange={setAddDescription}
        onPostingProfileChange={setAddPostingProfileCode}
        onSubmit={() => { void submitAddCategory(); }}
      />
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={toastMessage} />
    </div>
  );
}
