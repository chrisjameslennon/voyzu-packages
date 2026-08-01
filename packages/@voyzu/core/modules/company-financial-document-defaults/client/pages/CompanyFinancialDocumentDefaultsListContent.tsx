"use client";

import { getStatusSemanticColor } from "@voyzu/core/common/client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { FinancialDocumentDefaultResponseDto } from "@voyzu/core/types/modules/financial-document-defaults";
import {
  Badge,
  Button,
  DataTable,
  DropdownMenu,
  FilterChips,
  FilterPanel,
  Input,
  type DataTableColumn,
  type DropdownMenuItem,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";

const ITEMS_PER_PAGE = 100;

type FinancialDocumentDefaultListRow = FinancialDocumentDefaultResponseDto & { id: string };

interface FinancialDocumentDefaultsListContentProps {
  financialDocumentDefaults: FinancialDocumentDefaultResponseDto[];
  routePrefix?: string;
  apiPath?: string;
  apiScope?: "template" | "selected";
  readOnly?: boolean;
}

function encodeFinancialDocumentDefaultKey(documentCode: string, code: string): string {
  return `${encodeURIComponent(documentCode)}~${encodeURIComponent(code)}`;
}

function toRows(rows: FinancialDocumentDefaultResponseDto[]): FinancialDocumentDefaultListRow[] {
  return rows.map((row) => ({ ...row, id: encodeFinancialDocumentDefaultKey(row.documentCode, row.code) }));
}

const columns: DataTableColumn<FinancialDocumentDefaultListRow>[] = [
  { key: "documentCode", label: "Document", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.documentCode}</span> },
  { key: "code", label: "Code", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  {
    key: "targetType",
    label: "Target",
    width: "11rem",
    render: (row) => <Badge variant="soft" size="x-small" color="neutral">{row.targetType}</Badge>,
  },
  {
    key: "glAccount",
    label: "Account",
    render: (row) => row.bankCashControlAccount
      ? row.bankCashControlAccount.code
      : row.glAccount
        ? `${row.glAccount.code} - ${row.glAccount.name}`
        : "-",
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

export function FinancialDocumentDefaultsListContent({
  financialDocumentDefaults,
  routePrefix = "/organization",
  apiPath,
  apiScope = "template",
  readOnly = false,
}: FinancialDocumentDefaultsListContentProps) {
  const router = useRouter();
  const [data, setData] = useState(() => toRows(financialDocumentDefaults));
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueDocuments = useMemo(() => [...new Set(data.map((row) => row.documentCode))].sort(), [data]);
  const uniqueTargets = useMemo(() => [...new Set(data.map((row) => row.targetType))].sort(), [data]);
  const uniqueStatuses = useMemo(() => [...new Set(data.map((row) => row.status))].sort(), [data]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "documentCode", label: "Document", type: "checkbox", options: uniqueDocuments },
    { key: "targetType", label: "Target", type: "checkbox", options: uniqueTargets },
    { key: "status", label: "Status", type: "checkbox", options: uniqueStatuses },
  ], [uniqueDocuments, uniqueStatuses, uniqueTargets]);

  const filtered = useMemo(() => {
    let result = data;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((row) => (
        row.documentCode.toLowerCase().includes(query) ||
        row.code.toLowerCase().includes(query) ||
        row.name.toLowerCase().includes(query) ||
        row.targetType.toLowerCase().includes(query) ||
        (row.glAccount?.code ?? "").toLowerCase().includes(query) ||
        (row.glAccount?.name ?? "").toLowerCase().includes(query) ||
        (row.bankCashControlAccount?.code ?? "").toLowerCase().includes(query)
      ));
    }

    const documents = activeFilters.documentCode as string[] | undefined;
    if (documents?.length) result = result.filter((row) => documents.includes(row.documentCode));
    const targets = activeFilters.targetType as string[] | undefined;
    if (targets?.length) result = result.filter((row) => targets.includes(row.targetType));
    const statuses = activeFilters.status as string[] | undefined;
    if (statuses?.length) result = result.filter((row) => statuses.includes(row.status));
    return result;
  }, [activeFilters, data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const selectedRows = useMemo(() => data.filter((row) => selectedIds.has(row.id)), [data, selectedIds]);
  const isAllSelected = paginated.length > 0 && paginated.every((row) => selectedIds.has(row.id));
  const isSomeSelected = !isAllSelected && paginated.some((row) => selectedIds.has(row.id));

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const requestPath = apiPath ?? (apiScope === "template" ? "/api/organization/financial-document-defaults" : "/api/financial-document-defaults");
      const response = await fetch(requestPath);
      if (response.ok) {
        setData(toRows(await response.json() as FinancialDocumentDefaultResponseDto[]));
        setSelectedIds(new Set());
      }
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    const pageIds = new Set(paginated.map((row) => row.id));
    setSelectedIds((current) => {
      const next = new Set(current);
      if (paginated.every((row) => current.has(row.id))) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleExport = async (rows: FinancialDocumentDefaultListRow[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "documentCode", label: "Document" },
          { key: "code", label: "Code" },
          { key: "name", label: "Name" },
          { key: "targetType", label: "Target" },
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
      disabled: selectedRows.length === 0,
      onSelect: () => { void handleExport(selectedRows, "financial_document_defaults_selected"); },
    },
    {
      value: "current-view",
      label: `Current view (${filtered.length})`,
      icon: "visibility",
      disabled: filtered.length === 0,
      onSelect: () => { void handleExport(filtered, "financial_document_defaults_current_view"); },
    },
    {
      value: "full-dataset",
      label: `Full dataset (${data.length})`,
      icon: "database",
      disabled: data.length === 0,
      onSelect: () => { void handleExport(data, "financial_document_defaults_full_dataset"); },
    },
  ], [data, filtered, selectedIds.size, selectedRows]);

  const removeFilter = (key: string) => {
    setActiveFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;

  return (
    <>
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
            placeholder="Search financial document defaults..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={layoutStyles.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
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
          <DataTable<FinancialDocumentDefaultListRow, string>
            columns={columns}
            rows={paginated}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onRowClick={(row) => router.push(`${routePrefix}/financial-document-defaults/${row.id}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={data.length}
            filteredCount={filtered.length}
            itemLabel="financial document defaults"
            hasData={data.length > 0}
            emptyIcon="webhook"
            emptyTitle="No financial document defaults found"
            emptyText="No financial document defaults have been configured"
            emptyFilterText="No financial document defaults match your search"
            mobileRender={(row) => (
              <div className={listStyles.mobileCard}>
                <div className={listStyles.mobileCode}>{row.documentCode} / {row.code}</div>
                <div className={listStyles.mobileName}>
                  <span className={listStyles.mobileNameText}>{row.name}</span>
                </div>
                <div className={listStyles.mobileMeta}>
                  {[row.targetType, row.status].filter(Boolean).join(" - ")}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
}
