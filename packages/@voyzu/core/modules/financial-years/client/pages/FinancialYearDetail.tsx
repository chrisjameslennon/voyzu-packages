"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/core/company-audit/client";
import { Close, Delete, Open, Reopen, type FinancialYearOperationState } from "../../domain/operation-policy";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CompanyPageTitleBadges, financeApiUrl, getHasPostingsColor, getStatusSemanticColor, StandardSettingsReadOnlyAlert } from "@voyzu/core/common/client";
import type { FinancialPeriodResponseDto } from "@voyzu/core/types/modules/financial-periods";
import type { FinancialYearResponseDto } from "@voyzu/core/types/modules/financial-years";
import { Badge, Breadcrumbs, Button, Checkbox, ConfirmDialog, Input, ValidationAlert } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const SIMPLE_LIFECYCLE_BLOCKERS = new Set([
  "FINANCIAL_YEAR_CANNOT_BE_OPENED_FROM_STATUS",
  "FINANCIAL_YEAR_CANNOT_BE_REOPENED_FROM_STATUS",
  "FINANCIAL_YEAR_CANNOT_BE_CLOSED_FROM_STATUS",
]);

function complexBlockerMessage(blockers: readonly { code: string; message: string }[]) {
  return blockers.find((blocker) => !SIMPLE_LIFECYCLE_BLOCKERS.has(blocker.code))?.message;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

export function FinancialYearDetail({
  year,
  financialYears,
  periods,
  readOnly = false,
}: {
  year: FinancialYearResponseDto;
  financialYears: FinancialYearResponseDto[];
  periods: FinancialPeriodResponseDto[];
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [currentYear, setCurrentYear] = useState(year);
  const [yearRows, setYearRows] = useState(financialYears);
  const [periodRows, setPeriodRows] = useState(periods);
  const [selectedPeriodIds, setSelectedPeriodIds] = useState<Set<number>>(new Set());
  const [periodActionBusy, setPeriodActionBusy] = useState(false);
  const [yearActionBusy, setYearActionBusy] = useState(false);
  const [yearConfirmation, setYearConfirmation] = useState<"open" | "close" | "delete" | null>(null);
  const [yearActionError, setYearActionError] = useState("");

  useEffect(() => {
    setCurrentYear(year);
    setYearRows(financialYears);
    setPeriodRows(periods);
  }, [financialYears, periods, year]);

  const selectedPeriods = useMemo(
    () => periodRows.filter((period) => selectedPeriodIds.has(period.id)),
    [periodRows, selectedPeriodIds],
  );
  const operationYears = useMemo<FinancialYearOperationState[]>(() => yearRows.map((candidate) => ({
    id: candidate.id,
    code: candidate.code,
    startDate: candidate.startDate,
    status: candidate.status,
    hasPostings: candidate.hasPostings,
  })), [yearRows]);
  const operationYear = operationYears.find((candidate) => candidate.id === currentYear.id);
  const openBlockers = operationYear
    ? (currentYear.status === "CLOSED"
      ? Reopen(operationYear, operationYears)
      : Open(operationYear, operationYears))
    : [];
  const closeBlockers = operationYear
    ? Close(operationYear, operationYears, periodRows.filter((period) => period.status === "OPEN").length)
    : [];
  const deleteBlockers = operationYear ? Delete(operationYear, operationYears) : [];
  const canOpenYear = !readOnly && openBlockers.length === 0 && !yearActionBusy;
  const canCloseYear = !readOnly && closeBlockers.length === 0 && !yearActionBusy;
  const canDeleteYear = !readOnly && deleteBlockers.length === 0 && !yearActionBusy;

  const canOpenPeriods = !readOnly
    && currentYear.status === "OPEN"
    && selectedPeriods.length > 0
    && selectedPeriods.every((period) => period.status === "CLOSED")
    && !periodActionBusy;
  const canClosePeriods = !readOnly
    && currentYear.status === "OPEN"
    && selectedPeriods.length > 0
    && selectedPeriods.every((period) => period.status === "OPEN")
    && !periodActionBusy;

  const togglePeriod = (periodId: number) => {
    if (readOnly) return;
    setSelectedPeriodIds((current) => {
      const next = new Set(current);
      if (next.has(periodId)) {
        next.delete(periodId);
      } else {
        next.add(periodId);
      }
      return next;
    });
  };

  const toggleAllPeriods = () => {
    if (readOnly) return;
    setSelectedPeriodIds((current) => {
      if (current.size === periodRows.length) return new Set();
      return new Set(periodRows.map((period) => period.id));
    });
  };

  const runPeriodAction = async (action: "close" | "reopen") => {
    if (readOnly) return;
    const targets = selectedPeriods;
    if (targets.length === 0) return;

    setPeriodActionBusy(true);
    try {
      const updatedPeriods: FinancialPeriodResponseDto[] = [];
      for (const period of targets) {
        const response = await fetch(
          await financeApiUrl(`/financial-years/${encodeURIComponent(currentYear.code)}/periods/${encodeURIComponent(period.code)}/${action}`),
          { method: "POST" },
        );
        if (!response.ok) throw new Error(`Unable to ${action} period ${period.code}`);
        updatedPeriods.push(await response.json() as FinancialPeriodResponseDto);
      }

      setPeriodRows((current) => current.map((period) => {
        const updatedPeriod = updatedPeriods.find((updated) => updated.id === period.id);
        return updatedPeriod ?? period;
      }));
      setSelectedPeriodIds(new Set());
    } catch (error) {
      console.error(error);
    } finally {
      setPeriodActionBusy(false);
    }
  };

  const parseError = async (response: Response) => {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    return body?.message ?? "An unexpected error occurred";
  };

  const runYearAction = async (action: "open" | "close") => {
    setYearConfirmation(null);
    if (yearActionBusy || readOnly) return;
    setYearActionError("");
    setYearActionBusy(true);
    try {
      const effectiveAction = action === "open" && currentYear.status === "CLOSED" ? "reopen" : action;
      const response = await fetch(
        await financeApiUrl(`/financial-years/${encodeURIComponent(currentYear.code)}/${effectiveAction}`),
        { method: "POST" },
      );
      if (!response.ok) {
        setYearActionError(await parseError(response));
        return;
      }
      const updated = await response.json() as FinancialYearResponseDto;
      setCurrentYear(updated);
      setYearRows((current) => current.map((candidate) => candidate.id === updated.id ? updated : candidate));

      if (action === "open" && periodRows.length === 0) {
        const periodsResponse = await fetch(
          await financeApiUrl(`/financial-years/${encodeURIComponent(updated.code)}/periods`),
        );
        if (periodsResponse.ok) setPeriodRows(await periodsResponse.json() as FinancialPeriodResponseDto[]);
      }
    } finally {
      setYearActionBusy(false);
    }
  };

  const deleteYear = async () => {
    setYearConfirmation(null);
    if (!canDeleteYear) return;
    setYearActionError("");
    setYearActionBusy(true);
    try {
      const response = await fetch(
        await financeApiUrl(`/financial-years/${encodeURIComponent(currentYear.code)}`),
        { method: "DELETE" },
      );
      if (!response.ok) {
        setYearActionError(await parseError(response));
        return;
      }
      router.push("/finance/financial-periods");
      router.refresh();
    } finally {
      setYearActionBusy(false);
    }
  };

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>calendar_month</span></div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{currentYear.code}</h1>
          </div>
          <div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={"/finance/financial-periods"} />
            <Button variant="secondary" icon="lock_open" disabled={!canOpenYear} title={complexBlockerMessage(openBlockers)} onClick={() => setYearConfirmation("open")}>Open</Button>
            <Button variant="secondary" icon="lock" disabled={!canCloseYear} title={complexBlockerMessage(closeBlockers)} onClick={() => setYearConfirmation("close")}>Close</Button>
            <Button variant="secondary-destructive" icon="delete" disabled={!canDeleteYear} title={deleteBlockers[0]?.message} onClick={() => setYearConfirmation("delete")} />
          </div>
        </div>
        <div className={layout.slotAlert}>
          {readOnly ? <StandardSettingsReadOnlyAlert /> : null}
          <ValidationAlert errors={yearActionError ? [yearActionError] : []} visible={!!yearActionError} onDismiss={() => setYearActionError("")} />
        </div>
      </header>

      <aside className={layout.statusSection} style={{ display: "flex", flexDirection: "column", gap: "var(--vz-grid-gap)" }}>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Status</label>
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(currentYear.status)}>{currentYear.status}</Badge>
          </div>
          {currentYear.hasPostings ? (
            <div className={detailStyles.fieldGroup}>
              <Badge variant="soft" size="medium" customColors={getHasPostingsColor(currentYear.hasPostings)}>
                HAS POSTINGS
              </Badge>
            </div>
          ) : null}
        </div>
        <AuditPanel
          id={currentYear.id}
          creationDate={currentYear.audit.created.date}
          updatedDate={currentYear.audit.updated.date}
          creationActorType={currentYear.audit.created.actorType}
          creationUser={currentYear.audit.created.user}
          updatedActorType={currentYear.audit.updated.actorType}
          updatedUser={currentYear.audit.updated.user}
          auditHref={`/organization/audit?entityType=fiscal_year&entityId=${currentYear.id}`}
          mutationId={currentYear.audit.updated.mutationId ?? currentYear.audit.created.mutationId}
        />
      </aside>

      <main className={layout.mainSection}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Financial Year Details</h2>
          <div className={detailStyles.formGrid}>
            <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Code</span><Input value={currentYear.code} disabled /></label>
            <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Name</span><Input value={currentYear.name} disabled /></label>
            <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Start Date</span><Input value={formatDate(currentYear.startDate)} disabled /></label>
            <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>End Date</span><Input value={formatDate(currentYear.endDate)} disabled /></label>
          </div>
        </section>

        <section className={detailStyles.card}>
          <div className={detailStyles.cardHeader}>
            <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Financial Periods</h2>
            {periodRows.length > 0 && (
              <div className={detailStyles.cardHeaderActions}>
                <Button variant="secondary" icon="lock_open" disabled={!canOpenPeriods} onClick={() => { void runPeriodAction("reopen"); }}>Open</Button>
                <Button variant="secondary" icon="lock" disabled={!canClosePeriods} onClick={() => { void runPeriodAction("close"); }}>Close</Button>
              </div>
            )}
          </div>

          {periodRows.length === 0 ? (
            <div className={detailStyles.summaryRow}>
              <span className="material-symbols-outlined" style={{ color: "var(--voyzu-color-primary-base)", fontSize: "1.25rem" }}>info</span>
              <span className={detailStyles.summaryLabel}>Financial periods will be created automatically when this financial year is opened.</span>
            </div>
          ) : (
            <div className={detailStyles.tableWrap}>
              <table className={detailStyles.table}>
                <thead>
                  <tr>
                    <th style={{ width: "2.5rem" }}>
                      <Checkbox
                        checked={periodRows.length > 0 && selectedPeriodIds.size === periodRows.length}
                        disabled={readOnly}
                        onChange={toggleAllPeriods}
                        aria-label="Select all financial periods"
                      />
                    </th>
                    <th style={{ width: "7rem" }}>Period</th>
                    <th>Name</th>
                    <th style={{ width: "11rem" }}>Start Date</th>
                    <th style={{ width: "11rem" }}>End Date</th>
                    <th style={{ width: "9rem", textAlign: "center" }}>Has Postings</th>
                    <th style={{ width: "8rem", textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {periodRows.map((period) => {
                    const isSelected = selectedPeriodIds.has(period.id);
                    return (
                      <tr
                        key={period.id}
                        onClick={() => togglePeriod(period.id)}
                        style={{ cursor: readOnly ? "default" : "pointer", background: isSelected ? "var(--voyzu-color-primary-surface)" : undefined }}
                      >
                        <td onClick={(event) => event.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            disabled={readOnly}
                            onChange={() => togglePeriod(period.id)}
                            aria-label={`Select period ${period.code}`}
                          />
                        </td>
                        <td style={{ fontWeight: 700 }}>{period.code}</td>
                        <td>{period.name}</td>
                        <td>{formatDate(period.startDate)}</td>
                        <td>{formatDate(period.endDate)}</td>
                        <td style={{ textAlign: "center" }}>
                          {period.hasPostings ? <span className={`material-symbols-outlined ${listStyles.successIcon}`} aria-label="Has postings">check</span> : "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Badge variant="soft" size="small" color={getStatusSemanticColor(period.status)}>
                            {period.status === "CLOSED" && <span className="material-symbols-outlined" style={{ fontSize: "0.75rem" }}>lock</span>}
                            {period.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <ConfirmDialog
        isOpen={yearConfirmation === "open" || yearConfirmation === "close"}
        title={`${yearConfirmation === "close" ? "Close" : "Open"} Financial Year`}
        icon="warning"
        message={`Are you sure you want to ${yearConfirmation ?? "update"} ${currentYear.name}?`}
        confirmLabel={yearConfirmation === "close" ? "Close" : "Open"}
        confirmVariant="primary"
        onClose={() => setYearConfirmation(null)}
        onConfirm={() => {
          if (yearConfirmation === "open" || yearConfirmation === "close") void runYearAction(yearConfirmation);
        }}
      />
      <ConfirmDialog
        isOpen={yearConfirmation === "delete"}
        title="Delete Financial Year"
        icon="warning"
        message={(
          <>
            <p>Are you sure you want to permanently delete {currentYear.name}?</p>
            <p><strong>This action cannot be undone.</strong></p>
          </>
        )}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setYearConfirmation(null)}
        onConfirm={() => { void deleteYear(); }}
      />
    </div>
  );
}

