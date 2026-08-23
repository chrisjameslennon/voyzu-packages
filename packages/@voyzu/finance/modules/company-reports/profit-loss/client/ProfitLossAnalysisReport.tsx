"use client";

import { financeApiUrl } from "@voyzu/finance/common/client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

import type { FinancialPeriodResponseDto } from "@voyzu/finance/types/modules/financial-periods";
import type { FinancialYearResponseDto } from "@voyzu/finance/types/modules/financial-years";
import type { ProfitLossBreakdownDto, ProfitLossAnalysisResponseDto, ProfitLossDimensionSelectionDto } from "@voyzu/finance/types/modules/company-reports";
import type { DimensionResponseDto } from "@voyzu/finance/types/modules/dimensions";
import { Button } from "@voyzu/ui-components";
import { Breadcrumbs } from "@voyzu/ui-components";
import { Checkbox } from "@voyzu/ui-components";
import { DatePicker } from "@voyzu/ui-components";
import { DropdownMenu, type DropdownMenuItem } from "@voyzu/ui-components";
import { FilterChips, FilterPanel, type FilterState, type FilterTab } from "@voyzu/ui-components";
import filterStyles from "@voyzu/ui-components/filter-panel/filter-panel.module.css";
import { SearchableSelect } from "@voyzu/ui-components";
import { ProfitLossAnalysisReportTemplate } from "../templates/ProfitLossAnalysisReportTemplate";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import styles from "@voyzu/ui-style/css-modules/list.module.css";
import localStyles from "./profit-loss-report.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

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
    return { fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate, toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate };
  }
  if (value === "last-three-months") {
    const fromDate = toIso(new Date(today.getFullYear(), today.getMonth() - 3, 1));
    const toDate = toIso(new Date(today.getFullYear(), today.getMonth(), 0));
    return { fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate, toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate };
  }
  if (value === "previous-90-days") {
    const fromDate = toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
    const toDate = toIso(today);
    return { fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate, toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate };
  }
  if (value === "previous-2-complete-months") {
    const fromDate = toIso(new Date(today.getFullYear(), today.getMonth() - 2, 1));
    const toDate = toIso(new Date(today.getFullYear(), today.getMonth(), 0));
    return { fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate, toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate };
  }
  if (value === "previous-6-complete-months") {
    const fromDate = toIso(new Date(today.getFullYear(), today.getMonth() - 6, 1));
    const toDate = toIso(new Date(today.getFullYear(), today.getMonth(), 0));
    return { fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate, toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate };
  }
  if (value === "entire-financial-year" && year) return { fromDate: year.startDate, toDate: year.endDate };
  const fromDate = toIso(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const toDate = toIso(new Date(today.getFullYear(), today.getMonth(), 0));
  return { fromDate: yearStart && fromDate < yearStart ? yearStart : fromDate, toDate: yearEnd && toDate > yearEnd ? yearEnd : toDate };
}

interface ProfitLossAnalysisReportProps {
  pageTitle: string;
  initialData: ProfitLossAnalysisResponseDto | null;
  initialFromDate: string;
  initialToDate: string;
  initialFinancialYears: FinancialYearResponseDto[];
  initialPeriods: FinancialPeriodResponseDto[];
  initialSelectedYearCode: string;
  dimensions: DimensionResponseDto[];
  organizationName: string;
  selectedCompanyId: number | null;
}

export function ProfitLossAnalysisReport({
  pageTitle,
  initialData,
  initialFromDate,
  initialToDate,
  initialFinancialYears,
  initialPeriods,
  initialSelectedYearCode,
  dimensions,
  organizationName,
  selectedCompanyId,
}: ProfitLossAnalysisReportProps) {
  const [data, setData] = useState<ProfitLossAnalysisResponseDto | null>(initialData);
  const [fromDate, setFromDate] = useState<string>(initialFromDate);
  const [toDate, setToDate] = useState<string>(initialToDate);
  const [financialYears, setFinancialYears] = useState<FinancialYearResponseDto[]>(initialFinancialYears);
  const [periods, setPeriods] = useState<FinancialPeriodResponseDto[]>(initialPeriods);
  const [selectedYearCode, setSelectedYearCode] = useState(initialSelectedYearCode);
  const [rangePreset, setRangePreset] = useState("previous-90-days");
  const [rangeLabel, setRangeLabel] = useState("Previous 90 days");
  const [dimensionFilters, setDimensionFilters] = useState<FilterState>({});
  const [breakdownDimensionCode, setBreakdownDimensionCode] = useState("");
  const [breakdownValuesByDimension, setBreakdownValuesByDimension] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showAccountCode, setShowAccountCode] = useState(false);
  const [showOrganization, setShowOrganization] = useState(false);
  const [showCompanyHeader, setShowCompanyHeader] = useState(false);
  const [showCompanyFooter, setShowCompanyFooter] = useState(false);
  const [showDecimals, setShowDecimals] = useState(false);
  const isFirstRender = useRef(true);

  const activeDimensions = useMemo(
    () => dimensions.filter((dimension) => dimension.status === "ACTIVE").map((dimension) => ({
      ...dimension,
      values: (dimension.values ?? []).filter((value) => value.status === "ACTIVE"),
    })),
    [dimensions],
  );

  const filterTabs = useMemo<FilterTab[]>(
    () => activeDimensions.map((dimension) => ({
      key: dimension.code,
      label: dimension.name,
      panelTitle: dimension.name,
      type: "checkbox" as const,
      options: (dimension.values ?? []).map((value) => value.name),
    })),
    [activeDimensions],
  );

  const filterPayload = useMemo<ProfitLossDimensionSelectionDto[]>(
    () => activeDimensions.map((dimension) => ({
      dimensionCode: dimension.code,
      dimensionName: dimension.name,
      valueNames: ((dimensionFilters[dimension.code] as string[] | undefined) ?? []),
    })).filter((dimension) => dimension.valueNames.length > 0),
    [activeDimensions, dimensionFilters],
  );

  const selectedBreakdownDimension = useMemo(
    () => activeDimensions.find((dimension) => dimension.code === breakdownDimensionCode) ?? null,
    [activeDimensions, breakdownDimensionCode],
  );

  const breakdownPayload = useMemo<ProfitLossBreakdownDto | null>(() => {
    if (!selectedBreakdownDimension) return null;
    return {
      dimensionCode: selectedBreakdownDimension.code,
      dimensionName: selectedBreakdownDimension.name,
      valueNames: breakdownValuesByDimension[selectedBreakdownDimension.code] ?? [],
    };
  }, [selectedBreakdownDimension, breakdownValuesByDimension]);

  const fetchData = useCallback(async (
    companyId: number,
    rangeStart: string,
    rangeEnd: string,
    filters: ProfitLossDimensionSelectionDto[],
    breakdown: ProfitLossBreakdownDto | null,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        companyId: String(companyId),
        fromDate: rangeStart,
        toDate: rangeEnd,
        dimensionFilters: JSON.stringify(filters),
      });
      if (breakdown) params.set("breakdown", JSON.stringify(breakdown));
      const res = await fetch(await financeApiUrl(`/reports/profit-loss-analysis?${params.toString()}`));
      if (!res.ok) return;
      setData((await res.json()) as ProfitLossAnalysisResponseDto);
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
    void fetchData(selectedCompanyId, fromDate, toDate, filterPayload, breakdownPayload);
  }, [selectedCompanyId, fromDate, toDate, filterPayload, breakdownPayload, fetchData]);

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

  const periodItems: DropdownMenuItem[] = periods
    .map((period) => ({
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

  const handleBreakdownDimensionChange = (dimensionCode: string) => {
    setBreakdownDimensionCode(dimensionCode);
    const dimension = activeDimensions.find((item) => item.code === dimensionCode);
    if (!dimension || breakdownValuesByDimension[dimensionCode]) return;
    setBreakdownValuesByDimension((prev) => ({
      ...prev,
      [dimensionCode]: (dimension.values ?? []).map((value) => value.name),
    }));
  };

  const toggleBreakdownValue = (dimensionCode: string, valueName: string) => {
    setBreakdownValuesByDimension((prev) => {
      const current = prev[dimensionCode] ?? [];
      const nextValues = current.includes(valueName)
        ? current.filter((value) => value !== valueName)
        : [...current, valueName];
      return { ...prev, [dimensionCode]: nextValues };
    });
  };

  const breakdownValueItems: DropdownMenuItem[] = (selectedBreakdownDimension?.values ?? []).map((value) => ({
    value: `${selectedBreakdownDimension?.code}:${value.name}`,
    label: (
      <span className={localStyles.checkboxOption}>
        <Checkbox checked={(breakdownValuesByDimension[selectedBreakdownDimension?.code ?? ""] ?? []).includes(value.name)} onChange={() => undefined} tabIndex={-1} />
        <span>{value.name}</span>
      </span>
    ),
    onSelect: () => {
      if (selectedBreakdownDimension) toggleBreakdownValue(selectedBreakdownDimension.code, value.name);
    },
  }));

  const optionItems: DropdownMenuItem[] = [
    { value: "show-account-code", label: <span className={localStyles.checkboxOption}><Checkbox checked={showAccountCode} onChange={() => undefined} tabIndex={-1} /><span>Show account code</span></span>, onSelect: () => setShowAccountCode((checked) => !checked) },
    { value: "show-decimals", label: <span className={localStyles.checkboxOption}><Checkbox checked={showDecimals} onChange={() => undefined} tabIndex={-1} /><span>Show decimals</span></span>, onSelect: () => setShowDecimals((checked) => !checked) },
    { value: "show-organization", label: <span className={localStyles.checkboxOption}><Checkbox checked={showOrganization} onChange={() => undefined} tabIndex={-1} /><span>Show organization name</span></span>, onSelect: () => setShowOrganization((checked) => !checked) },
    { value: "show-company-header", label: <span className={localStyles.checkboxOption}><Checkbox checked={showCompanyHeader} onChange={() => undefined} tabIndex={-1} /><span>Show company header</span></span>, onSelect: () => setShowCompanyHeader((checked) => !checked) },
    { value: "show-company-footer", label: <span className={localStyles.checkboxOption}><Checkbox checked={showCompanyFooter} onChange={() => undefined} tabIndex={-1} /><span>Show company footer</span></span>, onSelect: () => setShowCompanyFooter((checked) => !checked) },
  ];

  const generatedAt = useMemo(
    () => new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    [],
  );

  const hasActiveFilters = filterPayload.length > 0;
  const companyId = data?.companyId ?? selectedCompanyId;
  const printableBase = "/finance/reports/profit-loss-analysis/printable";
  const urlParams = new URLSearchParams();
  if (companyId) urlParams.set("companyId", String(companyId));
  urlParams.set("fromDate", fromDate);
  urlParams.set("toDate", toDate);
  urlParams.set("dimensionFilters", JSON.stringify(filterPayload));
  if (breakdownPayload) urlParams.set("breakdown", JSON.stringify(breakdownPayload));
  urlParams.set("showAccountCode", String(showAccountCode));
  urlParams.set("showOrganization", String(showOrganization));
  urlParams.set("showCompanyHeader", String(showCompanyHeader));
  urlParams.set("showCompanyFooter", String(showCompanyFooter));
  urlParams.set("showDecimals", String(showDecimals));
  const queryString = urlParams.toString();

  const printablePath = `${printableBase}${queryString ? `?${queryString}` : ""}`;
  const pdfParams = new URLSearchParams({
    orientation: "landscape",
    path: printableBase,
    filename: titleToFileSlug(pageTitle),
    fromDate,
    toDate,
    dimensionFilters: JSON.stringify(filterPayload),
  });
  if (companyId) pdfParams.set("companyId", String(companyId));
  if (breakdownPayload) pdfParams.set("breakdown", JSON.stringify(breakdownPayload));
  pdfParams.set("showAccountCode", String(showAccountCode));
  pdfParams.set("showOrganization", String(showOrganization));
  pdfParams.set("showCompanyHeader", String(showCompanyHeader));
  pdfParams.set("showCompanyFooter", String(showCompanyFooter));
  pdfParams.set("showDecimals", String(showDecimals));
  const pdfViewPath = `/api/capability/pdf-view?${pdfParams.toString()}`;
  const pdfPath = `/api/capability/pdf?${pdfParams.toString()}`;

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={styles.titleIcon}>
            <span className={`material-symbols-outlined ${styles.titleIconSymbol}`}>trending_up</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{pageTitle}</h1>
        </div>
        <div className={layout.slotToolbarLeft}>
          <div className={localStyles.reportControlStack}>
            <div className={localStyles.filterBox}>
              <div className={localStyles.filterBoxTitle}>Filter by date</div>
              <div className={localStyles.dateRange}>
                <div className={localStyles.yearControlNarrow}>
                  <SearchableSelect value={selectedYearCode} onChange={handleYearChange} options={yearOptions} placeholder="Financial year" searchable={false} dropdownWidth="trigger" disabled={yearOptions.length === 0} />
                </div>
                <div className={localStyles.rangePreset}>
                  <DropdownMenu alignment="left" width={240} selectedValue={rangePreset} items={isHistoricalYear ? historicalRangeItems : rangeItems} trigger={<Button variant="secondary" icon="date_range">{rangeLabel}</Button>} />
                </div>
                {!isHistoricalYear && <>
                  <div className={localStyles.dateControl}>
                    <DatePicker value={fromDate} onChange={(value) => { setRangePreset("custom"); setRangeLabel("Custom"); setFromDate(selectedYear && value < selectedYear.startDate ? selectedYear.startDate : value); }} clearable={false} />
                  </div>
                  <span className={localStyles.rangeSeparator}>-</span>
                  <div className={localStyles.dateControl}>
                    <DatePicker value={toDate} onChange={(value) => { setRangePreset("custom"); setRangeLabel("Custom"); setToDate(value); }} clearable={false} />
                  </div>
                </>}
              </div>
            </div>
            <div className={localStyles.filterBox}>
              <div className={localStyles.filterBoxTitle}>Filter by dimensions</div>
              <div className={localStyles.dimensionControlRow}>
                <FilterPanel
                  tabs={filterTabs}
                  filters={dimensionFilters}
                  onApply={setDimensionFilters}
                  onClear={() => setDimensionFilters({})}
                  onRemoveFilter={(key) => setDimensionFilters((prev) => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                  })}
                  showChips={false}
                />
                <span className={`${typography.fieldLabel} ${localStyles.breakdownLabel}`}>Break down by dimension</span>
                <div className={localStyles.yearControlNarrow}>
                  <SearchableSelect
                    value={breakdownDimensionCode}
                    onChange={handleBreakdownDimensionChange}
                    options={[{ value: "", label: "None" }, ...activeDimensions.map((dimension) => ({ value: dimension.code, label: dimension.name }))]}
                    placeholder="None"
                    searchable={false}
                    dropdownWidth="trigger"
                  />
                </div>
                {selectedBreakdownDimension && (
                  <DropdownMenu
                    alignment="left"
                    width={260}
                    items={breakdownValueItems}
                    closeOnSelect={false}
                    trigger={<Button variant="secondary" icon="view_column">Values</Button>}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={layout.slotToolbarRight}>
        </div>
      </header>
      <div className={layout.slotChips}>
        <div className={localStyles.reportChipsBar}>
          <div className={localStyles.reportChipsRow}>
            <div className={filterStyles.chip} title={`${fromDate} through ${toDate}`}>
              <span className={filterStyles.chipValue}>
                <strong>{fromDate}</strong> through <strong>{toDate}</strong>
              </span>
            </div>
            {hasActiveFilters && (
              <span className={filterStyles.chipAnd}>AND</span>
            )}
            {hasActiveFilters && (
              <FilterChips
                tabs={filterTabs}
                filters={dimensionFilters}
                onClear={() => setDimensionFilters({})}
                onRemoveFilter={(key) => setDimensionFilters((prev) => {
                  const next = { ...prev };
                  delete next[key];
                  return next;
                })}
              />
            )}
          </div>
          <div className={localStyles.reportChipActions}>
            <DropdownMenu alignment="right" width={240} items={optionItems} trigger={<Button variant="plain" icon="tune" title="Options" />} closeOnSelect={false} />
            <div className={styles.divider} />
            <Button variant="secondary" icon="open_in_new" title="Printable Page" onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")} />
            <Button variant="secondary" icon="picture_as_pdf" title="View PDF" onClick={() => window.open(pdfViewPath, "_blank", "noopener,noreferrer")} />
            <Button variant="secondary" icon="download" title="Download PDF" onClick={() => window.open(pdfPath)} />
          </div>
        </div>
      </div>
      <div className={layout.slotDocument}>
        {loading && <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>Loading...</div>}
        {!loading && data && (
          <div className={layout.document} style={{ maxWidth: `${A4_LANDSCAPE_WIDTH_MM}mm` }}>
            <ProfitLossAnalysisReportTemplate
              data={data}
              generatedAt={generatedAt}
              showAccountCode={showAccountCode}
              showOrganization={showOrganization}
              showCompanyHeader={showCompanyHeader}
              showCompanyFooter={showCompanyFooter}
              showDecimals={showDecimals}
              organizationName={organizationName}
            />
          </div>
        )}
        {!loading && !data && (
          <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>No data available. Select a company to view the profit and loss.</div>
        )}
      </div>
    </div>
  );
}
