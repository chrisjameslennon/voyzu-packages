"use client";

import { CompanyPageTitleBadges, financeApiUrl, getHasPostingsColor, getStatusSemanticColor } from "@voyzu/core/common/client";
import { AddInventoryItemModal } from "@voyzu/core/common/inventory-items/client";
import { Deactivate } from "@voyzu/core/common/inventory-items/domain/operation-policy";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { InventoryCategoryResponseDto } from "@voyzu/core/types/modules/inventory-categories";
import type { InventoryItemCreateRequestDto, InventoryItemResponseDto } from "@voyzu/core/types/modules/inventory-items";
import { Badge, Breadcrumbs, Button, ConfirmDialog, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, pattern, required, useFormValidation, type DataTableColumn, type DropdownMenuItem, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./inventory-items-list.module.css";

const ITEMS_PER_PAGE = 100;
const CODE_PATTERN = /^[A-Z0-9_ -]+$/;
const UNIT_PATTERN = /^[a-z][a-z0-9_-]*$/i;
const ITEM_TYPE_OPTIONS = [
  { value: "INVENTORY", label: "INVENTORY" },
  { value: "NON_INVENTORY", label: "NON_INVENTORY" },
  { value: "SERVICE", label: "SERVICE" },
];

type InventoryItemRow = InventoryItemResponseDto & { id: number };

const numberFormat = new Intl.NumberFormat("en-NZ", { maximumFractionDigits: 0 });
const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatQuantity(value: number | null) {
  return value == null ? "-" : numberFormat.format(value);
}

function formatMoney(value: number | null) {
  return value == null ? "-" : moneyFormat.format(value);
}

const columns: DataTableColumn<InventoryItemRow>[] = [
  { key: "item_code", label: "Item Code", width: "11rem", render: (row) => <span className={listStyles.codeCell}>{row.item_code}</span> },
  { key: "item_name", label: "Item Name", width: "16rem", render: (row) => <span className={listStyles.nameCell}>{row.item_name}</span> },
  { key: "item_type", label: "Item Type", width: "10rem" },
  { key: "category_code", label: "Category", width: "11rem", render: (row) => <span className={listStyles.codeCell}>{row.category_code}</span> },
  { key: "unit_code", label: "Unit", width: "6rem" },
  { key: "quantity_on_hand_derived", label: "Qty On Hand", width: "9rem", align: "right", render: (row) => formatQuantity(row.quantity_on_hand_derived) },
  { key: "book_value_derived", label: "Book Value", width: "9rem", align: "right", render: (row) => formatMoney(row.book_value_derived) },
  { key: "hasPostings", label: "Has Postings", width: "9rem", align: "center", render: (row) => row.hasPostings ? <Badge variant="soft" size="x-small" customColors={getHasPostingsColor(true)}>HAS POSTINGS</Badge> : null },
  {
    key: "status",
    label: "Status",
    width: "8rem",
    align: "center",
    render: (row) => <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge>,
  },
];

export function InventoryItemsListContent({
  items,
  categories,
}: {
  items: InventoryItemResponseDto[];
  categories: InventoryCategoryResponseDto[];
}) {
  const router = useRouter();
  const [data, setData] = useState(items);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addItemCode, setAddItemCode] = useState("");
  const [addItemName, setAddItemName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addItemType, setAddItemType] = useState<InventoryItemCreateRequestDto["item_type"]>("INVENTORY");
  const [addCategoryCode, setAddCategoryCode] = useState("");
  const [addUnitCode, setAddUnitCode] = useState("each");
  const [addServerError, setAddServerError] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const rows = data as InventoryItemRow[];
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const addValidation = useFormValidation(() => ({
    itemCode: { label: "item code", value: addItemCode, rules: [required(), pattern(CODE_PATTERN, "Item code can only contain letters, numbers, spaces, underscores or hyphens")] },
    itemName: { label: "item name", value: addItemName, rules: [required()] },
    description: { label: "description", value: addDescription, rules: [required()] },
    categoryCode: { label: "category", value: addCategoryCode, rules: [required(), pattern(CODE_PATTERN, "Category must be selected from the list")] },
    unitCode: { label: "unit code", value: addUnitCode, rules: [required(), pattern(UNIT_PATTERN, "Unit code can only contain letters, numbers, underscores or hyphens and must start with a letter")] },
  }));
  const addCategoryOptions = useMemo(() => categories.filter((category) => category.status === "ACTIVE").map((category) => ({ value: category.code, label: category.name, code: category.code })), [categories]);

  useEffect(() => {
    setData(items);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [items]);

  const itemTypes = useMemo(() => [...new Set(rows.map((row) => row.item_type))].sort(), [rows]);
  const categoryFilters = useMemo(() => [...new Set(rows.map((row) => row.category_code))].sort(), [rows]);
  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort(), [rows]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "item_type", label: "Item Type", type: "checkbox", options: itemTypes },
    { key: "category_code", label: "Category", type: "checkbox", options: categoryFilters },
    { key: "status", label: "Status", type: "checkbox", options: statuses },
  ], [categoryFilters, itemTypes, statuses]);

  const filtered = useMemo(() => {
    let result = rows;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((row) => row.item_code.toLowerCase().includes(query) || row.item_name.toLowerCase().includes(query) || row.description.toLowerCase().includes(query) || row.item_type.toLowerCase().includes(query) || row.category_code.toLowerCase().includes(query) || row.unit_code.toLowerCase().includes(query));
    }
    const typeFilter = activeFilters.item_type as string[] | undefined;
    if (typeFilter?.length) result = result.filter((row) => typeFilter.includes(row.item_type));
    const categoryFilter = activeFilters.category_code as string[] | undefined;
    if (categoryFilter?.length) result = result.filter((row) => categoryFilter.includes(row.category_code));
    const statusFilter = activeFilters.status as string[] | undefined;
    if (statusFilter?.length) result = result.filter((row) => statusFilter.includes(row.status));
    return result;
  }, [activeFilters, rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const isAllSelected = paginated.length > 0 && paginated.every((row) => selectedIds.has(row.id));
  const isSomeSelected = !isAllSelected && paginated.some((row) => selectedIds.has(row.id));
  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.has(row.id)), [rows, selectedIds]);
  const canActivateSelection = selectedRows.some((row) => row.status === "INACTIVE");
  const canDeactivateSelection = selectedRows.some((row) => row.status === "ACTIVE") && selectedRows.every((row) => Deactivate(row).length === 0);
  const totalBookValue = useMemo(() => rows.reduce((sum, row) => sum + (row.book_value_derived ?? 0), 0), [rows]);

  const transitionStatus = async (action: "activate" | "deactivate") => {
    const response = await fetch(await financeApiUrl(`/inventory/items/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: selectedRows.map((row) => row.item_code) }),
    });
    if (!response.ok) return;
    const updated = await response.json() as InventoryItemResponseDto[];
    const byCode = new Map(updated.map((item) => [item.item_code, item]));
    setData((current) => current.map((item) => byCode.get(item.item_code) ?? item));
    setSelectedIds(new Set());
  };

  const deleteSelected = async () => {
    const response = await fetch(await financeApiUrl("/inventory/items/batch"), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: selectedRows.map((row) => row.item_code) }),
    });
    if (!response.ok) return;
    const deletedIds = new Set(selectedRows.map((row) => row.id));
    setData((current) => current.filter((item) => !deletedIds.has(item.id)));
    setSelectedIds(new Set());
    setIsDeleteOpen(false);
  };

  const removeFilter = (key: string) => {
    setActiveFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      router.refresh();
      setRefreshing(false);
    }, 500);
  };

  const handleExport = async (exportRows: InventoryItemRow[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "item_code", label: "Item Code" },
          { key: "item_name", label: "Item Name" },
          { key: "description", label: "Description" },
          { key: "item_type", label: "Item Type" },
          { key: "category_code", label: "Category" },
          { key: "unit_code", label: "Unit" },
          { key: "status", label: "Status" },
        ],
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
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "inventory_items_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "inventory_items_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "inventory_items_full_dataset"); } },
  ], [filtered, rows, selectedRows]);

  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;

  const createItem = async (value: InventoryItemCreateRequestDto): Promise<string | undefined> => {
    const response = await fetch(await financeApiUrl("/inventory/items"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      return body?.message ?? "An unexpected error occurred";
    }
    const created = await response.json() as InventoryItemResponseDto;
    setData((current) => [...current, created].sort((left, right) => left.item_code.localeCompare(right.item_code)));
    return undefined;
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    setAddItemCode("");
    setAddItemName("");
    setAddDescription("");
    setAddItemType("INVENTORY");
    setAddCategoryCode("");
    setAddUnitCode("each");
    setAddServerError("");
    setAddSaving(false);
    addValidation.reset();
  };

  const submitAddItem = async () => {
    setAddServerError("");
    if (!addValidation.attempt()) return;
    setAddSaving(true);
    try {
      const error = await createItem({
        item_code: addItemCode.trim().toUpperCase(),
        item_name: addItemName.trim(),
        description: addDescription.trim(),
        item_type: addItemType,
        category_code: addCategoryCode.trim().toUpperCase(),
        unit_code: addUnitCode.trim().toLowerCase(),
        quantity_on_hand_derived: null,
        book_value_derived: null,
        avg_unit_book_value_derived: null,
      });
      if (error) setAddServerError(error);
      else closeAddModal();
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={`${layout.slotTitle} ${localStyles.titleSlot}`}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>package_2</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Items</h1>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Items define inventory, service, and non-inventory products used by inventory and document posting workflows.</p></div>
        </div>
        <div className={layout.slotActions}>
          <Button variant="primary" icon="add" className={layout.slotPrimaryAction} onClick={() => setIsAddOpen(true)}>
            Add Item
          </Button>
        </div>
        <div className={`${layout.slotSearch} ${localStyles.balancesSlot}`}>
          <section className={localStyles.balancesCard} aria-label="Inventory totals">
            <h2 className={localStyles.balancesTitle}>Inventory Totals</h2>
            <div className={localStyles.balanceRows}>
              <div className={`${localStyles.totalRow} ${localStyles.totalRowEmphasis}`}>
                <span className={localStyles.balanceLabel}>Total Book Value</span>
                <span className={localStyles.balanceValue}>{formatMoney(totalBookValue)}</span>
              </div>
            </div>
          </section>
        </div>
      </header>

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search items..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary" icon="check_circle" disabled={!canActivateSelection} onClick={() => { void transitionStatus("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={!canDeactivateSelection} onClick={() => { void transitionStatus("deactivate"); }}>Deactivate</Button>
            <Button variant="secondary-destructive" icon="delete" disabled={selectedIds.size === 0} title="Delete Selected" onClick={() => setIsDeleteOpen(true)} />
            <div className={listStyles.divider} />
            <Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={refresh} />
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
            onRowClick={(row) => router.push(`/finance/inventory/items/${encodeURIComponent(row.item_code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={rows.length}
            filteredCount={filtered.length}
            itemLabel="items"
            hasData={rows.length > 0}
            emptyIcon="package_2"
            emptyTitle="No items found"
            emptyText="No inventory items have been configured"
            emptyFilterText="No items match your search"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.item_code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.item_name}</span></div><div className={listStyles.mobileMeta}>{[row.category_code, row.hasPostings ? "Has postings" : null, row.status].filter(Boolean).join(" - ")}</div></div>}
          />
        </div>
      </div>

      <AddInventoryItemModal
        isOpen={isAddOpen}
        itemCode={addItemCode}
        itemName={addItemName}
        description={addDescription}
        itemType={addItemType}
        categoryCode={addCategoryCode}
        unitCode={addUnitCode}
        itemTypeOptions={ITEM_TYPE_OPTIONS}
        categoryOptions={addCategoryOptions}
        errors={[...addValidation.errors, ...(addServerError ? [addServerError] : [])]}
        showErrors={addValidation.showErrors || Boolean(addServerError)}
        saving={addSaving}
        fieldErrors={{ itemCode: addValidation.hasError("itemCode"), itemName: addValidation.hasError("itemName"), description: addValidation.hasError("description"), categoryCode: addValidation.hasError("categoryCode"), unitCode: addValidation.hasError("unitCode") }}
        onClose={closeAddModal}
        onDismissErrors={() => { addValidation.dismiss(); setAddServerError(""); }}
        onItemCodeChange={(value) => setAddItemCode(value.toUpperCase())}
        onItemNameChange={setAddItemName}
        onDescriptionChange={setAddDescription}
        onItemTypeChange={setAddItemType}
        onCategoryCodeChange={setAddCategoryCode}
        onUnitCodeChange={(value) => setAddUnitCode(value.toLowerCase())}
        onSubmit={() => { void submitAddItem(); }}
      />
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Items"
        message={selectedRows.some((item) => item.hasPostings)
          ? `Are you sure you want to permanently delete ${selectedRows.length} item${selectedRows.length === 1 ? "" : "s"}? One or more selected items have postings. Their inventory ledger postings will also be permanently deleted.`
          : `Are you sure you want to permanently delete ${selectedRows.length} item${selectedRows.length === 1 ? "" : "s"}?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => { void deleteSelected(); }}
      />
    </div>
  );
}
