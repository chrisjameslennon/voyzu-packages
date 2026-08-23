"use client";

import { financeApiUrl } from "@voyzu/finance/common/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { FinancialYearResponseDto } from "@voyzu/finance/types/modules/financial-years";
import type { TaxActivityReconciliationResponseDto } from "@voyzu/finance/types/modules/company-reports";
import { Breadcrumbs } from "@voyzu/ui-components";
import { Button } from "@voyzu/ui-components";
import { Checkbox } from "@voyzu/ui-components";
import { DropdownMenu, type DropdownMenuItem } from "@voyzu/ui-components";
import { SearchableSelect } from "@voyzu/ui-components";

import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import styles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import localStyles from "./trial-balance-report.module.css";
import { TaxActivityReconciliationReportTemplate } from "../templates/TaxActivityReconciliationReportTemplate";

const A4_LANDSCAPE_WIDTH_MM = 297;

function titleToFileSlug(title: string): string {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "report";
}

interface FilingPeriod {
  value: string;
  label: string;
  startDate: string;
  endDate: string;
}

function todayIso(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

function parseIso(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function iso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function monthName(month: number): string {
  return new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(2026, month - 1, 1));
}

interface FinanceCompanyFilingSettings { id: number; taxFilingAnchorMonth: number; taxFilingIntervalMonths: number }

function deriveFilingPeriods(company: FinanceCompanyFilingSettings, year: FinancialYearResponseDto | undefined): FilingPeriod[] {
  if (!year) return [];
  const start = parseIso(year.startDate);
  const end = parseIso(year.endDate);
  const anchor = company.taxFilingAnchorMonth;
  const interval = company.taxFilingIntervalMonths;
  const periods: FilingPeriod[] = [];

  let cursor = new Date(start.getFullYear() - 1, 0, 1);
  const limit = new Date(end.getFullYear() + 1, 11, 31);

  while (cursor <= limit) {
    const month = cursor.getMonth() + 1;
    const monthsFromAnchor = (month - anchor + 12) % interval;
    if (monthsFromAnchor === 0) {
      const periodEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
      const periodStart = new Date(cursor.getFullYear(), cursor.getMonth() - interval + 1, 1);
      if (periodEnd >= start && periodStart <= end) {
        const clampedStart = periodStart < start ? start : periodStart;
        const clampedEnd = periodEnd > end ? end : periodEnd;
        const label = `${monthName(clampedStart.getMonth() + 1)} ${clampedStart.getFullYear()} - ${monthName(clampedEnd.getMonth() + 1)} ${clampedEnd.getFullYear()}`;
        periods.push({
          value: `${iso(clampedStart)}:${iso(clampedEnd)}`,
          label,
          startDate: iso(clampedStart),
          endDate: iso(clampedEnd),
        });
      }
    }
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return periods;
}

interface TaxActivityReconciliationReportProps {
  pageTitle: string;
  initialData: TaxActivityReconciliationResponseDto | null;
  initialFinancialYears: FinancialYearResponseDto[];
  initialSelectedYearCode: string;
  initialSelectedPeriodValue: string;
  selectedCompany: FinanceCompanyFilingSettings | null;
}

export function TaxActivityReconciliationReport({
  pageTitle,
  initialData,
  initialFinancialYears,
  initialSelectedYearCode,
  initialSelectedPeriodValue,
  selectedCompany,
}: TaxActivityReconciliationReportProps) {
  const [data, setData] = useState<TaxActivityReconciliationResponseDto | null>(initialData);
  const [financialYears, setFinancialYears] = useState<FinancialYearResponseDto[]>(initialFinancialYears);
  const [selectedYearCode, setSelectedYearCode] = useState(initialSelectedYearCode);
  const [selectedPeriodValue, setSelectedPeriodValue] = useState(initialSelectedPeriodValue);
  const [selectedTaxAuthorityCode, setSelectedTaxAuthorityCode] = useState(initialData?.taxAuthorityCode ?? "");
  const [loading, setLoading] = useState(false);
  const [showCompanyHeader, setShowCompanyHeader] = useState(false);
  const [showCompanyFooter, setShowCompanyFooter] = useState(false);
  const [showDecimals, setShowDecimals] = useState(false);
  const isFirstRender = useRef(true);

  const selectedYear = useMemo(() => financialYears.find((year) => year.code === selectedYearCode), [financialYears, selectedYearCode]);
  const yearOptions = useMemo(() => financialYears.map((year) => ({ value: year.code, label: year.name, code: year.code })), [financialYears]);
  const filingPeriods = useMemo(() => selectedCompany ? deriveFilingPeriods(selectedCompany, selectedYear) : [], [selectedCompany, selectedYear]);
  const periodOptions = useMemo(() => filingPeriods.map((period) => ({ value: period.value, label: period.label })), [filingPeriods]);
  const selectedPeriod = filingPeriods.find((period) => period.value === selectedPeriodValue) ?? filingPeriods[0];
  const taxAuthorityOptions = useMemo(() => (data?.taxAuthorityOptions ?? []).map((authority) => ({
    value: authority.taxAuthorityCode,
    label: authority.taxAuthorityCode,
    code: authority.taxAuthorityName,
  })), [data?.taxAuthorityOptions]);

  const fetchData = useCallback(async (companyId: number, period: FilingPeriod, taxAuthorityCode: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        companyId: String(companyId),
        periodStartDate: period.startDate,
        periodEndDate: period.endDate,
        periodLabel: period.label,
      });
      if (taxAuthorityCode) params.set("taxAuthorityCode", taxAuthorityCode);
      const res = await fetch(await financeApiUrl(`/reports/tax-activity-reconciliation?${params.toString()}`));
      if (!res.ok) return;
      const nextData = (await res.json()) as TaxActivityReconciliationResponseDto;
      setData(nextData);
      setSelectedTaxAuthorityCode(nextData.taxAuthorityCode);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!selectedCompany || !selectedPeriod) return;
    void fetchData(selectedCompany.id, selectedPeriod, selectedTaxAuthorityCode);
  }, [selectedCompany, selectedPeriod?.value, selectedTaxAuthorityCode, fetchData]);

  useEffect(() => {
    if (!selectedCompany) return;
    const loadYears = async () => {
      const res = await fetch(await financeApiUrl(`/financial-years`));
      if (!res.ok) return;
      const years = ((await res.json()) as FinancialYearResponseDto[]).filter((year) => year.hasPostings);
      setFinancialYears(years);
      const today = todayIso();
      const nextYear = years.find((year) => year.startDate <= today && today <= year.endDate) ?? years[0];
      setSelectedYearCode(nextYear?.code ?? "");
    };
    void loadYears();
  }, [selectedCompany?.id]);

  useEffect(() => {
    if (filingPeriods.length === 0) {
      setSelectedPeriodValue("");
      return;
    }
    const today = todayIso();
    const currentPeriod = filingPeriods.find((period) => period.startDate <= today && today <= period.endDate) ?? filingPeriods[0];
    setSelectedPeriodValue(currentPeriod.value);
  }, [filingPeriods]);

  const handleYearChange = (yearCode: string) => {
    setSelectedYearCode(yearCode);
    setSelectedPeriodValue("");
  };

  const companyId = data?.companyId ?? selectedCompany?.id;
  const generatedAt = useMemo(() => new Date().toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }), []);

  const printableBase = "/finance/reports/tax-activity-reconciliation/printable";
  const urlParams = new URLSearchParams();
  if (companyId) urlParams.set("companyId", String(companyId));
  if (selectedPeriod) {
    urlParams.set("periodStartDate", selectedPeriod.startDate);
    urlParams.set("periodEndDate", selectedPeriod.endDate);
    urlParams.set("periodLabel", selectedPeriod.label);
  }
  if (selectedTaxAuthorityCode) urlParams.set("taxAuthorityCode", selectedTaxAuthorityCode);
  urlParams.set("showCompanyHeader", String(showCompanyHeader));
  urlParams.set("showCompanyFooter", String(showCompanyFooter));
  urlParams.set("showDecimals", String(showDecimals));
  const printablePath = `${printableBase}?${urlParams.toString()}`;
  const pdfParams = new URLSearchParams({ orientation: "landscape", path: printableBase, filename: titleToFileSlug(pageTitle) });
  urlParams.forEach((value, key) => pdfParams.set(key, value));
  const pdfViewPath = `/api/capability/pdf-view?${pdfParams.toString()}`;
  const pdfPath = `/api/capability/pdf?${pdfParams.toString()}`;

  const optionItems: DropdownMenuItem[] = [
    { value: "show-decimals", label: <span className={localStyles.checkboxOption}><Checkbox checked={showDecimals} onChange={() => undefined} tabIndex={-1} /><span>Show decimals</span></span>, onSelect: () => setShowDecimals((checked) => !checked) },
    { value: "show-company-header", label: <span className={localStyles.checkboxOption}><Checkbox checked={showCompanyHeader} onChange={() => undefined} tabIndex={-1} /><span>Show company header</span></span>, onSelect: () => setShowCompanyHeader((checked) => !checked) },
    { value: "show-company-footer", label: <span className={localStyles.checkboxOption}><Checkbox checked={showCompanyFooter} onChange={() => undefined} tabIndex={-1} /><span>Show company footer</span></span>, onSelect: () => setShowCompanyFooter((checked) => !checked) },
  ];

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={styles.titleIcon}>
            <span className={`material-symbols-outlined ${styles.titleIconSymbol}`}>rule</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{pageTitle}</h1>
        </div>
        <div className={layout.slotToolbarLeft}>
          {yearOptions.length > 0 && (
            <div style={{ width: "280px" }}>
              <SearchableSelect value={selectedYearCode} onChange={handleYearChange} options={yearOptions} placeholder="Financial year" searchable={false} codeBadge={false} />
            </div>
          )}
          <div style={{ width: "280px" }}>
            <SearchableSelect value={selectedPeriodValue} onChange={setSelectedPeriodValue} options={periodOptions} placeholder="Filing period" searchable={false} codeBadge={false} disabled={periodOptions.length === 0} />
          </div>
          <div style={{ width: "280px" }}>
            <SearchableSelect value={selectedTaxAuthorityCode} onChange={setSelectedTaxAuthorityCode} options={taxAuthorityOptions} placeholder="Tax authority" searchable={false} codeBadge disabled={taxAuthorityOptions.length === 0} />
          </div>
        </div>
        <div className={layout.slotToolbarRight}>
          <DropdownMenu alignment="right" width={240} items={optionItems} trigger={<Button variant="plain" icon="tune" title="Options" />} closeOnSelect={false} />
          <div className={styles.divider} />
          <Button variant="secondary" icon="open_in_new" title="Printable Page" onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")} />
          <Button variant="secondary" icon="picture_as_pdf" title="View PDF" onClick={() => window.open(pdfViewPath, "_blank", "noopener,noreferrer")} />
          <Button variant="secondary" icon="download" title="Download PDF" onClick={() => window.open(pdfPath)} />
        </div>
      </header>
      <div className={layout.slotDocument}>
        {loading && <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>Loading...</div>}
        {!loading && data && (
          <div className={layout.document} style={{ maxWidth: `${A4_LANDSCAPE_WIDTH_MM}mm` }}>
            <TaxActivityReconciliationReportTemplate data={data} generatedAt={generatedAt} showCompanyHeader={showCompanyHeader} showCompanyFooter={showCompanyFooter} showDecimals={showDecimals} />
          </div>
        )}
        {!loading && !data && <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>No data available. Select a company to view the tax reconciliation.</div>}
      </div>
    </div>
  );
}
