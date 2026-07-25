"use client";

import { financeApiUrl } from "@voyzu/modules/common/client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

import type { BalanceSheetResponseDto, FinancialYearResponseDto } from "@voyzu/types/modules";
import {
  Breadcrumbs,
  Button,
  Checkbox,
  DatePicker,
  DropdownMenu,
  SearchableSelect,
  type DropdownMenuItem,
} from "@voyzu/ui-components";
import { BalanceSheetReportTemplate } from "../templates/BalanceSheetReportTemplate";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import styles from "@voyzu/ui-style/css-modules/list.module.css";
import localStyles from "./balance-sheet-report.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

function todayIso(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

interface BalanceSheetReportProps {
  pageTitle: string;
  initialData: BalanceSheetResponseDto | null;
  initialAsAtDate: string;
  initialFinancialYears: FinancialYearResponseDto[];
  initialSelectedYearCode: string;
  organizationName: string;
  selectedCompanyId: number | null;
}

export function BalanceSheetReport({
  pageTitle,
  initialData,
  initialAsAtDate,
  initialFinancialYears,
  initialSelectedYearCode,
  organizationName,
  selectedCompanyId,
}: BalanceSheetReportProps) {
  const [data, setData] = useState<BalanceSheetResponseDto | null>(initialData);
  const [asAtDate, setAsAtDate] = useState<string>(initialAsAtDate);
  const [financialYears, setFinancialYears] = useState<FinancialYearResponseDto[]>(initialFinancialYears);
  const [selectedYearCode, setSelectedYearCode] = useState(initialSelectedYearCode);
  const [loading, setLoading] = useState(false);
  const [showAccountCode, setShowAccountCode] = useState(false);
  const [showOrganization, setShowOrganization] = useState(false);
  const [showCompanyHeader, setShowCompanyHeader] = useState(false);
  const [showCompanyFooter, setShowCompanyFooter] = useState(false);
  const [showReportingCategories, setShowReportingCategories] = useState(true);
  const [showDecimals, setShowDecimals] = useState(false);
  const isFirstRender = useRef(true);

  const selectedYear = useMemo(
    () => financialYears.find((y) => y.code === selectedYearCode),
    [financialYears, selectedYearCode],
  );

  const yearOptions = useMemo(
    () => financialYears.map((y) => ({ value: y.code, label: y.name, code: y.code })),
    [financialYears],
  );

  const fetchData = useCallback(async (companyId: number, date: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ companyId: String(companyId) });
      if (date) params.set("asAtDate", date);
      const res = await fetch(await financeApiUrl(`/reports/balance-sheet?${params.toString()}`));
      if (!res.ok) return;
      const json = (await res.json()) as BalanceSheetResponseDto;
      setData(json);
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
    void fetchData(selectedCompanyId, asAtDate);
  }, [selectedCompanyId, asAtDate, fetchData]);

  useEffect(() => {
    if (!selectedCompanyId) return;
    const load = async () => {
      const res = await fetch(await financeApiUrl(`/reports/financial-years`));
      if (!res.ok) return;
      const years = ((await res.json()) as FinancialYearResponseDto[]).filter((y) => y.hasPostings);
      setFinancialYears(years);
      const today = todayIso();
      const current = years.find((y) => y.startDate <= today && today <= y.endDate) ?? years[0];
      setSelectedYearCode(current?.code ?? "");
      if (current) {
        const clamped = today > current.endDate ? current.endDate : today < current.startDate ? current.startDate : today;
        setAsAtDate(clamped);
      }
    };
    void load();
  }, [selectedCompanyId]);

  const handleYearChange = (yearCode: string) => {
    setSelectedYearCode(yearCode);
    const year = financialYears.find((y) => y.code === yearCode);
    if (!year) return;
    const today = todayIso();
    const clamped = today > year.endDate ? year.endDate : today < year.startDate ? year.startDate : today;
    setAsAtDate(clamped);
  };

  const handleDateChange = (date: string) => {
    if (!date) return;
    setAsAtDate(date);
  };

  const companyId = data?.companyId ?? selectedCompanyId;

  const generatedAt = useMemo(
    () =>
      new Date().toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      }),
    [],
  );

  const pdfQueryString = useMemo(() => {
    if (!companyId) return "";
    const params = new URLSearchParams({
      filename: "balance-sheet",
      showAccountCode: String(showAccountCode),
      showOrganization: String(showOrganization),
      showCompanyHeader: String(showCompanyHeader),
      showCompanyFooter: String(showCompanyFooter),
      showReportingCategories: String(showReportingCategories),
      showDecimals: String(showDecimals),
    });
    if (asAtDate) params.set("asAtDate", asAtDate);
    return params.toString();
  }, [
    asAtDate,
    companyId,
    showAccountCode,
    showCompanyFooter,
    showCompanyHeader,
    showDecimals,
    showOrganization,
    showReportingCategories,
  ]);

  const openPdf = async () => {
    if (!pdfQueryString) return;
    window.open(await financeApiUrl(`/reports/balance-sheet/pdf?${pdfQueryString}&disposition=inline`), "_blank", "noopener,noreferrer");
  };

  const downloadPdf = async () => {
    if (!pdfQueryString) return;
    window.location.href = await financeApiUrl(`/reports/balance-sheet/pdf?${pdfQueryString}&disposition=attachment`);
  };

  const refreshReport = () => {
    if (!companyId) return;
    void fetchData(companyId, asAtDate);
  };

  const optionItems: DropdownMenuItem[] = [
    {
      value: "show-account-code",
      label: (
        <span className={localStyles.checkboxOption}>
          <Checkbox checked={showAccountCode} onChange={() => undefined} tabIndex={-1} />
          <span>Show account code</span>
        </span>
      ),
      onSelect: () => setShowAccountCode((v) => !v),
    },
    {
      value: "show-decimals",
      label: (
        <span className={localStyles.checkboxOption}>
          <Checkbox checked={showDecimals} onChange={() => undefined} tabIndex={-1} />
          <span>Show decimals</span>
        </span>
      ),
      onSelect: () => setShowDecimals((v) => !v),
    },
    {
      value: "show-organization",
      label: (
        <span className={localStyles.checkboxOption}>
          <Checkbox checked={showOrganization} onChange={() => undefined} tabIndex={-1} />
          <span>Show organization name</span>
        </span>
      ),
      onSelect: () => setShowOrganization((v) => !v),
    },
    {
      value: "show-company-header",
      label: (
        <span className={localStyles.checkboxOption}>
          <Checkbox checked={showCompanyHeader} onChange={() => undefined} tabIndex={-1} />
          <span>Show company header</span>
        </span>
      ),
      onSelect: () => setShowCompanyHeader((v) => !v),
    },
    {
      value: "show-company-footer",
      label: (
        <span className={localStyles.checkboxOption}>
          <Checkbox checked={showCompanyFooter} onChange={() => undefined} tabIndex={-1} />
          <span>Show company footer</span>
        </span>
      ),
      onSelect: () => setShowCompanyFooter((v) => !v),
    },
    {
      value: "show-reporting-categories",
      label: (
        <span className={localStyles.checkboxOption}>
          <Checkbox checked={showReportingCategories} onChange={() => undefined} tabIndex={-1} />
          <span>Show reporting categories</span>
        </span>
      ),
      onSelect: () => setShowReportingCategories((v) => !v),
    },
  ];

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={styles.titleIcon}>
            <span className={`material-symbols-outlined ${styles.titleIconSymbol}`}>account_balance_wallet</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{pageTitle}</h1>
        </div>
        <div className={layout.slotToolbarLeft}>
          {yearOptions.length > 0 && (
            <div style={{ width: "220px" }}>
              <SearchableSelect
                value={selectedYearCode}
                onChange={handleYearChange}
                options={yearOptions}
                searchable={false}
                codeBadge={false}
              />
            </div>
          )}
          <div style={{ width: "200px" }}>
            <DatePicker
              value={asAtDate}
              onChange={handleDateChange}
              clearable={false}
              minDate={selectedYear?.startDate}
              maxDate={selectedYear?.endDate}
            />
          </div>
        </div>
        <div className={layout.slotToolbarRight}>
          <DropdownMenu
            trigger={<Button variant="plain" icon="tune" title="Options" />}
            items={optionItems}
            alignment="right"
            closeOnSelect={false}
          />
          <div className={styles.divider} />
          <Button variant="secondary" icon="sync" title="Refresh" disabled={loading || !companyId} onClick={refreshReport} />
          <Button variant="secondary" icon="picture_as_pdf" title="View PDF" disabled={loading || !companyId} onClick={openPdf} />
          <Button variant="secondary" icon="download" title="Download PDF" disabled={loading || !companyId} onClick={downloadPdf} />
        </div>
      </header>
      <div className={layout.slotDocument}>
        {loading && <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>Loading...</div>}
        {!loading && data && (
          <div className={layout.document} style={{ maxWidth: "210mm" }}>
            <BalanceSheetReportTemplate
              data={data}
              generatedAt={generatedAt}
              showAccountCode={showAccountCode}
              showOrganization={showOrganization}
              showCompanyHeader={showCompanyHeader}
              showCompanyFooter={showCompanyFooter}
              showReportingCategories={showReportingCategories}
              showDecimals={showDecimals}
              organizationName={organizationName}
            />
          </div>
        )}
        {!loading && !data && (
          <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>No data available. Select a company to view the balance sheet.</div>
        )}
      </div>
    </div>
  );
}
