"use client";

import { CompanyPageTitleBadges, financeApiUrl, getStatusSemanticColor } from "@voyzu/modules/common/client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { JournalResponseDto } from "@voyzu/types/modules/journals";
import type { FinancialPeriodResponseDto } from "@voyzu/types/modules/financial-periods";
import type { FinancialYearResponseDto } from "@voyzu/types/modules/financial-years";
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

import localStyles from "./account-activity.module.css";

const ITEMS_PER_PAGE = 100;
interface ActivityRow {
  id: number;
  journalCode: string;
  postingDate: string;
  documentTypeLabel: string;
  documentId: string;
  glAccountCode: string;
  glAccountName: string;
  description: string;
  drCr: "DR" | "CR";
  debit: number | null;
  credit: number | null;
  status: string;
}
const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value: number | null | undefined) => value == null ? "-" : moneyFormat.format(value);

const columns: DataTableColumn<ActivityRow>[] = [
  { key: "glAccountCode", label: "Account", width: "9rem", render: (row) => <span className={listStyles.codeCell}>{row.glAccountCode}</span> },
  { key: "glAccountName", label: "Account Name", width: "15rem", render: (row) => <span className={listStyles.nameCell}>{row.glAccountName}</span> },
  { key: "postingDate", label: "Date", width: "9rem" },
  { key: "journalCode", label: "Journal", width: "11rem", render: (row) => <span className={listStyles.codeCell}>{row.journalCode}</span> },
  { key: "documentTypeLabel", label: "Document", width: "12rem" },
  { key: "documentId", label: "Document ID", width: "12rem" },
  { key: "description", label: "Description", width: "18rem" },
  { key: "debit", label: "Debit", width: "10rem", align: "right", render: (row) => money(row.debit) },
  { key: "credit", label: "Credit", width: "10rem", align: "right", render: (row) => money(row.credit) },
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
  journals: JournalResponseDto[];
  financialYears: FinancialYearResponseDto[];
  periods: FinancialPeriodResponseDto[];
  selectedYearCode: string;
  fromDate: string;
  toDate: string;
}

export function AccountActivity({ journals, financialYears, periods: initialPeriods, selectedYearCode: initialYearCode, fromDate: initialFromDate, toDate: initialToDate }: Props) {
  const router = useRouter();
  const rows = useMemo<ActivityRow[]>(() => journals.flatMap((journal) => (
    (journal.lines ?? []).map((line) => ({
      id: line.id,
      journalCode: journal.code,
      postingDate: journal.postingDate,
      documentTypeLabel: journal.documentTypeLabel,
      documentId: journal.documentId,
      glAccountCode: line.glAccountCode,
      glAccountName: line.glAccountName,
      description: line.description,
      drCr: line.drCr,
      debit: line.drCr === "DR" ? line.baseCurrencyAmount : null,
      credit: line.drCr === "CR" ? line.baseCurrencyAmount : null,
      status: journal.status,
    }))
  )), [journals]);
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

  const accounts = useMemo(() => [...new Set(rows.map((row) => row.glAccountCode))].sort(), [rows]);
  const documentTypes = useMemo(() => [...new Set(rows.map((row) => row.documentTypeLabel))].sort(), [rows]);
  const entryTypes = useMemo(() => [...new Set(rows.map((row) => row.drCr))].sort(), [rows]);
  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort(), [rows]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "glAccountCode", label: "Account", type: "checkbox", options: accounts },
    { key: "documentTypeLabel", label: "Document", type: "checkbox", options: documentTypes },
    { key: "drCr", label: "DR / CR", type: "checkbox", options: entryTypes },
    { key: "status", label: "Status", type: "checkbox", options: statuses },
  ], [accounts, documentTypes, entryTypes, statuses]);
  const filtered = useMemo(() => {
    let result = rows.filter((row) => row.postingDate >= fromDate && row.postingDate <= toDate);
    const query = search.trim().toLowerCase();
    if (query) result = result.filter((row) => [row.journalCode, row.documentId, row.documentTypeLabel, row.glAccountCode, row.glAccountName, row.description].some((value) => value.toLowerCase().includes(query)));
    const accountFilter = activeFilters.glAccountCode as string[] | undefined;
    if (accountFilter?.length) result = result.filter((row) => accountFilter.includes(row.glAccountCode));
    const documentFilter = activeFilters.documentTypeLabel as string[] | undefined;
    if (documentFilter?.length) result = result.filter((row) => documentFilter.includes(row.documentTypeLabel));
    const entryFilter = activeFilters.drCr as string[] | undefined;
    if (entryFilter?.length) result = result.filter((row) => entryFilter.includes(row.drCr));
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
  const handleExport = async (exportRows: ActivityRow[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "glAccountCode", label: "Account Code" },
          { key: "glAccountName", label: "Account Name" },
          { key: "postingDate", label: "Date" },
          { key: "journalCode", label: "Journal" },
          { key: "documentTypeLabel", label: "Document" },
          { key: "documentId", label: "Document ID" },
          { key: "description", label: "Description" },
          { key: "debit", label: "Debit" },
          { key: "credit", label: "Credit" },
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
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "account_activity_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "account_activity_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "account_activity_full_dataset"); } },
  ], [filtered, rows, selectedRows]);

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_balance</span></div>
          <div className={layout.slotTitleText}>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Account Activity</h1>
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
          <Input search containerClassName={localStyles.search} placeholder="Search account activity..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} />
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
        <DataTable columns={columns} rows={paginated} selectedIds={selectedIds} isAllSelected={isAllSelected} isSomeSelected={isSomeSelected} onSelectAll={() => setSelectedIds((current) => isAllSelected ? new Set([...current].filter((id) => !paginated.some((row) => row.id === id))) : new Set([...current, ...paginated.map((row) => row.id)]))} onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })} onRowClick={(row) => router.push(`/finance/journals/${encodeURIComponent(row.journalCode)}`)} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalCount={rows.length} filteredCount={filtered.length} itemLabel="lines" hasData={rows.length > 0} emptyIcon="account_balance" emptyTitle="No account activity found" emptyText="No general ledger activity has been posted" emptyFilterText="No activity matches the selected period or filters" mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.glAccountCode}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.glAccountName}</span></div><div className={listStyles.mobileMeta}>{row.journalCode} - {money(row.debit ?? row.credit)}</div><Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge></div>} />
      </div>
    </div>
  );
}
