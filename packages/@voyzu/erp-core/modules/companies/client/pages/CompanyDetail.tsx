"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { OrganizationAuditPanel as AuditPanel, getStatusSemanticColor } from "@voyzu/erp-core/common/client";
import type { CompanyResponseDto, CompanyUpdateRequestDto } from "@voyzu/erp-core/types/modules/companies";
import { Badge, Breadcrumbs, Button, Input, SearchableSelect } from "@voyzu/ui-components";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

type SelectOption = { value: string; label: string; code?: string };

interface CompanyDetailProps {
  company: CompanyResponseDto;
  activeCountries: SelectOption[];
  activeCurrencies: SelectOption[];
  organizationCompaniesHelpUrl?: string;
}

export function CompanyDetail({ company, activeCountries, activeCurrencies }: CompanyDetailProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(company);
  const [code, setCode] = useState(company.code);
  const [name, setName] = useState(company.name);
  const [countryCode, setCountryCode] = useState(company.countryCode);
  const [baseCurrencyCode, setBaseCurrencyCode] = useState(company.baseCurrencyCode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const payload: CompanyUpdateRequestDto = { code, name, countryCode, baseCurrencyCode };
      const response = await fetch(`/api/organization/companies/${encodeURIComponent(current.code)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        setError(body?.message ?? "Unable to update company");
        return;
      }
      const updated = await response.json() as CompanyResponseDto;
      setCurrent(updated);
      if (updated.code !== current.code) router.replace(`/organization/companies/${encodeURIComponent(updated.code)}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async () => {
    setBusy(true);
    setError("");
    try {
      const operation = current.status === "ACTIVE" ? "deactivate" : "activate";
      const response = await fetch(`/api/organization/companies/${encodeURIComponent(current.code)}/${operation}`, { method: "POST" });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        setError(body?.message ?? "Unable to change company status");
        return;
      }
      setCurrent(await response.json() as CompanyResponseDto);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`${layoutStyles.detailView} ${layoutStyles.detailViewWithStatusRail}`}>
      <header className={layoutStyles.detailHeader}>
        <div className={layoutStyles.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layoutStyles.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className="material-symbols-outlined">domain</span></div>
            <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>{current.name}</h1>
          </div>
        </div>
        <div className={layoutStyles.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref="/organization/companies" />
            <Button onClick={() => void changeStatus()} disabled={busy} variant="secondary">
              {current.status === "ACTIVE" ? "Archive" : "Restore"}
            </Button>
          </div>
        </div>
      </header>

      <aside className={layoutStyles.statusSection}>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <span className={typography.fieldLabel}>Status</span>
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(current.status)}>{current.status}</Badge>
          </div>
        </div>
        <AuditPanel
          id={current.id}
          creationDate={current.audit.created.date}
          updatedDate={current.audit.updated.date}
          creationActorType={current.audit.created.actorType}
          creationUser={current.audit.created.user}
          updatedActorType={current.audit.updated.actorType}
          updatedUser={current.audit.updated.user}
          auditHref={`/settings/audit?entityType=company&entityCode=${encodeURIComponent(current.code)}`}
          mutationId={current.audit.updated.mutationId ?? current.audit.created.mutationId}
        />
      </aside>

      <main className={layoutStyles.mainSection}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Company Details</h2>
          {error ? <p>{error}</p> : null}
          <div className={detailStyles.formGrid}>
            <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Code</span><Input value={code} maxLength={14} onChange={(event) => setCode(event.target.value.toUpperCase())} /></label>
            <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Name</span><Input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Country</span><SearchableSelect value={countryCode} onChange={setCountryCode} options={activeCountries} /></label>
            <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Base Currency</span><SearchableSelect value={baseCurrencyCode} onChange={setBaseCurrencyCode} options={activeCurrencies} /></label>
          </div>
          <div className={detailStyles.cardActions}><Button variant="primary" onClick={() => void save()} disabled={busy || !code || !name || !countryCode || !baseCurrencyCode}>Save</Button></div>
        </section>
      </main>
    </div>
  );
}
