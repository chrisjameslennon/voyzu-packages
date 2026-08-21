"use client";

import { CompanyAuditPanel as AuditPanel } from "@voyzu/core/common/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import type { DrCr } from "@voyzu/core/types/modules/core";
import type { JournalLineResponseDto, JournalResponseDto, JournalStatus } from "@voyzu/core/types/modules/journals";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CompanyPageTitleBadges, detailLinkWithBackContext, getDrCrColor, getStatusSemanticColor, type DetailBackSource } from "@voyzu/core/common/client";
import { Badge, Breadcrumbs, Button, DropdownMenu, Input, type DropdownMenuItem } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./journals.module.css";

interface JournalCompany {
  id: number;
  code: string;
  name: string;
}

interface JournalDetailProps {
  code: string;
  company: JournalCompany | null;
  journal: JournalResponseDto | null;
  from?: DetailBackSource;
  fromCode?: string;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

function formatAmount(value: number | null | undefined) {
  if (value == null) return "-";
  return value.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatusBadge({
  status,
  reversedByJournalId,
  reversalOfJournalId,
}: {
  status: JournalStatus;
  reversedByJournalId?: number | null;
  reversalOfJournalId?: number | null;
}) {
  return (
    <span className={localStyles.inlineGroup}>
      <Badge variant="soft" size="x-large" color={getStatusSemanticColor(status)}>{status}</Badge>
      {reversalOfJournalId != null && <Badge variant="soft" size="small" color="info">REVERSAL</Badge>}
      {reversedByJournalId != null && <Badge variant="soft" size="small" color="warning">REVERSED</Badge>}
    </span>
  );
}

function DrCrBadge({ value }: { value: DrCr }) {
  return <Badge variant="soft" size="small" color={getDrCrColor(value)}>{value}</Badge>;
}

function lineDescription(line: JournalLineResponseDto) {
  const text = [line.description, line.memo].filter(Boolean).join(" | ");
  const dimensions = line.dimensions?.map((dimension) => `${dimension.dimensionCode}=${dimension.dimensionValueName}`).join(", ");
  return (
    <>
      <div className={localStyles.inlineGroup}>
        <strong>{line.glAccountName}</strong>
        <Badge variant="soft" size="small" color="neutral">{line.glAccountCode}</Badge>
      </div>
      {text && <div className={localStyles.mutedText}>{text}</div>}
      {dimensions && <div className={localStyles.mobileMeta}>{dimensions}</div>}
    </>
  );
}

export function JournalDetail({ code, company, journal, from = "journals", fromCode }: JournalDetailProps) {
  const router = useRouter();
  const [documentVisible, setDocumentVisible] = useState(false);
  const [calculationsVisible, setCalculationsVisible] = useState(false);
  const [bankCashVisible, setBankCashVisible] = useState(false);
  if (!journal) {
    return (
      <div className={layoutStyles.detailView}>
        <header className={layoutStyles.detailHeader}>
          <div className={layoutStyles.slotBreadcrumb}>
            <Breadcrumbs />
          </div>
          <div className={layoutStyles.slotTitle}>
            <div className={detailStyles.title}>
              <div className={detailStyles.titleIcon}>
                <span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>account_balance</span>
              </div>
              <h1 className={typography.pageTitle}>{code}</h1>
            </div>
            <div className={layoutStyles.slotTitleMeta}><CompanyPageTitleBadges /></div>
          </div>
        </header>
        <main className={layoutStyles.mainSection}>
          <section className={detailStyles.card}>
            <h2 className={typography.sectionHeading}>Journal not found</h2>
            <p className={typography.bodyText}>
              {company ? `No journal ${code} was found for ${company.name}.` : "Select a company to view this journal."}
            </p>
            <DetailBackButton fallbackHref={"/finance/journals"} from={from} fromCode={fromCode} />
          </section>
        </main>
      </div>
    );
  }

  const lines = journal.lines ?? [];
  const drTotal = lines.filter((line) => line.drCr === "DR").reduce((sum, line) => sum + line.baseCurrencyAmount, 0);
  const crTotal = lines.filter((line) => line.drCr === "CR").reduce((sum, line) => sum + line.baseCurrencyAmount, 0);
  const viewItems: DropdownMenuItem[] = [
    {
      value: "ar-subledger",
      label: "View AR Subledger",
      icon: "receipt_long",
      disabled: !journal.arSubledgerEntryCode,
      onSelect: () => {
        if (!journal.arSubledgerEntryCode) return;
        router.push(
          detailLinkWithBackContext(
            `/finance/subledgers/ar/ledger-entries/${encodeURIComponent(journal.arSubledgerEntryCode)}`,
            "journal",
            journal.code,
          ),
        );
      },
    },
    {
      value: "ap-subledger",
      label: "View AP Subledger",
      icon: "receipt_long",
      disabled: !journal.apSubledgerEntryCode,
      onSelect: () => {
        if (!journal.apSubledgerEntryCode) return;
        router.push(
          detailLinkWithBackContext(
            `/finance/subledgers/ap/ledger-entries/${encodeURIComponent(journal.apSubledgerEntryCode)}`,
            "journal",
            journal.code,
          ),
        );
      },
    },
    {
      value: "tax",
      label: "View Tax",
      icon: "receipt_long",
      disabled: !journal.taxLedgerEntryCode,
      onSelect: () => {
        if (!journal.taxLedgerEntryCode) return;
        router.push(
          detailLinkWithBackContext(
            `/finance/subledgers/tax/ledger-entries/${encodeURIComponent(journal.taxLedgerEntryCode)}`,
            "journal",
            journal.code,
          ),
        );
      },
    },
    {
      value: "bank-cash",
      label: "View Bank / Cash Details",
      icon: "account_balance",
      disabled: !journal.bankCashDetails,
      onSelect: () => setBankCashVisible(true),
    },
    {
      value: "original-document",
      label: "View Original Document Supplied",
      icon: "description",
      disabled: !journal.documentSnapshot,
      onSelect: () => setDocumentVisible(true),
    },
    {
      value: "calculations",
      label: "View Calculations",
      icon: "functions",
      disabled: !journal.detailedDocumentSnapshot,
      onSelect: () => setCalculationsVisible(true),
    },
  ];

  return (
    <div className={`${layoutStyles.detailView} ${layoutStyles.detailViewWithStatusRail}`}>
      <header className={layoutStyles.detailHeader}>
        <div className={layoutStyles.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layoutStyles.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}>
              <span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>account_balance</span>
            </div>
            <h1 className={typography.pageTitle}>{journal.code}</h1>
          </div>
          <div className={layoutStyles.slotTitleMeta}><CompanyPageTitleBadges /></div>
        </div>
        <div className={layoutStyles.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={"/finance/journals"} from={from} fromCode={fromCode} />
          </div>
        </div>
      </header>

      <aside className={`${layoutStyles.statusSection} ${localStyles.statusRail}`}>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Status</label>
            <StatusBadge status={journal.status} reversedByJournalId={journal.reversedByJournalId} reversalOfJournalId={journal.reversalOfJournalId} />
          </div>
        </div>

        <div className={detailStyles.systemCard}>
          <h3 className={detailStyles.systemTitle}>Totals</h3>
          <div className={detailStyles.summaryBody}>
            <div className={detailStyles.summaryRow}>
              <span className={detailStyles.summaryLabel}>Total DR</span>
              <strong className={detailStyles.summaryValue}>{formatAmount(drTotal)}</strong>
            </div>
            <div className={detailStyles.summaryRow}>
              <span className={detailStyles.summaryLabel}>Total CR</span>
              <strong className={detailStyles.summaryValue}>{formatAmount(crTotal)}</strong>
            </div>
            <div className={`${detailStyles.summaryRow} ${detailStyles.summaryTotal}`}>
              <span className={detailStyles.summaryLabel}>Balance</span>
              <strong className={detailStyles.summaryValue}>{formatAmount(drTotal - crTotal)}</strong>
            </div>
          </div>
        </div>

        <div className={detailStyles.systemCard}>
          <DropdownMenu
            trigger={
              <Button variant="secondary" icon="visibility" className={detailStyles.fullWidthAction} textAlign="center">
                View
              </Button>
            }
            items={viewItems}
            caret
            alignment="left"
            width={300}
          />
        </div>

        <AuditPanel
          id={journal.id}
          creationDate={journal.audit.created.date}
          updatedDate={journal.audit.updated.date}
          creationActorType={journal.audit.created.actorType}
          creationUser={journal.audit.created.user}
          updatedActorType={journal.audit.updated.actorType}
          updatedUser={journal.audit.updated.user}
          auditHref={`/settings/audit?entityType=journal_header&entityId=${journal.id}`}
          mutationId={journal.audit.updated.mutationId ?? journal.audit.created.mutationId}
        />
      </aside>

      <main className={layoutStyles.mainSection}>
        <section className={detailStyles.card}>
          <h2 className={typography.sectionHeading}>Posting Details</h2>
          <div className={detailStyles.formGrid}>
            <div className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Journal Number</span>
              <Input value={journal.code} disabled />
            </div>
            <div className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Posting Date</span>
              <Input value={formatDate(journal.postingDate)} disabled />
            </div>
            <div className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Document</span>
              <Input value={journal.documentTypeLabel || journal.documentTypeCode} disabled />
            </div>
            <div className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Document ID</span>
              <Input value={journal.documentId || "-"} disabled />
            </div>
            <div className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Memo</span>
              <Input value={journal.memo || "-"} disabled />
            </div>
            <div className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Description</span>
              <Input value={journal.description} disabled />
            </div>
          </div>
          <div className={localStyles.periodStrip}>
            <span className={localStyles.periodLabel}>Period</span>
            <span className={localStyles.periodItem}><span className={localStyles.mutedText}>Fiscal Year</span><strong>{journal.financialYearCode}</strong></span>
            <span className={localStyles.periodItem}><span className={localStyles.mutedText}>Period</span><strong>{journal.financialPeriodCode}</strong></span>
          </div>
        </section>

        <section className={detailStyles.card}>
          <div className={detailStyles.cardHeader}>
            <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Journal Lines</h2>
          </div>
          <div className={localStyles.linesTableWrap}>
            <table className={localStyles.linesTable}>
              <thead>
                <tr>
                  <th><span className={typography.fieldLabel}>#</span></th>
                  <th><span className={typography.fieldLabel}>Source</span></th>
                  <th><span className={typography.fieldLabel}>GL Account</span></th>
                  <th><span className={typography.fieldLabel}>DR/CR</span></th>
                  <th><span className={typography.fieldLabel}>Amount</span></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id}>
                    <td>{line.lineNumber}</td>
                    <td>{line.sourceControlAccount ?? "-"}</td>
                    <td>{lineDescription(line)}</td>
                    <td><DrCrBadge value={line.drCr} /></td>
                    <td className={localStyles.amountCell}>{formatAmount(line.baseCurrencyAmount)}</td>
                  </tr>
                ))}
                {lines.length === 0 && (
                  <tr>
                    <td colSpan={5}>No lines</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {documentVisible && (
        <JsonModal
          title={`Document - ${journal.documentId || journal.code}`}
          value={journal.documentSnapshot}
          onClose={() => setDocumentVisible(false)}
        />
      )}
      {calculationsVisible && (
        <JsonModal
          title={`Calculations - ${journal.documentId || journal.code}`}
          value={journal.detailedDocumentSnapshot}
          onClose={() => setCalculationsVisible(false)}
        />
      )}
      {bankCashVisible && (
        <JsonModal
          title={`Bank / Cash Details - ${journal.code}`}
          value={journal.bankCashDetails ?? {}}
          onClose={() => setBankCashVisible(false)}
        />
      )}
    </div>
  );
}

function JsonModal({
  title,
  value,
  onClose,
}: {
  title: string;
  value: Record<string, unknown> | undefined | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(value ?? {}, null, 2);

  const copy = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={localStyles.modalOverlay} onClick={onClose}>
      <div className={localStyles.modal} onClick={(event) => event.stopPropagation()}>
        <header className={localStyles.modalHeader}>
          <strong>{title}</strong>
          <div className={localStyles.modalActions}>
            <Button variant="secondary" icon={copied ? "check" : "content_copy"} onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="plain" icon="close" title="Close" onClick={onClose} />
          </div>
        </header>
        <pre className={localStyles.modalCode}>{text}</pre>
      </div>
    </div>
  );
}

