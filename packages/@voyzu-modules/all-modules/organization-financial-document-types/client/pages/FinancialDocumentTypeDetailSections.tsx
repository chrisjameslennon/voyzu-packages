"use client";

import type { ReactNode } from "react";

import { getDrCrColor } from "@voyzu-modules/all-modules/common/client";
import { detailLinkWithBackContext } from "@voyzu-modules/all-modules/common/client";
import { ledgerName } from "@voyzu-modules/all-modules/common/client";
import type {
  FinancialDocumentTypePostingTemplateDto,
  FinancialDocumentTypeResponseDto,
} from "@voyzu-modules/types/modules/financial-document-types";
import {
  Badge,
  Input,
  type BadgeCustomColors,
} from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./FinancialDocumentTypeDetail.module.css";

interface FinancialDocumentTypePostingModelProps {
  postingTemplate: FinancialDocumentTypePostingTemplateDto | null;
  processorCode: string;
  supportsItems: boolean;
  routePrefix?: string;
}

const subledgerColors: Record<string, BadgeCustomColors> = {
  GENERAL: {
    fg: "var(--voyzu-color-info-text)",
    bg: "var(--voyzu-color-info-bg)",
    border: "var(--voyzu-color-info-border)",
  },
  ACCOUNTS_RECEIVABLE: {
    fg: "var(--voyzu-color-success-text)",
    bg: "var(--voyzu-color-success-bg)",
    border: "var(--voyzu-color-success-border)",
  },
  ACCOUNTS_PAYABLE: {
    fg: "var(--voyzu-color-danger-text)",
    bg: "var(--voyzu-color-danger-bg)",
    border: "var(--voyzu-color-danger-border)",
  },
  TAX: {
    fg: "var(--voyzu-color-warning-text)",
    bg: "var(--voyzu-color-warning-bg)",
    border: "var(--voyzu-color-warning-border)",
  },
  INVENTORY: {
    fg: "#1f2937",
    bg: "#e0f2fe",
    border: "#bae6fd",
  },
};

const supportingLedgerShort: Record<string, string> = {
  GENERAL: "General",
  ACCOUNTS_RECEIVABLE: "AR",
  ACCOUNTS_PAYABLE: "AP",
  TAX: "Tax",
  INVENTORY: "Inventory",
  BANK_CASH: "Bank / Cash",
};

function ledgerShortLabel(code: string): string {
  return supportingLedgerShort[code] ?? code;
}

function ledgerColor(code: string): BadgeCustomColors {
  return subledgerColors[code] ?? {
    fg: "var(--voyzu-color-neutral-text)",
    bg: "var(--voyzu-color-neutral-bg)",
    border: "var(--voyzu-color-neutral-border)",
  };
}

function ReadOnlyField({
  label,
  value,
  badge,
}: {
  label: string;
  value: string | number | null | undefined;
  badge?: ReactNode;
}) {
  return (
    <div className={detailStyles.fieldGroup}>
      <label className={typography.fieldLabel}>{label}</label>
      <Input value={value == null || value === "" ? "-" : String(value)} badge={badge} disabled />
    </div>
  );
}

export function FinancialDocumentTypeDetailsTab({ processor }: { processor: FinancialDocumentTypeResponseDto }) {
  const shortLabel = ledgerShortLabel(processor.primarySupportingLedger);

  return (
    <div className={`${detailStyles.card} ${localStyles.sectionCard}`}>
      <h2 className={localStyles.sectionTitle}>Details</h2>
      <div className={`${detailStyles.formGrid} ${localStyles.detailsGrid}`}>
        <ReadOnlyField label="Document Code" value={processor.code} />
        <ReadOnlyField label="Name" value={processor.name} />
        <ReadOnlyField label="Document Purpose" value={processor.documentPurpose} />
        <ReadOnlyField label="Description" value={processor.description} />
        <ReadOnlyField
          label="Primary Supporting Ledger"
          value={ledgerName(processor.primarySupportingLedger)}
          badge={
            <Badge
              variant="soft"
              size="x-small"
              customColors={ledgerColor(processor.primarySupportingLedger)}
            >
              {shortLabel}
            </Badge>
          }
        />
        <ReadOnlyField
          label="Supports Dimensions"
          value={processor.supportsDimensions ? "Yes" : "No"}
        />
        <ReadOnlyField
          label="Supports Bank / Cash Details"
          value={processor.cashMovement ? "Yes" : "No"}
        />
        <ReadOnlyField
          label="Supports Items"
          value={processor.supportsItems ? "Yes" : "No"}
        />
      </div>
    </div>
  );
}

function PostingLedgerPreview({ template }: { template: FinancialDocumentTypePostingTemplateDto }) {
  return (
    <div className={localStyles.journalPreview}>
      <h3>{template.outputTitle}</h3>
      {template.outputLines.map((line, index) => (
        <div
          key={`${line.side}-${line.glAccount?.code ?? line.fallbackLabel}-${index}`}
          className={`${localStyles.journalLine} ${
            line.side === "CR" ? localStyles.journalCredit : ""
          }`}
        >
          <Badge variant="soft" size="x-small" color={getDrCrColor(line.side)}>
            {line.side}
          </Badge>
          {line.reversalOfDocument ? (
            <>
              <Badge variant="soft" size="small" color="neutral">REVERSAL</Badge>
              <span>REVERSAL OF DOCUMENT</span>
            </>
          ) : line.glAccount ? (
            <>
              <span>{line.glAccount.name}</span>
              <Badge variant="soft" size="small" color="neutral">{line.glAccount.code}</Badge>
            </>
          ) : (
            <>
              <span>{line.fallbackLabel}</span>
              <Badge variant="soft" size="small" color="neutral">-</Badge>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function DynamicPostingEntryPointCard({
  card,
  processorCode,
  supportsItems,
  routePrefix,
}: {
  card: FinancialDocumentTypePostingTemplateDto["cards"][number];
  processorCode: string;
  supportsItems: boolean;
  routePrefix: string;
}) {
  const resolvedGl = card.resolvesTo ?? card.documentDefault?.glAccount ?? null;
  const overrideText = card.overrideText && card.overrideCode
    ? (
      <>
        {card.overrideText.split("{{slot}}")[0]}
        <code>{card.overrideCode}</code>
        {card.overrideText.split("{{slot}}")[1]}
      </>
    )
    : undefined;
  const stackedValueClass = `${localStyles.postingMetaValue} ${localStyles.postingMetaStack}`;
  const documentDefaultCode = card.managedIn?.link.label === "Document defaults"
    ? card.managedIn.badge?.label
    : undefined;
  const showItemPostingProfiles = supportsItems && Boolean(card.documentDefault);
  const itemPostingProfilesHref = routePrefix.startsWith("/finance")
    ? "/finance/inventory/item-posting-profiles"
    : `${routePrefix}/inventory/item-posting-profiles`;

  return (
    <div className={localStyles.postingCard}>
      <h3 className={localStyles.postingCardTitle}>
        <Badge variant="soft" size="x-small" color={getDrCrColor(card.side)}>
          {card.side}
        </Badge>
        <span>{card.title}</span>
      </h3>
      {card.controlAccount && (
        <div className={localStyles.postingMeta}>
          <span>Control Account</span>
          <span className={stackedValueClass}>
            {card.controlAccount.name && <span>{card.controlAccount.name}</span>}
            <Badge variant="soft" size="small" color="neutral">
              {card.controlAccount.label}
            </Badge>
          </span>
        </div>
      )}
      {(documentDefaultCode || card.documentDefault) && (
        <div className={localStyles.postingMeta}>
          <span>Document Default</span>
          <span className={stackedValueClass}>
            <Badge variant="soft" size="small" color="neutral">
              {documentDefaultCode ?? card.documentDefault?.label}
            </Badge>
          </span>
        </div>
      )}
      {card.documentDefault && (
        <div className={localStyles.postingMeta}>
          <span>Resolves To</span>
          <span className={stackedValueClass}>
            {card.documentDefault.glAccount ? (
              <>
                <span>{card.documentDefault.glAccount.name}</span>
                <Badge variant="soft" size="small" color="neutral">
                  {card.documentDefault.glAccount.code}
                </Badge>
              </>
            ) : (
              <span>Per item posting profile</span>
            )}
          </span>
        </div>
      )}
      {!card.documentDefault && (
        <div className={localStyles.postingMeta}>
          <span>Resolves To</span>
          <span className={stackedValueClass}>
            <span>{resolvedGl?.name ?? "-"}</span>
            <Badge variant="soft" size="small" color="neutral">
              {resolvedGl?.code ?? "-"}
            </Badge>
          </span>
        </div>
      )}
      {card.managedIn && (
        <div className={localStyles.postingMeta}>
          <span>Managed In</span>
          <span className={localStyles.postingMetaValue}>
            <a
              className={typography.link}
              href={detailLinkWithBackContext(card.managedIn.link.href, "financialDocumentType", processorCode)}
            >
              {card.managedIn.link.label}
            </a>
          </span>
        </div>
      )}
      {showItemPostingProfiles && (
        <div className={localStyles.itemPostingProfilesBox}>
          <h4>Item Posting Profiles</h4>
          <p>Item Posting Profiles will control GL account codes used for lines where items are supplied.</p>
          <a className={`${typography.link} ${localStyles.itemPostingProfilesLink}`} href={itemPostingProfilesHref}>
            Manage item posting profiles
          </a>
        </div>
      )}
      {overrideText && (
        <div className={localStyles.postingMeta}>
          <span>Override</span>
          <span className={localStyles.postingMetaValue}>{overrideText}</span>
        </div>
      )}
    </div>
  );
}

export function FinancialDocumentTypePostingModel({
  template,
  processorCode,
  supportsItems,
  routePrefix,
}: {
  template: FinancialDocumentTypePostingTemplateDto | null;
  processorCode: string;
  supportsItems: boolean;
  routePrefix: string;
}) {
  if (!template) {
    return (
      <div className={localStyles.syntheticStack}>
        <div className={`${detailStyles.card} ${localStyles.sectionCard}`}>
          <h2 className={localStyles.sectionTitle}>Posting model</h2>
          <p className={localStyles.syntheticIntro}>Posting model configuration is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={localStyles.syntheticStack}>
      <div className={`${detailStyles.card} ${localStyles.sectionCard}`}>
        <h2 className={localStyles.sectionTitle}>{template.title}</h2>
        <p className={localStyles.syntheticIntro}>{template.description}</p>
        <div className={localStyles.equationBox}>
          <span className={localStyles.equationTerm}>{template.formula}</span>
        </div>
        <PostingLedgerPreview template={template} />
        {template.isCancellation ? (
          <div className={localStyles.journalPreview}>
            <h3>Cancellation treatment</h3>
            <p className={localStyles.syntheticIntro}>
              {template.cancellationMessage ??
                "Cancellation documents reverse the ledger treatment of the referenced source document."}
            </p>
          </div>
        ) : template.hideComponents ? null : (
          <div className={localStyles.postingGrid}>
            {template.cards.map((card) => (
              <DynamicPostingEntryPointCard
                key={card.key}
                card={card}
                processorCode={processorCode}
                supportsItems={supportsItems}
                routePrefix={routePrefix}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function FinancialDocumentTypePostingModelControl({
  postingTemplate,
  processorCode,
  supportsItems,
  routePrefix = "/organization",
}: FinancialDocumentTypePostingModelProps) {
  return (
    <FinancialDocumentTypePostingModel
      template={postingTemplate}
      processorCode={processorCode}
      supportsItems={supportsItems}
      routePrefix={routePrefix}
    />
  );
}
