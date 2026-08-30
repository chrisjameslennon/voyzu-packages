"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Breadcrumbs,
  Button,
  ConfirmDialog,
  DataTable,
  DropdownMenu,
  FilterChips,
  FilterPanel,
  Input,
  Toast,
  ValidationAlert,
  maxLength,
  pattern,
  required,
  useFormValidation,
  type DataTableColumn,
  type DropdownMenuItem,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import type { TemplateCreateRequestDto, TemplateResponseDto } from "../../types";
import styles from "./template.module.css";

const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]*$/;
const TOAST_KEY = "voyzu.template.toast";
const columns: DataTableColumn<TemplateResponseDto>[] = [
  { key: "code", label: "Code", width: "14rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "description", label: "Description", width: "auto", render: (row) => row.description ?? "-" },
  {
    key: "status",
    label: "Status",
    width: "8rem",
    align: "center",
    render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge>,
  },
];

export function TemplatesList({ templates }: { templates: TemplateResponseDto[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(templates);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [serverError, setServerError] = useState("");
  const [listError, setListError] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const validation = useFormValidation(() => ({
    code: { label: "code", value: code, rules: [required(), maxLength(40), pattern(CODE_PATTERN, "Use uppercase letters, numbers, underscores or hyphens")] },
    description: { label: "description", value: description, rules: [maxLength(200)] },
  }));
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] },
  ], []);
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const statuses = filters.status as string[] | undefined;
    return rows.filter((row) => (
      (!query || [row.code, row.description ?? ""].some((value) => value.toLowerCase().includes(query)))
      && (!statuses?.length || statuses.includes(row.status))
    ));
  }, [filters, rows, search]);
  const selected = rows.filter(({ id }) => selectedIds.has(id));
  const allSelected = visibleRows.length > 0 && visibleRows.every(({ id }) => selectedIds.has(id));

  useEffect(() => {
    const stored = sessionStorage.getItem(TOAST_KEY);
    if (!stored) return;
    sessionStorage.removeItem(TOAST_KEY);
    setToastMessage(stored);
  }, []);
  useEffect(() => setRows(templates), [templates]);

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      router.refresh();
      setRefreshing(false);
    }, 500);
  };

  const exportCsv = async (
    exportRows: TemplateResponseDto[],
    suffix: string,
  ) => {
    const filename = `templates_${suffix}`;
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "code", label: "Code" },
          { key: "description", label: "Description" },
          { key: "status", label: "Status" },
        ],
        rows: exportRows.map((row) => ({
          code: row.code,
          description: row.description ?? "",
          status: row.status,
        })),
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

  const exportItems = useMemo<DropdownMenuItem[]>(
    () => [
      {
        value: "selected",
        label: `Selected (${selected.length})`,
        icon: "check_box",
        disabled: selected.length === 0,
        onSelect: () => void exportCsv(selected, "selected"),
      },
      {
        value: "current-view",
        label: `Current view (${visibleRows.length})`,
        icon: "visibility",
        disabled: visibleRows.length === 0,
        onSelect: () => void exportCsv(visibleRows, "current_view"),
      },
      {
        value: "full-dataset",
        label: `Full dataset (${rows.length})`,
        icon: "database",
        disabled: rows.length === 0,
        onSelect: () => void exportCsv(rows, "full_dataset"),
      },
    ],
    [rows, selected, visibleRows],
  );

  const resetCreate = () => {
    setCode("");
    setDescription("");
    setServerError("");
    validation.reset();
  };

  const createTemplate = async () => {
    setServerError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload: TemplateCreateRequestDto = { code: code.trim().toUpperCase(), description: description.trim() || null };
      const response = await fetch("/api/template", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        setServerError(body?.message ?? "The template could not be created");
        return;
      }
      const created = await response.json() as TemplateResponseDto;
      setRows((current) => [...current, created].sort((a, b) => a.code.localeCompare(b.code)));
      resetCreate();
      setShowCreate(false);
      setToastMessage(`Template ${created.code} created`);
    } finally {
      setSaving(false);
    }
  };

  const transitionSelected = async (action: "activate" | "deactivate") => {
    setListError("");
    const eligible = selected.filter(({ status }) => status === (action === "activate" ? "INACTIVE" : "ACTIVE"));
    const response = await fetch("/api/template/batches/activation", { method: action === "activate" ? "PUT" : "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codes: eligible.map(({ code }) => code) }) });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string } | null;
      setListError(body?.message ?? `The selected templates could not be ${action === "activate" ? "activated" : "deactivated"}`);
      return;
    }
    const changed = await response.json() as TemplateResponseDto[];
    const byCode = new Map(changed.map((row) => [row.code, row]));
    setRows((current) => current.map((row) => byCode.get(row.code) ?? row));
    setSelectedIds(new Set());
    const label = changed.length === 1 ? "Template" : "Templates";
    setToastMessage(`${label} ${action === "activate" ? "activated" : "deactivated"}`);
  };

  const deleteSelected = async () => {
    setListError("");
    const response = await fetch("/api/template/batches", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codes: selected.map(({ code }) => code) }) });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string } | null;
      setListError(body?.message ?? "The selected templates could not be deleted");
      setShowDelete(false);
      return;
    }
    const deleted = new Set(selected.map(({ id }) => id));
    setRows((current) => current.filter(({ id }) => !deleted.has(id)));
    setSelectedIds(new Set());
    setShowDelete(false);
    setToastMessage(`Deleted ${deleted.size} template${deleted.size === 1 ? "" : "s"}`);
  };

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>description</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Template</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>View and manage templates</p></div>
        </div>
        <div className={layout.slotActions}><Button variant="primary" icon="add" className={layout.slotPrimaryAction} onClick={() => setShowCreate(true)}>Add Template</Button></div>
        <div className={layout.slotAlert}><ValidationAlert errors={listError ? [listError] : []} visible={!!listError} onDismiss={() => setListError("")} /></div>
      </header>

      {showCreate ? (
        <div className={modalStyles.backdrop}>
          <div className={modalStyles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={modalStyles.header}><h3 className={typography.contentTitle}>Add Template</h3><Button variant="plain" icon="close" title="Close" onClick={() => { resetCreate(); setShowCreate(false); }} /></div>
            <div className={modalStyles.body}>
              <ValidationAlert errors={[...validation.errors, ...(serverError ? [serverError] : [])]} visible={validation.showErrors || !!serverError} onDismiss={() => { validation.dismiss(); setServerError(""); }} />
              <div className={styles.createFields}>
                <div className={styles.field}><label className={typography.fieldLabel}>Code</label><Input value={code} maxLength={40} onChange={(event) => setCode(event.target.value.toUpperCase())} /></div>
                <div className={styles.field}><label className={typography.fieldLabel}>Description</label><Input value={description} maxLength={200} onChange={(event) => setDescription(event.target.value)} /></div>
              </div>
            </div>
            <div className={modalStyles.footer}><Button variant="secondary" onClick={() => { resetCreate(); setShowCreate(false); }}>Cancel</Button><Button variant="primary" disabled={saving} onClick={() => { void createTemplate(); }}>{saving ? "Creating..." : "Create"}</Button></div>
          </div>
        </div>
      ) : null}

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={filters} onApply={setFilters} onClear={() => setFilters({})} onRemoveFilter={(key) => setFilters((current) => { const next = { ...current }; delete next[key]; return next; })} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search templates..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className={layout.slotToolbarRight}><div className={listStyles.toolbarActions}><Button variant="secondary" icon="check_circle" disabled={!selected.some(({ status }) => status === "INACTIVE")} title="Activate selected" onClick={() => { void transitionSelected("activate"); }}>Activate</Button><Button variant="secondary" icon="block" disabled={!selected.some(({ status }) => status === "ACTIVE")} title="Deactivate selected" onClick={() => { void transitionSelected("deactivate"); }}>Deactivate</Button><Button variant="secondary-destructive" icon="delete" disabled={!selected.length} title="Delete selected" onClick={() => setShowDelete(true)} /><Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={refresh} /><DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} /></div></div>
      </div>

      {(search.trim() || Object.keys(filters).length) ? <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={filters} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => setSearch("") }] : []} onClear={() => { setFilters({}); setSearch(""); }} onRemoveFilter={(key) => setFilters((current) => { const next = { ...current }; delete next[key]; return next; })} /></div></div> : null}

      <div className={layout.listBody}><div className={layout.slotBody}><DataTable columns={columns} rows={visibleRows} selectedIds={selectedIds} isAllSelected={allSelected} isSomeSelected={!allSelected && visibleRows.some(({ id }) => selectedIds.has(id))} onSelectAll={() => setSelectedIds(allSelected ? new Set() : new Set(visibleRows.map(({ id }) => id)))} onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })} onRowClick={(row) => router.push(`/template/${encodeURIComponent(row.code)}`)} currentPage={1} totalPages={1} onPageChange={() => undefined} totalCount={rows.length} filteredCount={visibleRows.length} itemLabel="templates" hasData={rows.length > 0} emptyIcon="description" emptyTitle="No template records" emptyText="Create the first template record" emptyFilterText="No templates match the current filters" mobileRender={(row) => <div><strong>{row.code}</strong><div>{row.description ?? "No description"} · {row.status}</div></div>} /></div></div>
      <ConfirmDialog isOpen={showDelete} title="Delete Templates" message={`Permanently delete ${selected.length} selected template${selected.length === 1 ? "" : "s"}?`} confirmLabel="Delete" confirmVariant="danger" onClose={() => setShowDelete(false)} onConfirm={() => { void deleteSelected(); }} />
      <Toast isVisible={!!toastMessage} onClose={() => setToastMessage("")} message={toastMessage} />
    </div>
  );
}
