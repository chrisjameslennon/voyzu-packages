"use client";

import { financeApiUrl } from "@voyzu/core/common/client";
import { useCallback, useEffect, useRef, useState } from "react";

import type { TrialBalanceResponseDto } from "@voyzu/core/types/modules/company-reports";
import { Breadcrumbs, Button, Checkbox, DatePicker, DropdownMenu, type DropdownMenuItem } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import styles from "@voyzu/ui-style/css-modules/list.module.css";
import localStyles from "./trial-balance-report.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { TrialBalanceReportTemplate } from "../templates/TrialBalanceReportTemplate";

function titleToFileSlug(title: string): string {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "report";
}

interface TrialBalanceReportProps {
  pageTitle: string;
  initialData: TrialBalanceResponseDto | null;
  initialAsAtDate: string;
  selectedCompanyId: number | null;
}

export function TrialBalanceReport({
  pageTitle,
  initialData,
  initialAsAtDate,
  selectedCompanyId,
}: TrialBalanceReportProps) {
  const [data, setData] = useState<TrialBalanceResponseDto | null>(initialData);
  const [asAtDate, setAsAtDate] = useState(initialAsAtDate);
  const [loading, setLoading] = useState(false);
  const [showAccountCode, setShowAccountCode] = useState(false);
  const isFirstRender = useRef(true);

  const fetchData = useCallback(async (companyId: number, date: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ companyId: String(companyId) });
      if (date) params.set("asAtDate", date);
      const res = await fetch(await financeApiUrl(`/reports/trial-balance?${params.toString()}`));
      if (!res.ok) return;
      setData((await res.json()) as TrialBalanceResponseDto);
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
  }, [asAtDate, fetchData, selectedCompanyId]);

  const generatedAt = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const refreshReport = () => {
    if (!selectedCompanyId) return;
    void fetchData(selectedCompanyId, asAtDate);
  };

  const printableBase = "/finance/reports/trial-balance/printable";
  const urlParams = new URLSearchParams();
  if (selectedCompanyId) urlParams.set("companyId", String(selectedCompanyId));
  if (asAtDate) urlParams.set("asAtDate", asAtDate);
  urlParams.set("showAccountCode", String(showAccountCode));
  const printablePath = `${printableBase}?${urlParams.toString()}`;
  const pdfParams = new URLSearchParams({
    orientation: "portrait",
    path: printableBase,
    filename: titleToFileSlug(pageTitle),
  });
  urlParams.forEach((value, key) => pdfParams.set(key, value));
  const pdfViewPath = `/api/capability/pdf-view?${pdfParams.toString()}`;
  const pdfPath = `/api/capability/pdf?${pdfParams.toString()}`;
  const optionItems: DropdownMenuItem[] = [
    {
      value: "show-account-code",
      label: (
        <span className={localStyles.checkboxOption}>
          <Checkbox checked={showAccountCode} onChange={() => undefined} tabIndex={-1} />
          <span>Show account code</span>
        </span>
      ),
      onSelect: () => setShowAccountCode((checked) => !checked),
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
            <span className={`material-symbols-outlined ${styles.titleIconSymbol}`}>rule</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{pageTitle}</h1>
        </div>
        <div className={layout.slotToolbarLeft}>
          <div style={{ width: "200px" }}>
            <DatePicker value={asAtDate} onChange={(date) => date && setAsAtDate(date)} clearable={false} />
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
          <Button variant="secondary" icon="sync" title="Refresh" disabled={loading || !selectedCompanyId} onClick={refreshReport} />
          <Button variant="secondary" icon="open_in_new" title="Printable Page" disabled={loading || !selectedCompanyId} onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")} />
          <Button variant="secondary" icon="picture_as_pdf" title="View PDF" disabled={loading || !selectedCompanyId} onClick={() => window.open(pdfViewPath, "_blank", "noopener,noreferrer")} />
          <Button variant="secondary" icon="download" title="Download PDF" disabled={loading || !selectedCompanyId} onClick={() => window.open(pdfPath)} />
        </div>
      </header>
      <div className={layout.slotDocument}>
        {loading && <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>Loading...</div>}
        {!loading && data && (
          <div className={layout.document} style={{ maxWidth: "210mm" }}>
            <TrialBalanceReportTemplate data={data} generatedAt={generatedAt} showAccountCode={showAccountCode} />
          </div>
        )}
        {!loading && !data && (
          <div style={{ padding: "2rem", color: "var(--voyzu-color-text-muted)" }}>No data available. Select a company to view the trial balance.</div>
        )}
      </div>
    </div>
  );
}
