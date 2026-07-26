"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { JournalResponseDto, JournalStatus } from "@voyzu-modules/types/modules/journals";

import { CompanyPageTitleBadges, getStatusSemanticColor } from "@voyzu-modules/all-modules/common/client";
import {
  Badge,
  Breadcrumbs,
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
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./journals.module.css";

const ITEMS_PER_PAGE = 100;

interface JournalCompany {
  id: number;
  code: string;
  name: string;
  baseCurrencyCode: string;
}

interface JournalsListProps {
  company: JournalCompany | null;
  journals: JournalResponseDto[];
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

function formatAmount(value: number | undefined) {
  if (value == null) return "";
  return value.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function documentName(journal: JournalResponseDto) {
  return journal.documentTypeLabel || journal.documentTypeCode;
}

function description(journal: JournalResponseDto) {
  return journal.memo || journal.description || "-";
}

function StatusBadge({
  status,
  reversedByJournalId,
  reversalOfJournalId,
}: {
  status: JournalStatus;
  reversedByJournalId?: number | null;
  reversalOfJournalId?: number | null;
}) {
  return (
    <span className={localStyles.inlineGroup}>
      <Badge variant="soft" size="x-small" color={getStatusSemanticColor(status)}>{status}</Badge>
      {reversalOfJournalId != null && <Badge variant="soft" size="x-small" color="info">REVERSAL</Badge>}
      {reversedByJournalId != null && <Badge variant="soft" size="x-small" color="warning">REVERSED</Badge>}
    </span>
  );
}

function makeColumns(): DataTableColumn<JournalResponseDto>[] {
  return [
    { key: "code", label: "Journal #", width: "10rem", render: (row) => row.code },
    { key: "postingDate", label: "Date", width: "9rem", render: (row) => formatDate(row.postingDate) },
    { key: "document", label: "Document", width: "13rem", render: (row) => documentName(row) },
    { key: "documentId", label: "Document ID", width: "11rem", render: (row) => row.documentId || <span className={localStyles.mutedText}>-</span> },
    { key: "description", label: "Memo / Description", render: (row) => <span className={localStyles.mutedText}>{description(row)}</span> },
    { key: "numberLines", label: "Lines", width: "5rem", align: "right", render: (row) => row.numberLines.toLocaleString("en-NZ") },
    { key: "amount", label: "Amount", width: "9rem", align: "right", render: (row) => formatAmount(row.totalDr) },
    {
      key: "status",
      label: "Status",
      width: "18rem",
      align: "right",
      render: (row) => <StatusBadge status={row.status} reversedByJournalId={row.reversedByJournalId} reversalOfJournalId={row.reversalOfJournalId} />,
    },
  ];
}

export function JournalsList({ company, journals }: JournalsListProps) {
  const router = useRouter();
  const columns = useMemo(() => makeColumns(), []);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [company?.id, journals]);

  const uniqueDocuments = useMemo(
    () => [...new Set(journals.map((journal) => documentName(journal)))].sort(),
    [journals],
  );
  const filterTabs: FilterTab[] = useMemo(() => [
    { key: "document", label: "Document", type: "checkbox", options: uniqueDocuments },
    { key: "reversed", label: "Reversed", type: "checkbox", options: ["Reversed", "Not reversed"] },
  ], [uniqueDocuments]);

  const filtered = useMemo(() => {
    let result = journals;
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((journal) =>
        journal.code.toLowerCase().includes(term) ||
        journal.documentTypeCode.toLowerCase().includes(term) ||
        documentName(journal).toLowerCase().includes(term) ||
        journal.financialPeriodCode.toLowerCase().includes(term) ||
        (journal.memo ?? "").toLowerCase().includes(term) ||
        journal.documentId.toLowerCase().includes(term),
      );
    }

    const documents = activeFilters.document as string[] | undefined;
    if (documents?.length) {
      result = result.filter((journal) => documents.includes(documentName(journal)));
    }

    const reversed = activeFilters.reversed as string[] | undefined;
    if (reversed?.length === 1) {
      if (reversed[0] === "Reversed") result = result.filter((journal) => journal.reversedByJournalId != null);
      if (reversed[0] === "Not reversed") result = result.filter((journal) => journal.reversedByJournalId == null);
    }

    return result;
  }, [activeFilters, journals, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const isAllSelected = paginated.length > 0 && paginated.every((journal) => selectedIds.has(journal.id));
  const isSomeSelected = !isAllSelected && paginated.some((journal) => selectedIds.has(journal.id));
  const selectedJournals = useMemo(
    () => journals.filter((journal) => selectedIds.has(journal.id)),
    [journals, selectedIds],
  );

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      router.refresh();
      setRefreshing(false);
    }, 500);
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
    const pageIds = new Set(paginated.map((journal) => journal.id));
    const allSelected = paginated.every((journal) => selectedIds.has(journal.id));
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const removeFilter = (key: string) => {
    setActiveFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleExport = async (rows: JournalResponseDto[], filename: string) => {
    const exportRows = rows.map((journal) => ({
      code: journal.code,
      postingDate: journal.postingDate,
      document: documentName(journal),
      documentId: journal.documentId,
      description: description(journal),
      lines: journal.numberLines,
      amount: journal.totalDr,
      currency: journal.baseCurrencyCode,
      status: journal.status,
    }));

    const columns = [
      { key: "code", label: "Journal #" },
      { key: "postingDate", label: "Posting Date" },
      { key: "document", label: "Document" },
      { key: "documentId", label: "Document ID" },
      { key: "description", label: "Description" },
      { key: "lines", label: "Lines" },
      { key: "amount", label: "Amount" },
      { key: "currency", label: "Currency" },
      { key: "status", label: "Status" },
    ];

    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, columns, rows: exportRows }),
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
      disabled: selectedJournals.length === 0,
      onSelect: () => { void handleExport(selectedJournals, "journal_entries_selected"); },
    },
    {
      value: "current-view",
      label: `Current view (${filtered.length})`,
      icon: "visibility",
      disabled: filtered.length === 0,
      onSelect: () => { void handleExport(filtered, "journal_entries_current_view"); },
    },
    {
      value: "full-dataset",
      label: `Full dataset (${journals.length})`,
      icon: "database",
      disabled: journals.length === 0,
      onSelect: () => { void handleExport(journals, "journal_entries_full_dataset"); },
    },
  ], [filtered, journals, selectedIds.size, selectedJournals]);

  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasActiveSearch = searchTerm.trim().length > 0;
  const hasActiveChips = hasActiveFilters || hasActiveSearch;

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_balance</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Journal Entries</h1>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
          <div className={layout.slotTitleByline}>
            <p className={typography.headingByline}>
              Journal entries show every posting to the company general ledger generated from financial documents.
            </p>
          </div>
        </div>
      </header>

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}>
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
        <div className={layout.slotToolbarSearch}>
          <Input
            search
            containerClassName={layout.slotSearchControl}
            placeholder="Search journals..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button
              variant="plain"
              icon="sync"
              className={refreshing ? listStyles.spinning : undefined}
              disabled={refreshing}
              title="Refresh"
              onClick={handleRefresh}
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

      {hasActiveChips && (
        <div className={layout.chipsRow}>
          <div className={layout.slotChips}>
            <FilterChips
              tabs={filterTabs}
              filters={activeFilters}
              additionalChips={hasActiveSearch
                ? [{
                    key: "search",
                    label: "Search contains",
                    value: searchTerm.trim(),
                    onRemove: () => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    },
                  }]
                : []}
              onClear={() => {
                setActiveFilters({});
                setSearchTerm("");
                setCurrentPage(1);
              }}
              onRemoveFilter={removeFilter}
            />
          </div>
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
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onRowClick={(journal) => router.push(`/finance/journals/${encodeURIComponent(journal.code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={journals.length}
            filteredCount={filtered.length}
            itemLabel="journals"
            hasData={journals.length > 0}
            emptyIcon="account_balance"
            emptyTitle={company ? "No journals found" : "No company selected"}
            emptyText={company ? "No journal entries have been posted" : "Select a company to view journal entries"}
            emptyFilterText="No journals match your search"
            mobileRender={(journal) => (
              <div className={localStyles.mobileCard}>
                <div className={localStyles.mobileCode}>{journal.code}</div>
                <div className={localStyles.mobileName}>{formatDate(journal.postingDate)} - {documentName(journal)}</div>
                <div className={localStyles.mobileMeta}>{description(journal)}</div>
                <div className={localStyles.mobileMeta}>{formatAmount(journal.totalDr)} {journal.baseCurrencyCode}</div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
