"use client";

import { financeApiUrl } from "@voyzu/modules/common/client";
import { useCallback, useEffect, useRef, useState } from "react";

import type { BankCashMovementResponseDto } from "@voyzu/types/modules/company-reports";
import { Breadcrumbs, Button, DatePicker } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import styles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { BankCashMovementReportTemplate } from "../templates/BankCashMovementReportTemplate";

const A4_LANDSCAPE_WIDTH_MM = 297;

interface BankCashMovementReportProps {
  pageTitle: string;
  initialData: BankCashMovementResponseDto | null;
  initialFromDate: string;
  initialToDate: string;
  selectedCompanyId: number | null;
}

export function BankCashMovementReport({ pageTitle, initialData, initialFromDate, initialToDate, selectedCompanyId }: BankCashMovementReportProps) {
  const [data, setData] = useState<BankCashMovementResponseDto | null>(initialData);
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  const fetchData = useCallback(async (companyId: number, from: string, to: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ companyId: String(companyId), fromDate: from, toDate: to });
      const res = await fetch(await financeApiUrl(`/reports/bank-cash-movement?${params.toString()}`));
      if (!res.ok) return;
      setData((await res.json()) as BankCashMovementResponseDto);
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
  }, [fetchData, fromDate, selectedCompanyId, toDate]);

  const generatedAt = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const refreshReport = () => {
    if (!selectedCompanyId) return;
    void fetchData(selectedCompanyId, fromDate, toDate);
  };

  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={styles.titleIcon}><span className={`material-symbols-outlined ${styles.titleIconSymbol}`}>trending_up</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{pageTitle}</h1>
        </div>
        <div className={layout.slotToolbarLeft}>
          <div style={{ width: "200px" }}><DatePicker value={fromDate} onChange={(date) => date && setFromDate(date)} clearable={false} /></div>
          <div style={{ width: "200px" }}><DatePicker value={toDate} onChange={(date) => date && setToDate(date)} clearable={false} /></div>
        </div>
        <div className={layout.slotToolbarRight}>
          <Button variant="secondary" icon="sync" title="Refresh" disabled={loading || !selectedCompanyId} onClick={refreshReport} />
        </div>
      </header>
      <div className={layout.slotDocument}>
        {loading && <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>Loading...</div>}
        {!loading && data && <div className={layout.document} style={{ maxWidth: `${A4_LANDSCAPE_WIDTH_MM}mm` }}><BankCashMovementReportTemplate data={data} generatedAt={generatedAt} /></div>}
        {!loading && !data && <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>No data available. Select a company to view bank / cash movement.</div>}
      </div>
    </div>
  );
}
