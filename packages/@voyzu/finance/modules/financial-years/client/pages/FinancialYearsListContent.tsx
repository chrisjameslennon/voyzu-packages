"use client";

import { CompanyPageTitleBadges, financeApiUrl, getStatusSemanticColor, StandardSettingsReadOnlyAlert } from "@voyzu/finance/common/client";
import { Close, Delete, Open, Reopen, type FinancialYearOperationState } from "../../domain/operation-policy";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { FinancialYearCreateRequestDto, FinancialYearResponseDto, FinancialYearStatus } from "@voyzu/finance/types/modules/financial-years";
import { Badge, Breadcrumbs, Button, ConfirmDialog, DataTable, DatePicker, DropdownMenu, FilterChips, FilterPanel, Input, SearchableSelect, Toast, ValidationAlert, type DataTableColumn, type DropdownMenuItem, type FilterState, type FilterTab } from "@voyzu/ui-components";
import { pattern, required, useFormValidation } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const ITEMS_PER_PAGE = 100;
const CODE_PATTERN = /^[A-Z0-9_-]+$/;
const STATUS_OPTIONS = [
  { value: "PLANNED", label: "PLANNED" },
  { value: "OPEN", label: "OPEN" },
  { value: "INACTIVE", label: "INACTIVE" },
];
const SIMPLE_LIFECYCLE_BLOCKERS = new Set([
  "FINANCIAL_YEAR_CANNOT_BE_OPENED_FROM_STATUS",
  "FINANCIAL_YEAR_CANNOT_BE_REOPENED_FROM_STATUS",
  "FINANCIAL_YEAR_CANNOT_BE_CLOSED_FROM_STATUS",
]);

function complexBlockerMessage(blockers: readonly { code: string; message: string }[]) {
  return blockers.find((blocker) => !SIMPLE_LIFECYCLE_BLOCKERS.has(blocker.code))?.message;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

const columns: DataTableColumn<FinancialYearResponseDto>[] = [
  { key: "code", label: "Code", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", width: "16rem", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  { key: "startDate", label: "Start Date", width: "11rem", render: (row) => formatDate(row.startDate) },
  { key: "endDate", label: "End Date", width: "11rem", render: (row) => formatDate(row.endDate) },
  { key: "hasPostings", label: "Has Postings", width: "9rem", align: "center", render: (row) => row.hasPostings ? <span className={`material-symbols-outlined ${listStyles.successIcon}`} aria-label="Has postings">check</span> : "-" },
  { key: "status", label: "Status", width: "9rem", align: "center", render: (row) => <Badge variant="soft" size="small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge> },
];

export function FinancialYearsListContent({
  years,
  companyId,
  readOnly = false,
}: {
  years: FinancialYearResponseDto[];
  companyId?: number;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState(years);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [lifecycleConfirmation, setLifecycleConfirmation] = useState<"open" | "close" | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [lifecycleBusy, setLifecycleBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [listError, setListError] = useState("");

  useEffect(() => {
    setData(years);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [years]);

  const statuses = useMemo(() => [...new Set(data.map((year) => year.status))].sort(), [data]);
  const filterTabs = useMemo<FilterTab[]>(() => [{ key: "status", label: "Status", type: "checkbox", options: statuses }], [statuses]);

  const filtered = useMemo(() => {
    let result = data;
    const query = search.trim().toLowerCase();
    if (query) result = result.filter((year) => year.code.toLowerCase().includes(query) || year.name.toLowerCase().includes(query) || year.status.toLowerCase().includes(query));
    const statusFilter = activeFilters.status as string[] | undefined;
    if (statusFilter?.length) result = result.filter((year) => statusFilter.includes(year.status));
    return result;
  }, [activeFilters, data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const selectedRows = useMemo(() => data.filter((year) => selectedIds.has(year.id)), [data, selectedIds]);
  const operationYears = useMemo<FinancialYearOperationState[]>(() => data.map((year) => ({
    id: year.id,
    code: year.code,
    startDate: year.startDate,
    status: year.status,
    hasPostings: year.hasPostings,
  })), [data]);
  const operationYearById = useMemo(() => new Map(operationYears.map((year) => [year.id, year])), [operationYears]);
  const selectedYear = selectedRows[0];
  const selectedOperationYear = selectedYear ? operationYearById.get(selectedYear.id) : undefined;
  const openBlockers = selectedYear && selectedOperationYear
    ? (selectedYear.status === "CLOSED"
      ? Reopen(selectedOperationYear, operationYears)
      : Open(selectedOperationYear, operationYears))
    : [];
  const closeBlockers = selectedOperationYear ? Close(selectedOperationYear, operationYears, 0) : [];
  const canOpenSelection = !readOnly
    && !!companyId
    && !!selectedYear
    && openBlockers.length === 0
    && !lifecycleBusy;
  const canCloseSelection = !readOnly
    && !!companyId
    && !!selectedYear
    && closeBlockers.length === 0
    && !lifecycleBusy;
  const deleteBlockers = selectedRows.flatMap((year) => {
    const operationYear = operationYearById.get(year.id);
    return operationYear ? Delete(operationYear, operationYears) : [];
  });
  const canDeleteSelection = !readOnly
    && !!companyId
    && selectedRows.length > 0
    && deleteBlockers.length === 0
    && !deleting;

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

  const parseError = async (response: Response) => {
    const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    return body?.message ?? "An unexpected error occurred";
  };

  const lifecycleUrl = (year: FinancialYearResponseDto, action: "open" | "close" | "reopen") =>
    financeApiUrl(`/financial-years/${encodeURIComponent(year.code)}/${action}`);

  const runLifecycleAction = async (action: "open" | "close") => {
    setLifecycleConfirmation(null);
    if (readOnly) return;
    if (!companyId || selectedRows.length === 0 || lifecycleBusy) return;
    setListError("");
    setLifecycleBusy(true);
    try {
      const updatedYears: FinancialYearResponseDto[] = [];
      for (const year of selectedRows) {
        const effectiveAction = action === "open" && year.status === "CLOSED" ? "reopen" : action;
        const response = await fetch(await lifecycleUrl(year, effectiveAction), { method: "POST" });
        if (!response.ok) {
          setListError(await parseError(response));
          return;
        }
        updatedYears.push(await response.json() as FinancialYearResponseDto);
      }
      const byId = new Map(updatedYears.map((year) => [year.id, year]));
      setData((current) => current.map((year) => byId.get(year.id) ?? year));
      setSelectedIds(new Set());
      setToastMessage(`${action === "open" ? "Opened" : "Closed"} ${updatedYears.length} financial year${updatedYears.length === 1 ? "" : "s"}`);
      setToastVisible(true);
    } finally {
      setLifecycleBusy(false);
    }
  };

  const deleteSelected = async () => {
    setIsDeleteOpen(false);
    if (!canDeleteSelection) return;
    setListError("");
    setDeleting(true);
    const deletedIds = new Set<number>();
    try {
      for (const year of selectedRows) {
        const response = await fetch(await financeApiUrl(`/financial-years/${encodeURIComponent(year.code)}`), {
          method: "DELETE",
        });
        if (!response.ok) {
          setData((current) => current.filter((candidate) => !deletedIds.has(candidate.id)));
          setSelectedIds((current) => new Set([...current].filter((id) => !deletedIds.has(id))));
          setListError(await parseError(response));
          return;
        }
        deletedIds.add(year.id);
      }
      setData((current) => current.filter((year) => !deletedIds.has(year.id)));
      setSelectedIds(new Set());
      setToastMessage(`Deleted ${deletedIds.size} financial year${deletedIds.size === 1 ? "" : "s"}`);
      setToastVisible(true);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async (rows: FinancialYearResponseDto[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "code", label: "Code" },
          { key: "name", label: "Name" },
          { key: "startDate", label: "Start Date" },
          { key: "endDate", label: "End Date" },
          { key: "status", label: "Status" },
        ],
        rows,
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
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "financial_periods_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "financial_periods_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${data.length})`, icon: "database", disabled: data.length === 0, onSelect: () => { void handleExport(data, "financial_periods_full_dataset"); } },
  ], [data, filtered, selectedRows]);

  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;

  const createYear = async (value: FinancialYearCreateRequestDto): Promise<string | undefined> => {
    if (readOnly) return "Financial periods are read only while this company uses organization standard settings";
    if (!companyId) return "Select a company before creating a financial year";
    const response = await fetch(await financeApiUrl(`/financial-years`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      return body?.message ?? "An unexpected error occurred";
    }
    const created = await response.json() as FinancialYearResponseDto;
    setData((current) => [...current, created].sort((left, right) => left.startDate.localeCompare(right.startDate)));
    return undefined;
  };

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>calendar_month</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Financial Periods</h1>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Financial periods control posting eligibility. Click a financial year to view and manage its periods.</p></div>
        </div>
        <div className={layout.slotActions}>
          <Button variant="primary" icon="add" className={layout.slotPrimaryAction} disabled={readOnly} onClick={() => setIsAddOpen(true)}>
            Add Financial Year
          </Button>
        </div>
        <div className={layout.slotAlert}>
          {readOnly ? <StandardSettingsReadOnlyAlert /> : null}
          <ValidationAlert errors={listError ? [listError] : []} visible={!!listError} onDismiss={() => setListError("")} />
        </div>
      </header>

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search financial periods..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary" icon="lock_open" disabled={!canOpenSelection} title={complexBlockerMessage(openBlockers)} onClick={() => setLifecycleConfirmation("open")}>Open</Button>
            <Button variant="secondary" icon="lock" disabled={!canCloseSelection} title={complexBlockerMessage(closeBlockers)} onClick={() => setLifecycleConfirmation("close")}>Close</Button>
            <Button variant="secondary-destructive" icon="delete" disabled={!canDeleteSelection} title={deleteBlockers[0]?.message ?? "Delete selected"} onClick={() => setIsDeleteOpen(true)} />
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
            isAllSelected={false}
            isSomeSelected={selectedIds.size > 0}
            onSelectAll={() => setSelectedIds(new Set())}
            onSelectOne={(id) => setSelectedIds((current) => current.has(id) ? new Set() : new Set([id]))}
            singleSelect
            onRowClick={(row) => router.push(`/finance/financial-periods/${encodeURIComponent(row.code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            noSelectionColumn={readOnly}
            totalCount={data.length}
            filteredCount={filtered.length}
            itemLabel="financial years"
            hasData={data.length > 0}
            emptyIcon="calendar_month"
            emptyTitle="No financial years found"
            emptyText="No financial years have been configured"
            emptyFilterText="No financial years match your search"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.name}</span></div><div className={listStyles.mobileMeta}>{formatDate(row.startDate)} - {formatDate(row.endDate)}</div></div>}
          />
        </div>
      </div>

      <AddFinancialYearModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onCreate={createYear} />
      <ConfirmDialog
        isOpen={lifecycleConfirmation !== null}
        title={`${lifecycleConfirmation === "close" ? "Close" : "Open"} Financial Year`}
        icon="warning"
        message={`Are you sure you want to ${lifecycleConfirmation ?? "update"} ${selectedYear?.name ?? "this financial year"}?`}
        confirmLabel={lifecycleConfirmation === "close" ? "Close" : "Open"}
        confirmVariant="primary"
        onClose={() => setLifecycleConfirmation(null)}
        onConfirm={() => {
          if (lifecycleConfirmation) void runLifecycleAction(lifecycleConfirmation);
        }}
      />
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Financial Years"
        icon="warning"
        message={(
          <>
            <p>Are you sure you want to permanently delete {selectedRows.length} financial year{selectedRows.length === 1 ? "" : "s"}?</p>
            <p><strong>This action cannot be undone.</strong></p>
          </>
        )}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => { void deleteSelected(); }}
      />
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={toastMessage} />
    </div>
  );
}

function AddFinancialYearModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: FinancialYearCreateRequestDto) => Promise<string | undefined>;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<FinancialYearStatus>("PLANNED");
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const validation = useFormValidation(() => ({
    code: { label: "code", value: code, rules: [required(), pattern(CODE_PATTERN, "Code can only contain capital letters, numbers, dashes and underscores")] },
    startDate: { label: "start date", value: startDate, rules: [required()] },
    endDate: { label: "end date", value: endDate, rules: [required()] },
  }));

  useEffect(() => {
    if (isOpen) return;
    setCode("");
    setName("");
    setStartDate("");
    setEndDate("");
    setStatus("PLANNED");
    setServerError("");
    setSaving(false);
    validation.reset();
  }, [isOpen, validation.reset]);

  if (!isOpen) return null;

  const submit = async () => {
    setServerError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const createError = await onCreate({
        code: code.trim().toUpperCase(),
        name: name.trim() || undefined,
        startDate,
        endDate,
        status,
      });
      if (createError) setServerError(createError);
      else onClose();
    } finally {
      setSaving(false);
    }
  };
  const currentErrors = [...validation.errors, ...(serverError ? [serverError] : [])];

  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.header}>
          <h3 className={typography.contentTitle}>Add Financial Year</h3>
          <Button variant="plain" icon="close" title="Close" onClick={onClose} />
        </div>
        <div className={modalStyles.body}>
          <ValidationAlert errors={currentErrors} visible={validation.showErrors || !!serverError} onDismiss={() => { validation.dismiss(); setServerError(""); }} />
          <div className={modalStyles.fieldRow}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Code</span>
              <Input invalid={validation.hasError("code")} value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Name (optional)</span>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
          </div>
          <div className={modalStyles.fieldRow}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Start Date</span>
              <DatePicker value={startDate} onChange={setStartDate} hasError={validation.hasError("startDate")} />
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>End Date</span>
              <DatePicker value={endDate} onChange={setEndDate} hasError={validation.hasError("endDate")} minDate={startDate || undefined} />
            </label>
          </div>
          <label className={modalStyles.fieldGroup}>
            <span className={typography.fieldLabel}>Status</span>
            <SearchableSelect value={status} onChange={(value) => setStatus(value as FinancialYearStatus)} options={STATUS_OPTIONS} searchable={false} />
          </label>
        </div>
        <div className={modalStyles.footer}>
          <Button variant="cancel" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { void submit(); }} disabled={saving}>{saving ? "Creating..." : "Create Financial Year"}</Button>
        </div>
      </div>
    </div>
  );
}
