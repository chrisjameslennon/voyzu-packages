"use client";

import { getStatusSemanticColor } from "@voyzu/core/common/client";
import { Deactivate, Delete } from "@voyzu/core/common/dimensions/domain/operation-policy";
import { AddDimensionModal } from "../../common/dimensions/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { DimensionCreateRequestDto, DimensionResponseDto } from "@voyzu/core/types/modules/dimensions";
import {
  Badge,
  Button,
  DataTable,
  DropdownMenu,
  FilterChips,
  FilterPanel,
  Input,
  ValidationAlert,
  type DataTableColumn,
  type DropdownMenuItem,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import { maxLength, pattern, required, useFormValidation } from "@voyzu/ui-components";
import { Toast } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";

const ITEMS_PER_PAGE = 100;
const TOAST_KEY = "voyzu:dimensions:toast";
const CODE_PATTERN = /^[A-Z0-9_-]+$/;

interface OrganizationDimensionsListContentProps {
  dimensions: DimensionResponseDto[];
  basePath?: string;
  apiPath?: string;
}

const columns: DataTableColumn<DimensionResponseDto>[] = [
  { key: "code", label: "Code", width: "10rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  {
    key: "values",
    label: "Values",
    width: "8rem",
    align: "right",
    render: (row) => row.values?.length ?? 0,
  },
  {
    key: "hasPostings",
    label: "Has Postings",
    width: "9rem",
    align: "center",
    render: (row) => row.hasPostings ? (
      <span className={`material-symbols-outlined ${listStyles.successIcon}`} aria-label="Has postings">check</span>
    ) : "-",
  },
  {
    key: "status",
    label: "Status",
    width: "8rem",
    align: "center",
    render: (row) => (
      <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>
        {row.status}
      </Badge>
    ),
  },
];

export function OrganizationDimensionsListContent({
  dimensions,
  basePath = "/finance/dimensions",
  apiPath = "/api/finance/dimensions",
}: OrganizationDimensionsListContentProps) {
  const router = useRouter();
  const [data, setData] = useState(dimensions);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [listError, setListError] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addCode, setAddCode] = useState("");
  const [addName, setAddName] = useState("");
  const [addServerError, setAddServerError] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const addValidation = useFormValidation(() => ({
    code: {
      label: "code",
      value: addCode,
      rules: [
        required(),
        maxLength(14),
        pattern(CODE_PATTERN, "Code can only contain uppercase letters, numbers, underscores or hyphens"),
      ],
    },
    name: { label: "name", value: addName, rules: [required()] },
  }));

  useEffect(() => {
    const message = sessionStorage.getItem(TOAST_KEY);
    if (!message) return;
    sessionStorage.removeItem(TOAST_KEY);
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    setData(dimensions);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [dimensions]);

  const apiUrl = (suffix = "") => {
    const [path, query] = apiPath.split("?");
    return `${path}${suffix}${query ? `?${query}` : ""}`;
  };

  const uniqueStatuses = useMemo(() => [...new Set(data.map((dimension) => dimension.status))].sort(), [data]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "status", label: "Status", type: "checkbox", options: uniqueStatuses },
  ], [uniqueStatuses]);

  const filtered = useMemo(() => {
    let result = data;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((dimension) => (
        dimension.code.toLowerCase().includes(query) ||
        dimension.name.toLowerCase().includes(query) ||
        dimension.status.toLowerCase().includes(query)
      ));
    }

    const statuses = activeFilters.status as string[] | undefined;
    if (statuses?.length) result = result.filter((dimension) => statuses.includes(dimension.status));
    return result;
  }, [activeFilters, data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const selectedDimensions = useMemo(() => data.filter((dimension) => selectedIds.has(dimension.id)), [data, selectedIds]);
  const hasSelection = selectedDimensions.length > 0;
  const canActivateSelection = hasSelection && selectedDimensions.some((dimension) => dimension.status === "INACTIVE");
  const canDeactivateSelection = hasSelection && selectedDimensions.some((dimension) => dimension.status === "ACTIVE") && selectedDimensions.every((dimension) => Deactivate(dimension).length === 0);
  const canDeleteSelection = hasSelection && selectedDimensions.every((dimension) => Delete(dimension).length === 0);
  const isAllSelected = paginated.length > 0 && paginated.every((dimension) => selectedIds.has(dimension.id));
  const isSomeSelected = !isAllSelected && paginated.some((dimension) => selectedIds.has(dimension.id));

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await fetch(apiUrl());
      if (response.ok) {
        setData(await response.json() as DimensionResponseDto[]);
        setSelectedIds(new Set());
      }
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const transitionSelected = async (action: "activate" | "deactivate") => {
    setListError("");
    const response = await fetch(apiUrl(`/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: selectedDimensions.map((dimension) => dimension.code) }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setListError(body?.message ?? "An unexpected error occurred");
      return;
    }
    const updated = await response.json() as DimensionResponseDto[];
    const byCode = new Map(updated.map((dimension) => [dimension.code, dimension]));
    setData((current) => current.map((dimension) => byCode.get(dimension.code) ?? dimension));
    setSelectedIds(new Set());
    setToastMessage(`${action === "activate" ? "Activated" : "Deactivated"} ${updated.length} dimension${updated.length === 1 ? "" : "s"}`);
    setToastVisible(true);
  };

  const deleteSelected = async () => {
    setListError("");
    const codes = selectedDimensions.map((dimension) => dimension.code);
    const response = await fetch(apiUrl("/batch/delete"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setListError(body?.message ?? "An unexpected error occurred");
      return;
    }
    setData((current) => current.filter((dimension) => !selectedIds.has(dimension.id)));
    setSelectedIds(new Set());
    setToastMessage(`Deleted ${codes.length} dimension${codes.length === 1 ? "" : "s"}`);
    setToastVisible(true);
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    const pageIds = new Set(paginated.map((dimension) => dimension.id));
    setSelectedIds((current) => {
      const next = new Set(current);
      if (paginated.every((dimension) => current.has(dimension.id))) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleExport = async (rows: DimensionResponseDto[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "code", label: "Code" },
          { key: "name", label: "Name" },
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
    {
      value: "selected",
      label: `Selected (${selectedIds.size})`,
      icon: "check_box",
      disabled: selectedDimensions.length === 0,
      onSelect: () => { void handleExport(selectedDimensions, "dimensions_selected"); },
    },
    {
      value: "current-view",
      label: `Current view (${filtered.length})`,
      icon: "visibility",
      disabled: filtered.length === 0,
      onSelect: () => { void handleExport(filtered, "dimensions_current_view"); },
    },
    {
      value: "full-dataset",
      label: `Full dataset (${data.length})`,
      icon: "database",
      disabled: data.length === 0,
      onSelect: () => { void handleExport(data, "dimensions_full_dataset"); },
    },
  ], [data, filtered, selectedDimensions, selectedIds.size]);

  const removeFilter = (key: string) => {
    setActiveFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;

  const createDimension = async (value: DimensionCreateRequestDto): Promise<string | undefined> => {
    const response = await fetch(apiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      return body?.message ?? "An unexpected error occurred";
    }
    const created = await response.json() as DimensionResponseDto;
    setData((current) => [...current, created].sort((left, right) => left.code.localeCompare(right.code)));
    setToastMessage(`Created dimension ${created.code}`);
    setToastVisible(true);
    return undefined;
  };

  const resetAddModal = () => {
    setAddCode("");
    setAddName("");
    setAddServerError("");
    setAddSaving(false);
    addValidation.reset();
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    resetAddModal();
  };

  const submitAddDimension = async () => {
    setAddServerError("");
    if (!addValidation.attempt()) return;
    setAddSaving(true);
    try {
      const createError = await createDimension({ code: addCode.trim().toUpperCase(), name: addName.trim() });
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
    <>
      <div className={layoutStyles.slotActions}>
        <Button
          variant="primary"
          icon="add"
          className={layoutStyles.slotPrimaryAction}
          onClick={() => setIsAddOpen(true)}
        >
          Add Dimension
        </Button>
      </div>
      <div className={layoutStyles.slotAlert}>
        <ValidationAlert errors={listError ? [listError] : []} visible={!!listError} onDismiss={() => setListError("")} />
      </div>
      <div className={layoutStyles.listToolbar}>
        <div className={layoutStyles.slotToolbarLeft}>
          <FilterPanel
            tabs={filterTabs}
            filters={activeFilters}
            onApply={(filters) => {
              setActiveFilters(filters);
              setCurrentPage(1);
            }}
            onClear={() => {
              setActiveFilters({});
              setCurrentPage(1);
            }}
            onRemoveFilter={removeFilter}
            showChips={false}
          />
        </div>
        <div className={layoutStyles.slotToolbarSearch}>
          <Input
            search
            containerClassName={layoutStyles.slotSearchControl}
            placeholder="Search dimensions..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={layoutStyles.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary" icon="check_circle" disabled={!canActivateSelection} onClick={() => { void transitionSelected("activate"); }}>
              Activate
            </Button>
            <Button variant="secondary" icon="block" disabled={!canDeactivateSelection} onClick={() => { void transitionSelected("deactivate"); }}>
              Deactivate
            </Button>
            <Button variant="danger" icon="delete" disabled={!canDeleteSelection} onClick={() => { void deleteSelected(); }} />
            <Button
              variant="plain"
              icon="sync"
              className={refreshing ? listStyles.spinning : undefined}
              disabled={refreshing}
              title="Refresh"
              onClick={() => { void refresh(); }}
            />
            <DropdownMenu
              trigger={<Button variant="plain" icon="file_download" title="Export" />}
              items={exportItems}
              alignment="right"
              width={260}
            />
          </div>
        </div>
      </div>

      {(hasActiveFilters || hasSearch) && (
        <div className={layoutStyles.chipsRow}>
          <div className={layoutStyles.slotChips}>
            <FilterChips
              tabs={filterTabs}
              filters={activeFilters}
              additionalChips={hasSearch
                ? [{
                    key: "search",
                    label: "Search contains",
                    value: search.trim(),
                    onRemove: () => {
                      setSearch("");
                      setCurrentPage(1);
                    },
                  }]
                : []}
              onClear={() => {
                setActiveFilters({});
                setSearch("");
                setCurrentPage(1);
              }}
              onRemoveFilter={removeFilter}
            />
          </div>
        </div>
      )}

      <div className={layoutStyles.listBody}>
        <div className={layoutStyles.slotBody}>
          <DataTable<DimensionResponseDto, number>
            columns={columns}
            rows={paginated}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onRowClick={(dimension) => router.push(`${basePath}/${encodeURIComponent(dimension.code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={data.length}
            filteredCount={filtered.length}
            itemLabel="dimensions"
            hasData={data.length > 0}
            emptyIcon="category"
            emptyTitle="No dimensions found"
            emptyText="No dimensions have been configured"
            emptyFilterText="No dimensions match your search"
            mobileRender={(dimension) => (
              <div className={listStyles.mobileCard}>
                <div className={listStyles.mobileCode}>{dimension.code}</div>
                <div className={listStyles.mobileName}>
                  <span className={listStyles.mobileNameText}>{dimension.name}</span>
                </div>
                <div className={listStyles.mobileMeta}>
                  {[(dimension.values?.length ?? 0).toString() + " values", dimension.hasPostings ? "Has postings" : null].filter(Boolean).join(" - ")}
                </div>
                <Badge variant="soft" size="x-small" color={getStatusSemanticColor(dimension.status)}>
                  {dimension.status}
                </Badge>
              </div>
            )}
          />
        </div>
      </div>
      <AddDimensionModal
        isOpen={isAddOpen}
        code={addCode}
        name={addName}
        errors={[...addValidation.errors, ...(addServerError ? [addServerError] : [])]}
        showErrors={addValidation.showErrors || !!addServerError}
        saving={addSaving}
        codeHasError={addValidation.hasError("code")}
        nameHasError={addValidation.hasError("name")}
        onClose={closeAddModal}
        onDismissErrors={() => {
          addValidation.dismiss();
          setAddServerError("");
        }}
        onCodeChange={(value) => setAddCode(value.toUpperCase())}
        onNameChange={setAddName}
        onSubmit={() => { void submitAddDimension(); }}
      />
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={toastMessage} />
    </>
  );
}
