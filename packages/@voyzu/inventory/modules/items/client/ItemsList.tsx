"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  ConfirmDialog,
  DataTable,
  FilterChips,
  FilterPanel,
  Input,
  SearchableSelect,
  Toast,
  ValidationAlert,
  pattern,
  required,
  useFormValidation,
  type DataTableColumn,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { ItemListRow } from "../types/item-list.types";
import type {
  ItemCategoryOptionDto,
  ItemCreateRequestDto,
  ItemDeletionImpactDto,
  ItemResponseDto,
  ItemSkuReservationDto,
} from "../types/item.types";
import { UNIT_VALUES } from "../../core/types";
import type { Unit } from "../../core/types";
import { InventoryListActions } from "../../../client/InventoryListActions";
import inventoryListStyles from "../../../client/inventory-list-actions.module.css";
import styles from "./items.module.css";

const SKU_PATTERN = /^[A-Z0-9][A-Z0-9_-]*$/;
const UNIT_OPTIONS = UNIT_VALUES.map((unit) => ({ value: unit, label: unit }));
const columns: DataTableColumn<ItemListRow>[] = [
  {
    key: "sku",
    label: "SKU",
    width: "10rem",
    render: (row) => <span className={listStyles.codeCell}>{row.sku}</span>,
  },
  {
    key: "name",
    label: "Item Name",
    width: "16rem",
    render: (row) => <span className={listStyles.nameCell}>{row.name}</span>,
  },
  {
    key: "category",
    label: "Category",
    width: "13rem",
    render: (row) => row.category ?? "—",
  },
  {
    key: "unit",
    label: "Unit",
    width: "6rem",
    render: (row) => row.unit ?? "—",
  },
  {
    key: "quantityTracked",
    label: "Quantity Tracked",
    width: "10rem",
    align: "center",
    render: (row) => (row.quantityTracked ? "Yes" : "No"),
  },
  {
    key: "unitsOnHand",
    label: "Units on hand",
    width: "9rem",
    align: "right",
    render: (row) => row.unitsOnHand,
  },
  {
    key: "status",
    label: "Status",
    width: "9rem",
    align: "center",
    render: (row) => (
      <Badge
        variant="soft"
        size="x-small"
        color={row.status === "ACTIVE" ? "success" : "neutral"}
      >
        {row.status}
      </Badge>
    ),
  },
];

export function ItemsList({
  items,
  categories,
}: {
  items: ItemListRow[];
  categories: ItemCategoryOptionDto[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({ status: ["ACTIVE"] });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showCategoryChange, setShowCategoryChange] = useState(false);
  const [changeCategoryId, setChangeCategoryId] = useState("");
  const [changingCategory, setChangingCategory] = useState(false);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<Unit | "">("each");
  const [quantityTracked, setQuantityTracked] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [autoSku, setAutoSku] = useState(false);
  const [reservedId, setReservedId] = useState<number | null>(null);
  const [reservingSku, setReservingSku] = useState(false);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const validation = useFormValidation(() => ({
    sku: {
      label: "SKU",
      value: sku,
      enabled: !autoSku,
      rules: [
        required(),
        pattern(
          SKU_PATTERN,
          "Use uppercase letters, numbers, underscores or hyphens",
        ),
      ],
    },
    name: { label: "name", value: name, rules: [required()] },
    categoryId: { label: "category", value: categoryId, rules: [required()] },
    unit: {
      label: "unit",
      value: unit,
      enabled: quantityTracked,
      rules: [required()],
    },
  }));
  useEffect(() => {
    const message = window.sessionStorage.getItem("inventory-items-toast");
    if (!message) return;
    window.sessionStorage.removeItem("inventory-items-toast");
    setToast(message);
  }, []);
  useEffect(() => setRows(items), [items]);
  const filterTabs = useMemo<FilterTab[]>(
    () => [
      {
        key: "category",
        label: "Category",
        type: "checkbox",
        options: [
          ...new Set(
            rows
              .map((item) => item.category)
              .filter((value): value is string => value !== null),
          ),
        ].sort(),
      },
      {
        key: "unit",
        label: "Unit",
        type: "checkbox",
        options: [
          ...new Set(
            rows
              .map((item) => item.unit)
              .filter((value): value is Unit => value !== null),
          ),
        ].sort(),
      },
      {
        key: "quantityTracked",
        label: "Quantity Tracked",
        type: "checkbox",
        options: ["Yes", "No"],
      },
      {
        key: "status",
        label: "Status",
        type: "checkbox",
        options: ["ACTIVE", "INACTIVE"],
      },
    ],
    [rows],
  );
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const category = filters.category as string[] | undefined;
    const units = filters.unit as string[] | undefined;
    const tracked = filters.quantityTracked as string[] | undefined;
    const status = filters.status as string[] | undefined;
    return rows.filter((item) => {
      const displayTracked = item.quantityTracked ? "Yes" : "No";
      return (
        (!query ||
          [item.sku, item.name, item.category ?? "", item.unit ?? ""].some(
            (value) => value.toLowerCase().includes(query),
          )) &&
        (!category?.length ||
          (item.category !== null && category.includes(item.category))) &&
        (!units?.length || (item.unit !== null && units.includes(item.unit))) &&
        (!tracked?.length || tracked.includes(displayTracked)) &&
        (!status?.length || status.includes(item.status))
      );
    });
  }, [filters, rows, search]);
  const selected = rows.filter(({ id }) => selectedIds.has(id));
  const allSelected =
    visibleRows.length > 0 &&
    visibleRows.every(({ id }) => selectedIds.has(id));
  const resetCreate = () => {
    setSku("");
    setAutoSku(false);
    setReservedId(null);
    setReservingSku(false);
    setName("");
    setCategoryId("");
    setUnit("each");
    setQuantityTracked(true);
    setServerError("");
    validation.reset();
  };
  const requestError = async (response: Response, fallback: string) => {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    return body?.message ?? fallback;
  };
  const toggleAutoSku = async () => {
    setServerError("");
    if (autoSku) {
      setAutoSku(false);
      setReservedId(null);
      setSku("");
      return;
    }
    setReservingSku(true);
    try {
      const response = await fetch("/api/inventory/items/reserve-sku", {
        method: "POST",
      });
      if (!response.ok) {
        setServerError(
          await requestError(
            response,
            "An automatic SKU could not be reserved",
          ),
        );
        return;
      }
      const reservation = (await response.json()) as ItemSkuReservationDto;
      setReservedId(reservation.id);
      setSku(reservation.sku);
      setAutoSku(true);
    } finally {
      setReservingSku(false);
    }
  };
  const create = async () => {
    setServerError("");
    if (!validation.attempt()) return;
    if (autoSku && reservedId === null) {
      setServerError("Generate an automatic SKU before creating the item");
      return;
    }
    setSaving(true);
    try {
      const payload: ItemCreateRequestDto = {
        ...(autoSku
          ? { reservedId: reservedId! }
          : { sku: sku.trim().toUpperCase() }),
        name: name.trim(),
        categoryId: Number(categoryId),
        unit: quantityTracked && unit ? unit : null,
        quantityTracked,
      };
      const response = await fetch("/api/inventory/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setServerError(
          await requestError(response, "The item could not be created"),
        );
        return;
      }
      const item = (await response.json()) as ItemResponseDto;
      setRows((current) =>
        [
          ...current,
          {
            id: item.id,
            sku: item.sku,
            name: item.name,
            category: item.category?.name ?? null,
            unit: item.unit,
            quantityTracked: item.quantityTracked,
            unitsOnHand: 0,
            status: item.status,
          },
        ].sort((a, b) => a.sku.localeCompare(b.sku)),
      );
      resetCreate();
      setShowCreate(false);
      setToast(`Item ${item.sku} created`);
    } finally {
      setSaving(false);
    }
  };
  const batch = async (action: "activate" | "deactivate") => {
    setServerError("");
    const response = await fetch(`/api/inventory/items/batch/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skus: selected.map(({ sku: code }) => code) }),
    });
    if (!response.ok) {
      setServerError(
        await requestError(
          response,
          `The selected items could not be ${action}d`,
        ),
      );
      return;
    }
    const changed = (await response.json()) as ItemResponseDto[];
    const statusBySku = new Map(changed.map((item) => [item.sku, item.status]));
    setRows((current) =>
      current.map((item) => ({
        ...item,
        status: statusBySku.get(item.sku) ?? item.status,
      })),
    );
    setSelectedIds(new Set());
    setToast(
      `${selected.length} item${selected.length === 1 ? "" : "s"} ${action}d`,
    );
  };
  const requestDelete = async () => {
    setServerError("");
    const response = await fetch("/api/inventory/items/batch/deletion-impact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skus: selected.map(({ sku }) => sku) }),
    });
    if (!response.ok) {
      setServerError(
        await requestError(response, "The selected items could not be checked"),
      );
      return;
    }
    const impacts = (await response.json()) as ItemDeletionImpactDto[];
    if (impacts.length) {
      setServerError(
        "The stock must be issued or written off before the item can be deleted",
      );
      return;
    }
    setShowDelete(true);
  };
  const deleteSelected = async () => {
    setServerError("");
    const response = await fetch("/api/inventory/items/batch/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skus: selected.map(({ sku }) => sku) }),
    });
    if (!response.ok) {
      setServerError(
        await requestError(response, "The selected items could not be deleted"),
      );
      return;
    }
    const ids = new Set(selected.map(({ id }) => id));
    setRows((current) => current.filter(({ id }) => !ids.has(id)));
    setSelectedIds(new Set());
    setShowDelete(false);
    setToast(
      `${selected.length} item${selected.length === 1 ? "" : "s"} deleted`,
    );
  };
  const changeCategory = async () => {
    setServerError("");
    if (!changeCategoryId) {
      setServerError("Select an item category");
      return;
    }
    setChangingCategory(true);
    try {
      const response = await fetch(
        "/api/inventory/items/batch/change-category",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skus: selected.map(({ sku }) => sku),
            categoryId: Number(changeCategoryId),
          }),
        },
      );
      if (!response.ok) {
        setServerError(
          await requestError(
            response,
            "The selected items could not be updated",
          ),
        );
        return;
      }
      const changed = (await response.json()) as ItemResponseDto[];
      const categoryBySku = new Map(
        changed.map((item) => [item.sku, item.category?.name ?? null]),
      );
      setRows((current) =>
        current.map((item) =>
          categoryBySku.has(item.sku)
            ? { ...item, category: categoryBySku.get(item.sku) ?? null }
            : item,
        ),
      );
      const count = selected.length;
      setSelectedIds(new Set());
      setChangeCategoryId("");
      setShowCategoryChange(false);
      setToast(`${count} item${count === 1 ? "" : "s"} moved to category`);
    } finally {
      setChangingCategory(false);
    }
  };
  const removeFilter = (key: string) =>
    setFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });

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
              box
            </span>
          </div>
          <h1
            className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
          >
            Items
          </h1>
          <div className={layout.slotTitleByline}>
            <p className={typography.headingByline}>
              Physical inventory items that can be stocked, purchased, consumed,
              or sold.
            </p>
          </div>
        </div>
        <div className={layout.slotActions}>
          <Button
            variant="primary"
            icon="add"
            className={layout.slotPrimaryAction}
            onClick={() => setShowCreate(true)}
          >
            Add Item
          </Button>
        </div>
        <div className={layout.slotAlert}>
          <ValidationAlert
            errors={serverError ? [serverError] : []}
            visible={!!serverError}
            onDismiss={() => setServerError("")}
          />
        </div>
      </header>
      {showCreate ? (
        <div className={modalStyles.backdrop}>
          <div
            className={modalStyles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={modalStyles.header}>
              <h3 className={typography.contentTitle}>Add Item</h3>
              <Button
                variant="plain"
                icon="close"
                title="Close"
                onClick={() => {
                  resetCreate();
                  setShowCreate(false);
                }}
              />
            </div>
            <div className={modalStyles.body}>
              <ValidationAlert
                errors={[
                  ...(validation.showErrors ? validation.errors : []),
                  ...(serverError ? [serverError] : []),
                ]}
                visible={validation.showErrors || !!serverError}
                onDismiss={() => {
                  validation.dismiss();
                  setServerError("");
                }}
              />
              <div className={styles.createFields}>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>SKU</label>
                  <div className={styles.inlineField}>
                    <Input
                      value={sku}
                      disabled={autoSku || reservingSku}
                      invalid={validation.hasError("sku")}
                      onChange={(event) =>
                        setSku(event.target.value.toUpperCase())
                      }
                    />
                    <Button
                      variant="secondary"
                      type="button"
                      disabled={reservingSku}
                      onClick={() => {
                        void toggleAutoSku();
                      }}
                    >
                      {reservingSku
                        ? "Reserving..."
                        : autoSku
                          ? "Enter Manually"
                          : "Auto Generate"}
                    </Button>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Name</label>
                  <Input
                    value={name}
                    invalid={validation.hasError("name")}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Category</label>
                  <SearchableSelect
                    value={categoryId}
                    onChange={setCategoryId}
                    hasError={validation.hasError("categoryId")}
                    options={categories.map((category) => ({
                      value: String(category.id),
                      label: category.name,
                      code: category.code,
                    }))}
                    placeholder="Select a category"
                  />
                </div>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Unit</label>
                  <SearchableSelect
                    value={unit}
                    onChange={(value) => setUnit(value as Unit)}
                    hasError={validation.hasError("unit")}
                    options={UNIT_OPTIONS}
                    searchable={false}
                    disabled={!quantityTracked}
                    placeholder={
                      quantityTracked ? "Select a unit" : "Not applicable"
                    }
                  />
                </div>
                <label className={styles.checkboxField}>
                  <Checkbox
                    checked={quantityTracked}
                    onChange={(checked) => {
                      setQuantityTracked(checked);
                      if (!checked) setUnit("");
                    }}
                  />
                  <span>Quantity Tracked</span>
                </label>
              </div>
            </div>
            <div className={modalStyles.footer}>
              <Button
                variant="cancel"
                onClick={() => {
                  resetCreate();
                  setShowCreate(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={saving || reservingSku}
                onClick={() => {
                  void create();
                }}
              >
                {saving ? "Creating..." : "Create Item"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      {showCategoryChange ? (
        <div className={modalStyles.backdrop}>
          <div
            className={modalStyles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={modalStyles.header}>
              <h3 className={typography.contentTitle}>Change Category</h3>
              <Button
                variant="plain"
                icon="close"
                title="Close"
                onClick={() => {
                  setServerError("");
                  setChangeCategoryId("");
                  setShowCategoryChange(false);
                }}
              />
            </div>
            <div className={modalStyles.body}>
              <ValidationAlert
                errors={serverError ? [serverError] : []}
                visible={!!serverError}
                onDismiss={() => setServerError("")}
              />
              <div className={styles.field}>
                <label className={typography.fieldLabel}>Category</label>
                <SearchableSelect
                  value={changeCategoryId}
                  onChange={setChangeCategoryId}
                  hasError={
                    serverError === "Select an item category" &&
                    !changeCategoryId
                  }
                  options={categories.map((category) => ({
                    value: String(category.id),
                    label: category.name,
                    code: category.code,
                  }))}
                  placeholder="Select a category"
                />
              </div>
              <p>
                Change the category for {selected.length} selected item
                {selected.length === 1 ? "" : "s"}.
              </p>
            </div>
            <div className={modalStyles.footer}>
              <Button
                variant="cancel"
                onClick={() => {
                  setServerError("");
                  setChangeCategoryId("");
                  setShowCategoryChange(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={changingCategory}
                onClick={() => {
                  void changeCategory();
                }}
              >
                {changingCategory ? "Changing..." : "Change Category"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
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
        <div
          className={`${layout.slotToolbarRight} ${inventoryListStyles.toolbarLayer}`}
        >
          <div className={listStyles.toolbarActions}>
            <Button
              variant="secondary"
              icon="check_circle"
              disabled={!selected.some(({ status }) => status === "INACTIVE")}
              onClick={() => {
                void batch("activate");
              }}
            >
              Activate
            </Button>
            <Button
              variant="secondary"
              icon="block"
              disabled={!selected.some(({ status }) => status === "ACTIVE")}
              onClick={() => {
                void batch("deactivate");
              }}
            >
              Deactivate
            </Button>
            <Button
              variant="secondary-destructive"
              icon="delete"
              disabled={!selected.length}
              title="Delete selected"
              onClick={() => {
                void requestDelete();
              }}
            />
            <Button
              variant="secondary"
              icon="category"
              disabled={!selected.length}
              onClick={() => {
                setServerError("");
                setShowCategoryChange(true);
              }}
            >
              Change Category
            </Button>
            <div className={listStyles.divider} />
            <InventoryListActions
              rows={rows}
              visibleRows={visibleRows}
              selectedIds={selectedIds}
              filename="inventory_items"
              columns={[
                { key: "sku", label: "SKU" },
                { key: "name", label: "Item Name" },
                { key: "category", label: "Category" },
                { key: "unit", label: "Unit" },
                { key: "quantityTracked", label: "Quantity Tracked" },
                { key: "unitsOnHand", label: "Units on hand" },
                { key: "status", label: "Status" },
              ]}
              toExportRow={(row) => ({
                ...row,
                quantityTracked: row.quantityTracked ? "Yes" : "No",
              })}
            />
          </div>
        </div>
      </div>
      {search.trim() || Object.keys(filters).length ? (
        <div className={layout.chipsRow}>
          <div className={layout.slotChips}>
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
            isSomeSelected={
              !allSelected && visibleRows.some(({ id }) => selectedIds.has(id))
            }
            onSelectAll={() =>
              setSelectedIds(
                allSelected
                  ? new Set()
                  : new Set(visibleRows.map(({ id }) => id)),
              )
            }
            onSelectOne={(id) =>
              setSelectedIds((current) => {
                const next = new Set(current);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
              })
            }
            onRowClick={(row) =>
              router.push(`/inventory/items/${encodeURIComponent(row.sku)}`)
            }
            currentPage={1}
            totalPages={1}
            onPageChange={() => undefined}
            totalCount={rows.length}
            filteredCount={visibleRows.length}
            itemLabel="items"
            hasData={rows.length > 0}
            emptyIcon="box"
            emptyTitle="No items"
            emptyText="Add the first inventory item"
            emptyFilterText="No items match the current filters"
            mobileRender={(row) => (
              <div>
                <strong>{row.name}</strong>
                <div>
                  {row.sku} · {row.category ?? "Uncategorised"} · {row.status}
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Items"
        message={`Permanently delete ${selected.length} selected item${selected.length === 1 ? "" : "s"}?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => {
          setShowDelete(false);
        }}
        onConfirm={() => {
          void deleteSelected();
        }}
      />
      <Toast isVisible={!!toast} onClose={() => setToast("")} message={toast} />
    </div>
  );
}
