"use client";

import { CompanyPageTitleBadges, getDrCrColor, getStatusSemanticColor } from "@voyzu-modules/all-modules/common/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { TaxSubledgerEntryResponseDto } from "@voyzu-modules/types/modules/tax-ledger";
import { Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type DropdownMenuItem, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./tax-ledger-list.module.css";

const ITEMS_PER_PAGE = 100;

type TaxLedgerRow = TaxSubledgerEntryResponseDto & { id: number };

const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatMoney(value: number | null | undefined) {
  return value == null ? "-" : moneyFormat.format(value);
}

function balanceMoney(value: number) {
  if (value === 0) return "-";
  const formatted = Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value < 0 ? `(${formatted})` : formatted;
}

const columns: DataTableColumn<TaxLedgerRow>[] = [
  { key: "code", label: "Entry #", width: "11rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "postingDate", label: "Date", width: "9rem" },
  { key: "documentTypeLabel", label: "Document", width: "12rem" },
  { key: "documentId", label: "Document ID", width: "12rem" },
  { key: "taxControlAccountCode", label: "Movement", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.taxControlAccountCode ?? "-"}</span> },
  { key: "taxAuthorityCode", label: "Authority", width: "10rem", render: (row) => <span className={listStyles.codeCell}>{row.taxAuthorityCode}</span> },
  { key: "entryType", label: "DR / CR", width: "8rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={getDrCrColor(row.entryType)}>{row.entryType}</Badge> },
  { key: "baseCurrencyAmount", label: "Amount", width: "10rem", align: "right", render: (row) => formatMoney(row.baseCurrencyAmount) },
  {
    key: "status",
    label: "Status",
    width: "8rem",
    align: "center",
    render: (row) => <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge>,
  },
];

export function TaxLedgerEntriesListContent({ entries }: { entries: TaxSubledgerEntryResponseDto[] }) {
  const router = useRouter();
  const rows = entries as TaxLedgerRow[];
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [entries]);

  const entryTypes = useMemo(() => [...new Set(rows.map((row) => row.entryType))].sort(), [rows]);
  const authorities = useMemo(() => [...new Set(rows.map((row) => row.taxAuthorityCode))].sort(), [rows]);
  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort(), [rows]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "entryType", label: "DR / CR", type: "checkbox", options: entryTypes },
    { key: "taxAuthorityCode", label: "Authority", type: "checkbox", options: authorities },
    { key: "status", label: "Status", type: "checkbox", options: statuses },
  ], [authorities, entryTypes, statuses]);

  const balances = useMemo(
    () =>
      rows.reduce(
        (totals, row) => {
          const signedTaxAmount = row.entryType === "CREDIT" ? row.baseCurrencyAmount : -row.baseCurrencyAmount;
          if (row.taxControlAccountCode === "TAX_ON_PURCHASES") {
            totals.inputReceivable += signedTaxAmount;
          } else {
            totals.outputPayable += signedTaxAmount;
          }
          return totals;
        },
        { outputPayable: 0, inputReceivable: 0 },
      ),
    [rows],
  );

  const filtered = useMemo(() => {
    let result = rows;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((row) =>
        row.code.toLowerCase().includes(query) ||
        row.journalCode.toLowerCase().includes(query) ||
        row.documentTypeLabel.toLowerCase().includes(query) ||
        row.documentId.toLowerCase().includes(query) ||
        row.description.toLowerCase().includes(query) ||
        row.taxAuthorityCode.toLowerCase().includes(query) ||
        row.taxAuthorityName.toLowerCase().includes(query) ||
        (row.taxControlAccountCode ?? "").toLowerCase().includes(query),
      );
    }
    const typeFilter = activeFilters.entryType as string[] | undefined;
    if (typeFilter?.length) result = result.filter((row) => typeFilter.includes(row.entryType));
    const authorityFilter = activeFilters.taxAuthorityCode as string[] | undefined;
    if (authorityFilter?.length) result = result.filter((row) => authorityFilter.includes(row.taxAuthorityCode));
    const statusFilter = activeFilters.status as string[] | undefined;
    if (statusFilter?.length) result = result.filter((row) => statusFilter.includes(row.status));
    return result;
  }, [activeFilters, rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const isAllSelected = paginated.length > 0 && paginated.every((row) => selectedIds.has(row.id));
  const isSomeSelected = !isAllSelected && paginated.some((row) => selectedIds.has(row.id));
  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.has(row.id)), [rows, selectedIds]);
  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;

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

  const handleExport = async (exportRows: TaxLedgerRow[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "code", label: "Entry #" },
          { key: "postingDate", label: "Date" },
          { key: "documentTypeLabel", label: "Document" },
          { key: "documentId", label: "Document ID" },
          { key: "taxControlAccountCode", label: "Movement" },
          { key: "taxAuthorityCode", label: "Authority" },
          { key: "entryType", label: "DR / CR" },
          { key: "baseCurrencyAmount", label: "Amount" },
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
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "tax_ledger_entries_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "tax_ledger_entries_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "tax_ledger_entries_full_dataset"); } },
  ], [filtered, rows, selectedRows]);

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={`${layout.slotTitle} ${localStyles.titleSlot}`}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>receipt_long</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Tax Ledger Entries</h1>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Every journal posting recorded against the Tax Ledger.</p></div>
        </div>
        <div className={`${layout.slotSearch} ${localStyles.balancesSlot}`}>
          <section className={localStyles.balancesCard} aria-label="Tax balances">
            <h2 className={localStyles.balancesTitle}>Balances</h2>
            <div className={localStyles.balanceRows}>
              <div className={localStyles.balanceRow}>
                <span className={localStyles.balanceLabel}>Tax on sales</span>
                <span className={localStyles.codeChip}>220000</span>
                <span className={localStyles.balanceValue}>{balanceMoney(balances.outputPayable)}</span>
              </div>
              <div className={localStyles.balanceRow}>
                <span className={localStyles.balanceLabel}>Tax on purchases</span>
                <span className={localStyles.codeChip}>120000</span>
                <span className={localStyles.balanceValue}>{balanceMoney(balances.inputReceivable)}</span>
              </div>
              <div className={`${localStyles.totalRow} ${localStyles.balanceTotalRow}`}>
                <span className={localStyles.balanceLabel}>Total Balance</span>
                <span className={localStyles.balanceValue}>{balanceMoney(balances.outputPayable + balances.inputReceivable)}</span>
              </div>
            </div>
          </section>
        </div>
      </header>

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search tax ledger..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
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
            onRowClick={(row) => router.push(`/finance/subledgers/tax/ledger-entries/${encodeURIComponent(row.code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={rows.length}
            filteredCount={filtered.length}
            itemLabel="entries"
            hasData={rows.length > 0}
            emptyIcon="receipt_long"
            emptyTitle="No tax ledger entries found"
            emptyText="No tax ledger entries have been posted"
            emptyFilterText="No entries match your search"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.documentTypeLabel}</span></div><div className={listStyles.mobileMeta}>{row.taxAuthorityCode} - {row.entryType} - {formatMoney(row.baseCurrencyAmount)}</div><Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge></div>}
          />
        </div>
      </div>
    </div>
  );
}
