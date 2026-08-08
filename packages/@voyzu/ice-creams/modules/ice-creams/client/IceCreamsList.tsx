"use client";

import { useMemo, useState } from "react";
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
  SearchableSelect,
  ValidationAlert,
  required,
  pattern,
  useFormValidation,
  type DataTableColumn,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import type {
  IceCreamCreateRequestDto,
  IceCreamFlavorResponseDto,
  IceCreamResponseDto,
} from "../../types";
import styles from "./ice-creams.module.css";

const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]*$/;
const columns: DataTableColumn<IceCreamResponseDto>[] = [
  { key: "code", label: "Code", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", width: "18rem", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  { key: "flavor", label: "Flavour", width: "16rem", render: (row) => row.flavor.name },
  { key: "supplier", label: "Supplier", width: "18rem" },
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

export function IceCreamsList({
  iceCreams,
  flavors,
}: {
  iceCreams: IceCreamResponseDto[];
  flavors: IceCreamFlavorResponseDto[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(iceCreams);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [flavorCode, setFlavorCode] = useState("");
  const [supplier, setSupplier] = useState("");

  const validation = useFormValidation(() => ({
    code: { label: "code", value: code, rules: [required(), pattern(CODE_PATTERN, "Use uppercase letters, numbers, underscores or hyphens")] },
    name: { label: "name", value: name, rules: [required()] },
    flavorCode: { label: "flavour", value: flavorCode, rules: [required()] },
    supplier: { label: "supplier", value: supplier, rules: [required()] },
  }));

  const activeFlavors = useMemo(
    () => flavors.filter(({ status }) => status === "ACTIVE"),
    [flavors],
  );
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "flavor", label: "Flavour", type: "checkbox", options: [...new Set(rows.map((row) => row.flavor.name))].sort() },
    { key: "supplier", label: "Supplier", type: "checkbox", options: [...new Set(rows.map((row) => row.supplier))].sort() },
    { key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] },
  ], [rows]);
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const flavorFilter = filters.flavor as string[] | undefined;
    const supplierFilter = filters.supplier as string[] | undefined;
    const statusFilter = filters.status as string[] | undefined;
    return rows.filter((row) => (
      (!query || [row.code, row.name, row.flavor.name, row.supplier].some((value) => value.toLowerCase().includes(query)))
      && (!flavorFilter?.length || flavorFilter.includes(row.flavor.name))
      && (!supplierFilter?.length || supplierFilter.includes(row.supplier))
      && (!statusFilter?.length || statusFilter.includes(row.status))
    ));
  }, [filters, rows, search]);
  const selected = rows.filter(({ id }) => selectedIds.has(id));
  const allSelected = visibleRows.length > 0 && visibleRows.every(({ id }) => selectedIds.has(id));

  const resetCreate = () => {
    setCode("");
    setName("");
    setFlavorCode("");
    setSupplier("");
    setServerError("");
    validation.reset();
  };

  const createIceCream = async () => {
    setServerError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload: IceCreamCreateRequestDto = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        flavorCode,
        supplier: supplier.trim(),
      };
      const response = await fetch("/api/ice-creams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        setServerError(body?.message ?? "The ice cream could not be created");
        return;
      }
      const created = await response.json() as IceCreamResponseDto;
      setRows((current) => [...current, created].sort((a, b) => a.code.localeCompare(b.code)));
      resetCreate();
      setShowCreate(false);
    } finally {
      setSaving(false);
    }
  };

  const transitionSelected = async (action: "activate" | "deactivate") => {
    const response = await fetch("/api/ice-creams/batches/activation", {
      method: action === "activate" ? "PUT" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: selected.map(({ code }) => code) }),
    });
    if (!response.ok) return;
    const changed = await response.json() as IceCreamResponseDto[];
    const byCode = new Map(changed.map((row) => [row.code, row]));
    setRows((current) => current.map((row) => byCode.get(row.code) ?? row));
    setSelectedIds(new Set());
  };

  const deleteSelected = async () => {
    const response = await fetch("/api/ice-creams/batches", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: selected.map(({ code }) => code) }),
    });
    if (!response.ok) return;
    const deleted = new Set(selected.map(({ id }) => id));
    setRows((current) => current.filter(({ id }) => !deleted.has(id)));
    setSelectedIds(new Set());
    setShowDelete(false);
  };

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>icecream</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Ice Creams</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Manage products, flavours, suppliers and availability.</p></div>
        </div>
        <div className={layout.slotActions}>
          <Button variant="primary" icon="add" onClick={() => setShowCreate((current) => !current)}>Add Ice Cream</Button>
        </div>
      </header>

      {showCreate ? (
        <div className={modalStyles.backdrop}>
          <div className={modalStyles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={modalStyles.header}>
              <h3 className={typography.contentTitle}>Add Ice Cream</h3>
              <Button variant="plain" icon="close" type="button" title="Close" onClick={() => { resetCreate(); setShowCreate(false); }} />
            </div>
            <div className={modalStyles.body}>
              <ValidationAlert errors={[...validation.errors, ...(serverError ? [serverError] : [])]} visible={validation.showErrors || !!serverError} onDismiss={() => { validation.dismiss(); setServerError(""); }} />
              <div className={styles.createFields}>
                <div className={styles.field}><label className={typography.fieldLabel}>Code</label><Input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} /></div>
                <div className={styles.field}><label className={typography.fieldLabel}>Name</label><Input value={name} onChange={(event) => setName(event.target.value)} /></div>
                <div className={styles.field}><label className={typography.fieldLabel}>Flavour</label><SearchableSelect value={flavorCode} onChange={setFlavorCode} options={activeFlavors.map((flavor) => ({ value: flavor.code, label: flavor.name, code: flavor.code }))} /></div>
                <div className={styles.field}><label className={typography.fieldLabel}>Supplier</label><Input value={supplier} onChange={(event) => setSupplier(event.target.value)} /></div>
              </div>
            </div>
            <div className={modalStyles.footer}>
              <Button variant="secondary" onClick={() => { resetCreate(); setShowCreate(false); }}>Cancel</Button>
              <Button variant="primary" disabled={saving} onClick={() => { void createIceCream(); }}>{saving ? "Creating..." : "Create"}</Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={filters} onApply={setFilters} onClear={() => setFilters({})} onRemoveFilter={(key) => setFilters((current) => { const next = { ...current }; delete next[key]; return next; })} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search placeholder="Search ice creams..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary" icon="check_circle" disabled={!selected.some(({ status }) => status === "INACTIVE")} onClick={() => { void transitionSelected("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={!selected.some(({ status }) => status === "ACTIVE")} onClick={() => { void transitionSelected("deactivate"); }}>Deactivate</Button>
            <Button variant="secondary-destructive" icon="delete" disabled={!selected.length} onClick={() => setShowDelete(true)} />
          </div>
        </div>
      </div>

      {(search.trim() || Object.keys(filters).length) ? (
        <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={filters} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => setSearch("") }] : []} onClear={() => { setFilters({}); setSearch(""); }} onRemoveFilter={(key) => setFilters((current) => { const next = { ...current }; delete next[key]; return next; })} /></div></div>
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
            onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })}
            onRowClick={(row) => router.push(`/ice-creams/${encodeURIComponent(row.code)}`)}
            currentPage={1}
            totalPages={1}
            onPageChange={() => undefined}
            totalCount={rows.length}
            filteredCount={visibleRows.length}
            itemLabel="ice creams"
            hasData={rows.length > 0}
            emptyIcon="icecream"
            emptyTitle="No ice creams"
            emptyText="Create the first ice cream"
            emptyFilterText="No ice creams match the current filters"
            mobileRender={(row) => <div><strong>{row.name}</strong><div>{row.code} · {row.flavor.name} · {row.status}</div></div>}
          />
        </div>
      </div>

      <ConfirmDialog isOpen={showDelete} title="Delete Ice Creams" message={`Permanently delete ${selected.length} selected ice cream${selected.length === 1 ? "" : "s"}?`} confirmLabel="Delete" confirmVariant="danger" onClose={() => setShowDelete(false)} onConfirm={() => { void deleteSelected(); }} />
    </div>
  );
}
