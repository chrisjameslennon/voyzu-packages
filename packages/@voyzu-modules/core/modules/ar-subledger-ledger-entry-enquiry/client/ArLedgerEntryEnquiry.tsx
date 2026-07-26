"use client";

import { CompanyPageTitleBadges, financeApiUrl, getDrCrColor, getStatusSemanticColor } from "@voyzu-modules/core/common/client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { ArSubledgerEntryResponseDto } from "@voyzu-modules/core/types/modules/ar-subledger";
import type { FinancialPeriodResponseDto } from "@voyzu-modules/core/types/modules/financial-periods";
import type { FinancialYearResponseDto } from "@voyzu-modules/core/types/modules/financial-years";
import {
  Badge,
  Breadcrumbs,
  Button,
  DataTable,
  DatePicker,
  DropdownMenu,
  FilterChips,
  FilterPanel,
  Input,
  SearchableSelect,
  type DataTableColumn,
  type DropdownMenuItem,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import filterStyles from "@voyzu/ui-components/filter-panel/filter-panel.module.css";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import localStyles from "./ar-ledger-entry-enquiry.module.css";

const ITEMS_PER_PAGE = 100;
type ArEntryRow = ArSubledgerEntryResponseDto & { id: number };
const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value: number | null | undefined) => value == null ? "-" : moneyFormat.format(value);

const columns: DataTableColumn<ArEntryRow>[] = [
  { key: "code", label: "Entry #", width: "11rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "postingDate", label: "Date", width: "9rem" },
  { key: "documentTypeLabel", label: "Document", width: "12rem" },
  { key: "documentId", label: "Document ID", width: "12rem" },
  { key: "counterpartyName", label: "Counterparty", width: "16rem", render: (row) => <span className={listStyles.nameCell}>{row.counterpartyName}</span> },
  { key: "entryType", label: "DR / CR", width: "8rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={getDrCrColor(row.entryType)}>{row.entryType}</Badge> },
  { key: "baseCurrencyAmount", label: "Amount", width: "10rem", align: "right", render: (row) => money(row.baseCurrencyAmount) },
  { key: "openBalance", label: "Open", width: "10rem", align: "right", render: (row) => money(row.openBalance) },
  { key: "paymentStatus", label: "Payment", width: "10rem", render: (row) => row.paymentStatus ?? "-" },
  { key: "status", label: "Status", width: "8rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge> },
];

function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function rangeForPreset(value: string, year: FinancialYearResponseDto | undefined) {
  const today = new Date();
  const clamp = (fromDate: string, toDate: string) => ({
    fromDate: year?.startDate && fromDate < year.startDate ? year.startDate : fromDate,
    toDate: year?.endDate && toDate > year.endDate ? year.endDate : toDate,
  });
  if (value === "this-month") return clamp(toIso(new Date(today.getFullYear(), today.getMonth(), 1)), toIso(today));
  if (value === "previous-90-days") return clamp(toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90)), toIso(today));
  if (value === "previous-2-complete-months") return clamp(toIso(new Date(today.getFullYear(), today.getMonth() - 2, 1)), toIso(new Date(today.getFullYear(), today.getMonth(), 0)));
  if (value === "previous-3-complete-months") return clamp(toIso(new Date(today.getFullYear(), today.getMonth() - 3, 1)), toIso(new Date(today.getFullYear(), today.getMonth(), 0)));
  if (value === "previous-6-complete-months") return clamp(toIso(new Date(today.getFullYear(), today.getMonth() - 6, 1)), toIso(new Date(today.getFullYear(), today.getMonth(), 0)));
  if (value === "entire-financial-year" && year) return { fromDate: year.startDate, toDate: year.endDate };
  return clamp(toIso(new Date(today.getFullYear(), today.getMonth() - 1, 1)), toIso(new Date(today.getFullYear(), today.getMonth(), 0)));
}

interface Props {
  entries: ArSubledgerEntryResponseDto[];
  financialYears: FinancialYearResponseDto[];
  periods: FinancialPeriodResponseDto[];
  selectedYearCode: string;
  fromDate: string;
  toDate: string;
}

export function ArLedgerEntryEnquiry({ entries, financialYears, periods: initialPeriods, selectedYearCode: initialYearCode, fromDate: initialFromDate, toDate: initialToDate }: Props) {
  const router = useRouter();
  const rows = entries as ArEntryRow[];
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);
  const [periods, setPeriods] = useState(initialPeriods);
  const [selectedYearCode, setSelectedYearCode] = useState(initialYearCode);
  const [rangePreset, setRangePreset] = useState("previous-90-days");
  const [rangeLabel, setRangeLabel] = useState("Previous 90 days");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const selectedYear = useMemo(() => financialYears.find((year) => year.code === selectedYearCode), [financialYears, selectedYearCode]);
  const isHistoricalYear = Boolean(selectedYear && (selectedYear.startDate > toIso(new Date()) || selectedYear.endDate < toIso(new Date())));
  const yearOptions = useMemo(() => financialYears.map((year) => ({ value: year.code, label: year.name, code: year.code })), [financialYears]);
  const applyPreset = useCallback((value: string, label: string, year: FinancialYearResponseDto | undefined) => {
    const range = rangeForPreset(value, year);
    setRangePreset(value);
    setRangeLabel(label);
    setFromDate(range.fromDate);
    setToDate(range.toDate);
    setCurrentPage(1);
  }, []);
  const handleYearChange = async (yearCode: string) => {
    setSelectedYearCode(yearCode);
    const nextYear = financialYears.find((year) => year.code === yearCode);
    const historical = Boolean(nextYear && (nextYear.startDate > toIso(new Date()) || nextYear.endDate < toIso(new Date())));
    if (historical) {
      setRangePreset("entire-financial-year");
      setRangeLabel("Financial year");
    }
    const response = await fetch(await financeApiUrl(`/financial-years/${yearCode}/periods`));
    const nextPeriods = response.ok ? await response.json() as FinancialPeriodResponseDto[] : [];
    setPeriods(nextPeriods);
    if (historical && nextYear) {
      setRangePreset("entire-financial-year");
      setRangeLabel("Financial year");
      setFromDate(nextYear.startDate);
      setToDate(nextYear.endDate);
      setCurrentPage(1);
      return;
    }
    applyPreset("previous-90-days", "Previous 90 days", nextYear);
  };
  const periodItems: DropdownMenuItem[] = periods.map((period) => ({
    value: `period:${period.code}`,
    label: period.name,
    details: `${period.startDate} - ${period.endDate}`,
    muted: !period.hasPostings,
    onSelect: () => {
      setRangePreset(`period:${period.code}`);
      setRangeLabel(period.name);
      setFromDate(period.startDate);
      setToDate(period.endDate);
      setCurrentPage(1);
    },
  }));
  const rangeItems: DropdownMenuItem[] = [
    { value: "this-month", label: "Month to date", onSelect: () => applyPreset("this-month", "Month to date", selectedYear) },
    { value: "last-month", label: "Previous month", onSelect: () => applyPreset("last-month", "Previous month", selectedYear) },
    { value: "previous-2-complete-months", label: "Previous 2 complete months", onSelect: () => applyPreset("previous-2-complete-months", "Previous 2 complete months", selectedYear) },
    { value: "previous-3-complete-months", label: "Previous 3 complete months", onSelect: () => applyPreset("previous-3-complete-months", "Previous 3 complete months", selectedYear) },
    { value: "previous-6-complete-months", label: "Previous 6 complete months", onSelect: () => applyPreset("previous-6-complete-months", "Previous 6 complete months", selectedYear) },
    { value: "previous-90-days", label: "Previous 90 days", onSelect: () => applyPreset("previous-90-days", "Previous 90 days", selectedYear) },
    { value: "entire-financial-year", label: "Financial year", onSelect: () => applyPreset("entire-financial-year", "Financial year", selectedYear) },
    { value: "period", label: "Period", disabled: periodItems.length === 0, children: periodItems },
  ];
  const historicalRangeItems = rangeItems.filter(({ value }) => value === "entire-financial-year" || value === "period" || value === "periods");

  const documentTypes = useMemo(() => [...new Set(rows.map((row) => row.documentTypeLabel))].sort(), [rows]);
  const entryTypes = useMemo(() => [...new Set(rows.map((row) => row.entryType))].sort(), [rows]);
  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort(), [rows]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "documentTypeLabel", label: "Document", type: "checkbox", options: documentTypes },
    { key: "entryType", label: "DR / CR", type: "checkbox", options: entryTypes },
    { key: "status", label: "Status", type: "checkbox", options: statuses },
  ], [documentTypes, entryTypes, statuses]);
  const filtered = useMemo(() => {
    let result = rows.filter((row) => row.postingDate >= fromDate && row.postingDate <= toDate);
    const query = search.trim().toLowerCase();
    if (query) result = result.filter((row) => [row.code, row.documentId, row.documentTypeLabel, row.counterpartyCode, row.counterpartyName, row.description].some((value) => value.toLowerCase().includes(query)));
    const documentFilter = activeFilters.documentTypeLabel as string[] | undefined;
    if (documentFilter?.length) result = result.filter((row) => documentFilter.includes(row.documentTypeLabel));
    const entryFilter = activeFilters.entryType as string[] | undefined;
    if (entryFilter?.length) result = result.filter((row) => entryFilter.includes(row.entryType));
    const statusFilter = activeFilters.status as string[] | undefined;
    if (statusFilter?.length) result = result.filter((row) => statusFilter.includes(row.status));
    return result;
  }, [activeFilters, fromDate, rows, search, toDate]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const isAllSelected = paginated.length > 0 && paginated.every((row) => selectedIds.has(row.id));
  const isSomeSelected = !isAllSelected && paginated.some((row) => selectedIds.has(row.id));
  const hasFilters = search.trim().length > 0 || Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.has(row.id)), [rows, selectedIds]);
  const removeFilter = (key: string) => setActiveFilters((current) => { const next = { ...current }; delete next[key]; return next; });
  const handleExport = async (exportRows: ArEntryRow[], filename: string) => {
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
          { key: "counterpartyCode", label: "Counterparty Code" },
          { key: "counterpartyName", label: "Counterparty" },
          { key: "entryType", label: "DR / CR" },
          { key: "baseCurrencyAmount", label: "Amount" },
          { key: "openBalance", label: "Open Balance" },
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
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "ar_ledger_entry_enquiry_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "ar_ledger_entry_enquiry_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "ar_ledger_entry_enquiry_full_dataset"); } },
  ], [filtered, rows, selectedRows]);

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>receipt_long</span></div>
          <div className={layout.slotTitleText}>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>AR Ledger Entry Enquiry</h1>
            <CompanyPageTitleBadges />
          </div>
        </div>
        <div className={layout.slotToolbarLeft}>
          <div className={localStyles.dateRange}>
            <div className={localStyles.yearControl}><SearchableSelect value={selectedYearCode} onChange={(value) => { void handleYearChange(value); }} options={yearOptions} placeholder="Financial year" searchable={false} dropdownWidth="trigger" disabled={yearOptions.length === 0} /></div>
            <DropdownMenu alignment="left" width={260} selectedValue={rangePreset} items={isHistoricalYear ? historicalRangeItems : rangeItems} trigger={<Button variant="secondary" icon="date_range">{rangeLabel}</Button>} />
            {!isHistoricalYear && <>
              <div className={localStyles.dateControl}><DatePicker value={fromDate} onChange={(value) => { setRangePreset("custom"); setRangeLabel("Custom"); setFromDate(value); setCurrentPage(1); }} clearable={false} /></div>
              <span className={localStyles.rangeSeparator}>through</span>
              <div className={localStyles.dateControl}><DatePicker value={toDate} onChange={(value) => { setRangePreset("custom"); setRangeLabel("Custom"); setToDate(value); setCurrentPage(1); }} clearable={false} /></div>
            </>}
          </div>
        </div>
        <div className={layout.slotToolbarRight} />
        <div className={localStyles.filterToolbar}>
          <FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} />
          <Input search containerClassName={localStyles.search} placeholder="Search AR entries..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} />
        </div>
      </header>
      <div className={layout.slotChips}>
        <div className={localStyles.chipsBar}>
          <div className={localStyles.chipsRow}>
            <div className={filterStyles.chip} title={`${fromDate} through ${toDate}`}>
              <span className={filterStyles.chipKey}>Date</span>
              <span className={filterStyles.chipValue}>{fromDate} through {toDate}</span>
            </div>
            {hasFilters && <span className={filterStyles.chipAnd}>AND</span>}
            {hasFilters && (
              <FilterChips
                tabs={filterTabs}
                filters={activeFilters}
                additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setCurrentPage(1); } }] : []}
                onClear={() => { setActiveFilters({}); setSearch(""); setCurrentPage(1); }}
                onRemoveFilter={(key) => { removeFilter(key); setCurrentPage(1); }}
              />
            )}
          </div>
          <div className={localStyles.chipActions}>
            <Button variant="plain" icon="sync" title="Refresh" onClick={() => router.refresh()} />
            <DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} />
          </div>
        </div>
      </div>
      <div className={layout.slotDocument}>
        <DataTable columns={columns} rows={paginated} selectedIds={selectedIds} isAllSelected={isAllSelected} isSomeSelected={isSomeSelected} onSelectAll={() => setSelectedIds((current) => isAllSelected ? new Set([...current].filter((id) => !paginated.some((row) => row.id === id))) : new Set([...current, ...paginated.map((row) => row.id)]))} onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })} onRowClick={(row) => router.push(`/finance/subledgers/ar/ledger-entry-enquiry/${encodeURIComponent(row.code)}`)} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalCount={rows.length} filteredCount={filtered.length} itemLabel="entries" hasData={rows.length > 0} emptyIcon="receipt_long" emptyTitle="No AR ledger entries found" emptyText="No AR ledger entries have been posted" emptyFilterText="No entries match the selected period or filters" mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.counterpartyName}</span></div><div className={listStyles.mobileMeta}>{row.documentId} - {money(row.baseCurrencyAmount)}</div><Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge></div>} />
      </div>
    </div>
  );
}
