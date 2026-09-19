"use client";
import { useEffect, useState, useTransition } from "react";
import { Badge, DataTable, FilterChips, FilterPanel, Input, ValidationAlert, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import list from "@voyzu/ui-style/css-modules/list.module.css";
import styles from "./inventory-selection.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import { ProductModal } from "./ProductModal";
import { createProductsFromInventoryAction, productCreationInventoryItemsAction } from "../server/actions/product.actions";

type InventoryRow = NonNullable<Awaited<ReturnType<typeof productCreationInventoryItemsAction>>["items"]>[number];
const columns: DataTableColumn<InventoryRow>[] = [
  { key: "sku", label: "SKU", width: "15%", render: (row) => <span className={list.codeCell}>{row.sku}</span> },
  { key: "name", label: "Item Name", width: "25%", render: (row) => <span className={list.nameCell}>{row.name}</span> },
  { key: "category", label: "Category", width: "17%", render: (row) => row.category ?? "—" },
  { key: "unit", label: "Unit", width: "8%", render: (row) => row.unit ?? "—" },
  { key: "quantityTracked", label: "Quantity Tracked", width: "13%", align: "center", render: (row) => row.quantityTracked ? "Yes" : "No" },
  { key: "unitsOnHand", label: "Units on hand", width: "12%", align: "right", render: (row) => row.unitsOnHand },
  { key: "status", label: "Status", width: "10%", align: "center", render: (row) => <Badge variant="soft" size="x-small" color="success">{row.status}</Badge> },
];
export function CreateProductsFromInventoryModal({ onClose, onCreated }: { onClose: () => void; onCreated: (count: number) => void }) {
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({ status: ["ACTIVE"] });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    let cancelled = false;
    productCreationInventoryItemsAction().then((result) => {
      if (cancelled) return;
      if (result.items) setItems(result.items); else setError(result.error ?? "Unable to load inventory items.");
    }).catch(() => { if (!cancelled) setError("Unable to load inventory items."); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  const tabs: FilterTab[] = [
    { key: "category", label: "Category", type: "checkbox", options: [...new Set(items.flatMap((item) => item.category ? [item.category] : []))].sort() },
    { key: "unit", label: "Unit", type: "checkbox", options: [...new Set(items.flatMap((item) => item.unit ? [item.unit] : []))].sort() },
    { key: "quantityTracked", label: "Quantity Tracked", type: "checkbox", options: ["Yes", "No"] },
    { key: "status", label: "Status", type: "checkbox", options: ["ACTIVE"] },
  ];
  const visible = items.filter((item) => {
    const query = search.trim().toLowerCase();
    if (query && ![item.sku, item.name, item.category, item.unit].some((value) => value?.toLowerCase().includes(query))) return false;
    return (["category", "unit", "quantityTracked", "status"] as const).every((key) => {
      const selected = filters[key] as string[] | undefined;
      const value = key === "quantityTracked" ? item.quantityTracked ? "Yes" : "No" : item[key];
      return !selected?.length || (value !== null && selected.includes(value));
    });
  });
  const allSelected = visible.length > 0 && visible.every((row) => selectedIds.has(row.id));
  const removeFilter = (key: string) => setFilters((current) => { const next = { ...current }; delete next[key]; return next; });
  const toggle = (id: number) => { if (!pending) setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; }); };
  const save = () => {
    setError("");
    if (!selectedIds.size) { setError("Select at least one inventory item."); return; }
    startTransition(async () => {
      try { const result = await createProductsFromInventoryAction([...selectedIds]); if (result.count) onCreated(result.count); else setError(result.error ?? "Unable to create products."); }
      catch { setError("Unable to create products. Please try again."); }
    });
  };
  return <ProductModal wide title="Create from Inventory" submitLabel="Create Products" pending={pending || loading} onClose={onClose} onSubmit={save}>
    <div className={detail.stack}>
      <ValidationAlert errors={error ? [error] : []} visible={!!error} onDismiss={() => setError("")} />
      <div className={styles.toolbar}>
        <FilterPanel tabs={tabs} filters={filters} onApply={setFilters} onClear={() => setFilters({})} onRemoveFilter={removeFilter} showChips={false} />
        <Input containerClassName={styles.search} search aria-label="Search inventory items" placeholder="Search items..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className={styles.chips}><FilterChips tabs={tabs} filters={filters} onRemoveFilter={removeFilter} onClear={() => { setFilters({}); setSearch(""); }} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => setSearch("") }] : []} /></div>
      <DataTable columns={columns} rows={visible} selectedIds={selectedIds} isAllSelected={allSelected} isSomeSelected={!allSelected && visible.some((row) => selectedIds.has(row.id))}
        onSelectAll={() => { if (!pending) setSelectedIds((current) => { const next = new Set(current); visible.forEach((row) => allSelected ? next.delete(row.id) : next.add(row.id)); return next; }); }}
        onSelectOne={toggle} onRowClick={(row) => toggle(row.id)} currentPage={1} totalPages={1} onPageChange={() => undefined}
        totalCount={items.length} filteredCount={visible.length} itemLabel="items" hasData={items.length > 0} emptyIcon="box" emptyTitle={loading ? "Loading inventory items..." : "No active inventory items"} emptyText="" emptyFilterText="No items match the current filters"
        mobileRender={(row) => <div><strong>{row.name}</strong><div>{row.sku} · {row.category ?? "Uncategorised"} · {row.unit ?? "—"}</div></div>} />
      <p>{selectedIds.size} product{selectedIds.size === 1 ? "" : "s"} will be created</p>
    </div>
  </ProductModal>;
}
