"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "@voyzu/finance/types/modules/finance-companies";
import { Badge, Breadcrumbs, Button, ConfirmDialog, Input, SearchableSelect, TabGroup, Toast, ValidationAlert } from "@voyzu/ui-components";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
].map((label, index) => ({ value: String(index + 1), label }));
const INTERVALS = [
  { value: "1", label: "Monthly" },
  { value: "2", label: "Every two months" },
  { value: "3", label: "Quarterly" },
  { value: "6", label: "Half-yearly" },
  { value: "12", label: "Annually" },
];

export function FinanceCompanyDetail({ company }: { company: FinanceCompanyResponseDto }) {
  const router = useRouter();
  const [current, setCurrent] = useState(company);
  const [anchorMonth, setAnchorMonth] = useState(String(company.taxFilingAnchorMonth));
  const [interval, setInterval] = useState(String(company.taxFilingIntervalMonths));
  const [reportLine1, setReportLine1] = useState(company.reportLine1 ?? "");
  const [reportLine2, setReportLine2] = useState(company.reportLine2 ?? "");
  const [reportFooter, setReportFooter] = useState(company.reportFooter ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmDecouple, setConfirmDecouple] = useState(false);

  const request = async (url: string, init: RequestInit): Promise<FinanceCompanyResponseDto> => {
    const response = await fetch(url, init);
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(body?.message ?? "Unable to update financial entity");
    }
    return response.json() as Promise<FinanceCompanyResponseDto>;
  };

  const apply = (updated: FinanceCompanyResponseDto) => {
    setCurrent(updated);
    setAnchorMonth(String(updated.taxFilingAnchorMonth));
    setInterval(String(updated.taxFilingIntervalMonths));
    setReportLine1(updated.reportLine1 ?? "");
    setReportLine2(updated.reportLine2 ?? "");
    setReportFooter(updated.reportFooter ?? "");
  };

  const activate = async () => {
    setBusy(true);
    setError("");
    try {
      apply(await request(`/api/finance/companies/${encodeURIComponent(current.code)}/activate`, { method: "POST" }));
      setToast(`Created financial entity ${current.code}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create financial entity");
    } finally {
      setBusy(false);
    }
  };

  const save = async (useFinanceTemplateSettings = current.useFinanceTemplateSettings) => {
    setBusy(true);
    setError("");
    try {
      const payload: FinanceCompanyUpdateRequestDto = {
        taxFilingAnchorMonth: Number(anchorMonth),
        taxFilingIntervalMonths: Number(interval) as 1 | 2 | 3 | 6 | 12,
        useFinanceTemplateSettings,
        reportLine1: reportLine1 || undefined,
        reportLine2: reportLine2 || undefined,
        reportFooter: reportFooter || undefined,
      };
      apply(await request(`/api/finance/companies/${encodeURIComponent(current.code)}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      }));
      setToast(`Updated ${current.code}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update financial entity");
    } finally {
      setBusy(false);
    }
  };

  const readOnly = busy || current.status !== "ACTIVE" || !current.financeEnabled;
  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}><div className={detail.title}>
          <div className={detail.titleIcon}><span className="material-symbols-outlined">domain</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{current.name}</h1>
        </div></div>
        <div className={layout.slotActions}><div className={detail.headerActions}>
          <DetailBackButton fallbackHref="/finance/companies" />
          {!current.financeEnabled && <Button variant="primary" icon="check_circle" disabled={busy || current.status !== "ACTIVE"} onClick={() => void activate()}>Create Financial Entity</Button>}
        </div></div>
      </header>
      {error && <div className={layout.slotAlert}><ValidationAlert errors={[error]} visible onDismiss={() => setError("")} /></div>}
      <aside className={layout.statusSection}><div className={detail.card}><div className={detail.fieldGroup}>
        <span className={typography.fieldLabel}>Finance status</span>
        <Badge variant="soft" size="x-large" color={current.financeEnabled ? "success" : "neutral"}>{current.financeEnabled ? "ENABLED" : "NOT ENABLED"}</Badge>
      </div></div></aside>
      <main className={layout.mainSection}>
        <TabGroup defaultKey="details" tabs={[
          {
            key: "details", label: "Details", content: <>
              <section className={detail.card}>
                <div className={detail.cardHeader}><h2 className={`${typography.sectionHeading} ${detail.cardHeaderTitle}`}>Financial Entity Details</h2>
                  {current.financeEnabled && <div className={detail.cardHeaderActions}><Button variant="secondary" icon="save" disabled={readOnly} onClick={() => void save()}>Save</Button></div>}
                </div>
                <div className={detail.formGrid}>
                  <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Code</span><Input value={current.code} disabled /></label>
                  <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Name</span><Input value={current.name} disabled /></label>
                  <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Country</span><Input value={`${current.country?.name ?? current.countryCode} (${current.countryCode})`} disabled /></label>
                  <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Base Currency</span><Input value={`${current.baseCurrency?.name ?? current.baseCurrencyCode} (${current.baseCurrencyCode})`} disabled /></label>
                </div>
              </section>
              <section className={detail.card}><h2 className={typography.sectionHeading}>Tax Filing - Tax on Sales</h2><div className={detail.formGrid}>
                <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Anchor Month</span><SearchableSelect value={anchorMonth} onChange={setAnchorMonth} options={MONTHS} searchable={false} codeBadge={false} disabled={readOnly} /></label>
                <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Interval</span><SearchableSelect value={interval} onChange={setInterval} options={INTERVALS} searchable={false} codeBadge={false} disabled={readOnly} /></label>
              </div></section>
              <section className={detail.card}><h2 className={typography.sectionHeading}>Report Text</h2><div className={detail.formGrid}>
                <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Report Heading Line 1</span><Input maxLength={80} value={reportLine1} disabled={readOnly} onChange={(event) => setReportLine1(event.target.value)} /></label>
                <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Report Heading Line 2</span><Input maxLength={80} value={reportLine2} disabled={readOnly} onChange={(event) => setReportLine2(event.target.value)} /></label>
                <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Report Footer</span><Input maxLength={80} value={reportFooter} disabled={readOnly} onChange={(event) => setReportFooter(event.target.value)} /></label>
              </div></section>
            </>,
          },
          {
            key: "settings", label: "Settings", content: <section className={detail.card}>
              <h2 className={typography.sectionHeading}>Finance Admin standard settings</h2>
              {!current.financeEnabled ? <p>Create this financial entity before configuring its settings.</p>
                : current.useFinanceTemplateSettings ? <>
                  <p>This financial entity inherits the Finance Admin standard settings. It can be given its own copy, but cannot later be re-coupled.</p>
                  <div className={detail.cardActions}><Button variant="secondary-destructive" disabled={readOnly} onClick={() => setConfirmDecouple(true)}>Use entity-specific settings</Button></div>
                </> : <p>This financial entity uses its own financial settings.</p>}
            </section>,
          },
        ]} />
      </main>
      <ConfirmDialog isOpen={confirmDecouple} title="Use entity-specific settings" message="This one-way change gives the financial entity its own copy of the current Finance Admin settings. Future Finance Admin changes will not flow through." confirmLabel="Proceed" confirmVariant="danger" onClose={() => setConfirmDecouple(false)} onConfirm={() => { setConfirmDecouple(false); void save(false); }} />
      <Toast isVisible={Boolean(toast)} onClose={() => setToast("")} message={toast} />
    </div>
  );
}
