"use client";

import { financeApiUrl } from "@voyzu/finance/common/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { FinancialPeriodResponseDto } from "@voyzu/finance/types/modules/financial-periods";
import type { FinancialYearResponseDto } from "@voyzu/finance/types/modules/financial-years";
import type { TaxLedgerEntriesAuditResponseDto } from "@voyzu/finance/types/modules/company-reports";
import { Breadcrumbs } from "@voyzu/ui-components";
import { Button } from "@voyzu/ui-components";
import { Checkbox } from "@voyzu/ui-components";
import { DatePicker } from "@voyzu/ui-components";
import { DropdownMenu, type DropdownMenuItem } from "@voyzu/ui-components";
import { SearchableSelect } from "@voyzu/ui-components";

import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { TaxLedgerEntriesAuditReportTemplate } from "../templates/TaxLedgerEntriesAuditReportTemplate";
import localStyles from "../templates/journal-entries-report.module.css";
import optionStyles from "./profit-loss-report.module.css";

const A4_LANDSCAPE_WIDTH_MM = 297;

function titleToFileSlug(title: string): string {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "report";
}
function todayIso(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatPeriodDateRange(period: FinancialPeriodResponseDto): string {
  return `${period.startDate} - ${period.endDate}`;
}

function rangeForPreset(value: string, year: FinancialYearResponseDto | undefined): { fromDate: string; toDate: string } {
  const today = new Date();
  const yearStart = year?.startDate;
  const yearEnd = year?.endDate;

  if (value === "this-month") {
    const fromDate = toIso(new Date(today.getFullYear(), today.getMonth(), 1));
    const toDate = toIso(today);
    return {
      fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate,
      toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate,
    };
  }

  if (value === "last-three-months") {
    const fromDate = toIso(new Date(today.getFullYear(), today.getMonth() - 3, 1));
    const toDate = toIso(new Date(today.getFullYear(), today.getMonth(), 0));
    return {
      fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate,
      toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate,
    };
  }

  if (value === "previous-90-days") {
    const fromDate = toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
    const toDate = toIso(today);
    return {
      fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate,
      toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate,
    };
  }

  if (value === "previous-2-complete-months") {
    const fromDate = toIso(new Date(today.getFullYear(), today.getMonth() - 2, 1));
    const toDate = toIso(new Date(today.getFullYear(), today.getMonth(), 0));
    return {
      fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate,
      toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate,
    };
  }

  if (value === "previous-6-complete-months") {
    const fromDate = toIso(new Date(today.getFullYear(), today.getMonth() - 6, 1));
    const toDate = toIso(new Date(today.getFullYear(), today.getMonth(), 0));
    return {
      fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate,
      toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate,
    };
  }

  if (value === "entire-financial-year" && year) return { fromDate: year.startDate, toDate: year.endDate };

  const fromDate = toIso(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const toDate = toIso(new Date(today.getFullYear(), today.getMonth(), 0));
  return {
    fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate,
    toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate,
  };
}

interface TaxLedgerEntriesAuditReportProps {
  pageTitle: string;
  initialData: TaxLedgerEntriesAuditResponseDto | null;
  initialFromDate: string;
  initialToDate: string;
  initialFinancialYears: FinancialYearResponseDto[];
  initialPeriods: FinancialPeriodResponseDto[];
  initialSelectedYearCode: string;
  selectedCompanyId: number | null;
}

export function TaxLedgerEntriesAuditReport({
  pageTitle,
  initialData,
  initialFromDate,
  initialToDate,
  initialFinancialYears,
  initialPeriods,
  initialSelectedYearCode,
  selectedCompanyId,
}: TaxLedgerEntriesAuditReportProps) {
  const [data, setData] = useState<TaxLedgerEntriesAuditResponseDto | null>(initialData);
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);
  const [financialYears, setFinancialYears] = useState(initialFinancialYears);
  const [periods, setPeriods] = useState(initialPeriods);
  const [selectedYearCode, setSelectedYearCode] = useState(initialSelectedYearCode);
  const [rangePreset, setRangePreset] = useState("previous-90-days");
  const [rangeLabel, setRangeLabel] = useState("Previous 90 days");
  const [loading, setLoading] = useState(false);
  const [showSnapshotData, setShowSnapshotData] = useState(false);
  const isFirstRender = useRef(true);

  const fetchData = useCallback(async (companyId: number, rangeStart: string, rangeEnd: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ companyId: String(companyId), fromDate: rangeStart, toDate: rangeEnd });
      const res = await fetch(await financeApiUrl(`/reports/tax-ledger-entries-audit?${params.toString()}`));
      if (!res.ok) return;
      setData((await res.json()) as TaxLedgerEntriesAuditResponseDto);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!selectedCompanyId) return;
    void fetchData(selectedCompanyId, fromDate, toDate);
  }, [selectedCompanyId, fromDate, toDate, fetchData]);

  const selectedYear = useMemo(
    () => financialYears.find((year) => year.code === selectedYearCode),
    [financialYears, selectedYearCode],
  );
  const isHistoricalYear = Boolean(selectedYear && (selectedYear.startDate > todayIso() || selectedYear.endDate < todayIso()));

  const yearOptions = useMemo(
    () => financialYears.map((year) => ({ value: year.code, label: year.name, code: year.code })),
    [financialYears],
  );

  const applyPreset = useCallback((value: string, label: string, year: FinancialYearResponseDto | undefined) => {
    const range = rangeForPreset(value, year);
    setRangePreset(value);
    setRangeLabel(label);
    setFromDate(range.fromDate);
    setToDate(range.toDate);
  }, []);

  const fetchPeriods = useCallback(async (companyId: number, yearCode: string) => {
    const res = await fetch(await financeApiUrl(`/financial-years/${yearCode}/periods`));
    if (!res.ok) {
      setPeriods([]);
      return [];
    }
    const json = (await res.json()) as FinancialPeriodResponseDto[];
    setPeriods(json);
    return json;
  }, []);

  const handleYearChange = async (yearCode: string) => {
    setSelectedYearCode(yearCode);
    const nextYear = financialYears.find((year) => year.code === yearCode);
    const historical = Boolean(nextYear && (nextYear.startDate > todayIso() || nextYear.endDate < todayIso()));
    if (historical) {
      setRangePreset("entire-financial-year");
      setRangeLabel("Financial year");
    }
    if (selectedCompanyId) await fetchPeriods(selectedCompanyId, yearCode);
    if (historical && nextYear) {
      setRangePreset("entire-financial-year");
      setRangeLabel("Financial year");
      setFromDate(nextYear.startDate);
      setToDate(nextYear.endDate);
      return;
    }
    applyPreset("previous-90-days", "Previous 90 days", nextYear);
  };

  useEffect(() => {
    if (!selectedCompanyId) return;
    const loadYears = async () => {
      const res = await fetch(await financeApiUrl(`/financial-years`));
      if (!res.ok) return;
      const years = ((await res.json()) as FinancialYearResponseDto[]).filter((year) => year.hasPostings);
      setFinancialYears(years);
      const today = todayIso();
      const currentYear = years.find((year) => year.startDate <= today && today <= year.endDate);
      const nextYear = currentYear ?? years[0];
      setSelectedYearCode(nextYear?.code ?? "");
      if (nextYear) await fetchPeriods(selectedCompanyId, nextYear.code);
      if (!nextYear) setPeriods([]);
      if (nextYear && nextYear.endDate < today) {
        setRangePreset("entire-financial-year");
        setRangeLabel("Financial year");
        setFromDate(nextYear.startDate);
        setToDate(nextYear.endDate);
      } else {
        applyPreset("previous-90-days", "Previous 90 days", nextYear);
      }
    };
    void loadYears();
  }, [selectedCompanyId, fetchPeriods, applyPreset]);

  const companyId = data?.companyId ?? selectedCompanyId;
  const generatedAt = useMemo(
    () => new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    [],
  );

  const printableBase = "/finance/reports/tax-ledger-entries-audit/printable";
  const urlParams = new URLSearchParams({ fromDate, toDate });
  if (companyId) urlParams.set("companyId", String(companyId));
  urlParams.set("showSnapshotData", String(showSnapshotData));
  const printablePath = `${printableBase}?${urlParams.toString()}`;
  const pdfParams = new URLSearchParams({ orientation: "landscape", path: printableBase, filename: titleToFileSlug(pageTitle), fromDate, toDate });
  if (companyId) pdfParams.set("companyId", String(companyId));
  pdfParams.set("showSnapshotData", String(showSnapshotData));
  const pdfViewPath = `/api/capability/pdf-view?${pdfParams.toString()}`;
  const pdfPath = `/api/capability/pdf?${pdfParams.toString()}`;

  const periodItems: DropdownMenuItem[] = periods.map((period) => ({
    value: `period:${period.code}`,
    label: period.name,
    details: formatPeriodDateRange(period),
    muted: !period.hasPostings,
    onSelect: () => {
      setRangePreset(`period:${period.code}`);
      setRangeLabel(period.name);
      setFromDate(selectedYear && period.startDate < selectedYear.startDate ? selectedYear.startDate : period.startDate);
      setToDate(period.endDate);
    },
  }));

  const rangeItems: DropdownMenuItem[] = [
    { value: "this-month", label: "Month to date", onSelect: () => applyPreset("this-month", "Month to date", selectedYear) },
    { value: "last-month", label: "Previous month", onSelect: () => applyPreset("last-month", "Previous month", selectedYear) },
    { value: "previous-2-complete-months", label: "Previous 2 full months", onSelect: () => applyPreset("previous-2-complete-months", "Previous 2 full months", selectedYear) },
    { value: "last-three-months", label: "Previous 3 full months", onSelect: () => applyPreset("last-three-months", "Previous 3 full months", selectedYear) },
    { value: "previous-6-complete-months", label: "Previous 6 full months", onSelect: () => applyPreset("previous-6-complete-months", "Previous 6 full months", selectedYear) },
    { value: "previous-90-days", label: "Previous 90 days", onSelect: () => applyPreset("previous-90-days", "Previous 90 days", selectedYear) },
    { value: "entire-financial-year", label: "Financial year", onSelect: () => applyPreset("entire-financial-year", "Financial year", selectedYear) },
    { value: "periods", label: "Period", disabled: periodItems.length === 0, children: periodItems },
  ];
  const historicalRangeItems = rangeItems.filter(({ value }) => value === "entire-financial-year" || value === "period" || value === "periods");

  const optionItems: DropdownMenuItem[] = [
    {
      value: "show-snapshot-data",
      label: (
        <span className={optionStyles.checkboxOption}>
          <Checkbox checked={showSnapshotData} onChange={() => undefined} tabIndex={-1} />
          <span>Show snapshot data</span>
        </span>
      ),
      onSelect: () => setShowSnapshotData((checked) => !checked),
    },
  ];

  const handleFromDateChange = (value: string) => {
    setRangePreset("custom");
    setRangeLabel("Custom");
    setFromDate(selectedYear && value < selectedYear.startDate ? selectedYear.startDate : value);
  };

  const handleToDateChange = (value: string) => {
    setRangePreset("custom");
    setRangeLabel("Custom");
    setToDate(value);
  };

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>manage_search</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{pageTitle}</h1>
        </div>
        <div className={layout.slotToolbarLeft}>
          <div className={localStyles.dateRange}>
            <div className={localStyles.yearControl}>
              <SearchableSelect
                value={selectedYearCode}
                onChange={handleYearChange}
                options={yearOptions}
                placeholder="Financial year"
                searchable={false}
                dropdownWidth="trigger"
                disabled={yearOptions.length === 0}
              />
            </div>
            <div className={localStyles.rangePreset}>
              <DropdownMenu
                alignment="left"
                width={240}
                selectedValue={rangePreset}
                items={isHistoricalYear ? historicalRangeItems : rangeItems}
                trigger={<Button variant="secondary" icon="date_range">{rangeLabel}</Button>}
              />
            </div>
            {!isHistoricalYear && <>
              <div className={localStyles.dateControl}>
                <DatePicker value={fromDate} onChange={handleFromDateChange} clearable={false} />
              </div>
              <span className={localStyles.rangeSeparator}>through</span>
              <div className={localStyles.dateControl}>
                <DatePicker value={toDate} onChange={handleToDateChange} clearable={false} />
              </div>
            </>}
          </div>
        </div>
        <div className={layout.slotToolbarRight}>
          <DropdownMenu
            alignment="right"
            width={240}
            items={optionItems}
            trigger={<Button variant="plain" icon="tune" title="Options" />}
            closeOnSelect={false}
          />
          <div className={listStyles.divider} />
          <Button variant="secondary" icon="open_in_new" title="Printable Page" onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")} />
          <Button variant="secondary" icon="picture_as_pdf" title="View PDF" onClick={() => window.open(pdfViewPath, "_blank", "noopener,noreferrer")} />
          <Button variant="secondary" icon="download" title="Download PDF" onClick={() => window.open(pdfPath)} />
        </div>
      </header>

      <div className={layout.slotDocument}>
        {loading && <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>Loading...</div>}
        {!loading && data && (
          <div className={layout.document} style={{ maxWidth: `${A4_LANDSCAPE_WIDTH_MM}mm` }}>
            <TaxLedgerEntriesAuditReportTemplate data={data} generatedAt={generatedAt} showSnapshotData={showSnapshotData} />
          </div>
        )}
        {!loading && !data && (
          <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>No data available. Select a company to view the Tax Ledger Entries.</div>
        )}
      </div>
    </div>
  );
}
