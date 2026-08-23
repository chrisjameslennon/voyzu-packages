"use client";

import type { BankCashAccountPatchRequestDto, BankCashAccountResponseDto, BankCashAccountType } from "@voyzu/finance/types/modules/bank-cash-accounts";
import { Badge, Button, Input, SearchableSelect } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface BankCashAccountDetailsFormProps {
  code: BankCashAccountResponseDto["code"];
  type: BankCashAccountResponseDto["type"];
  glAccountId: string;
  glAccountOptions: Array<{ value: string; label: string; code?: string }>;
  glAccountTypeBadge?: string;
  glAccountDisabled?: boolean;
  bankName: string;
  bankBranchName: string;
  bankAccountIdentifier: NonNullable<BankCashAccountPatchRequestDto["bankAccountIdentifier"]>;
  cashAccountIdentifier: string;
  saving?: boolean;
  readOnly?: boolean;
  codeDisabled?: boolean;
  typeDisabled?: boolean;
  codeHasError?: boolean;
  onCodeChange: (value: NonNullable<BankCashAccountPatchRequestDto["code"]>) => void;
  onTypeChange: (value: BankCashAccountType) => void;
  onGlAccountChange: (value: string) => void;
  onBankNameChange: (value: string) => void;
  onBankBranchNameChange: (value: string) => void;
  onBankAccountIdentifierChange: (value: string) => void;
  onCashAccountIdentifierChange: (value: string) => void;
  onSave: () => void;
}

export function BankCashAccountDetailsForm({
  code,
  type,
  glAccountId,
  glAccountOptions,
  glAccountTypeBadge,
  glAccountDisabled = false,
  bankName,
  bankBranchName,
  bankAccountIdentifier,
  cashAccountIdentifier,
  saving = false,
  readOnly = false,
  codeDisabled = false,
  typeDisabled = false,
  codeHasError = false,
  onCodeChange,
  onTypeChange,
  onGlAccountChange,
  onBankNameChange,
  onBankBranchNameChange,
  onBankAccountIdentifierChange,
  onCashAccountIdentifierChange,
  onSave,
}: BankCashAccountDetailsFormProps) {
  return (
    <section className={detailStyles.card}>
      <div className={detailStyles.cardHeader}>
        <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Bank / Cash Account Details</h2>
        <div className={detailStyles.cardHeaderActions}>
          <Button variant="secondary" icon="save" disabled={saving || readOnly} onClick={onSave}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className={detailStyles.formGrid}>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Code</span>
          <Input
            invalid={codeHasError}
            value={code}
            maxLength={40}
            disabled={readOnly || codeDisabled}
            onChange={(event) => onCodeChange(event.target.value)}
          />
          <span className={typography.fieldHelp}>Capital letters, numbers, dash (-) and underscore (_) only. 40 characters max.</span>
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Type</span>
          <SearchableSelect
            value={type}
            options={[
              { value: "BANK", label: "Bank" },
              { value: "CASH", label: "Cash" },
              { value: "OTHER", label: "Other" },
            ]}
            searchable={false}
            disabled={readOnly || typeDisabled}
            onChange={(value) => onTypeChange(value as BankCashAccountType)}
          />
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={`${typography.fieldLabel} ${detailStyles.inlineGroup}`}>GL Account {glAccountTypeBadge ? <Badge variant="soft" size="x-small" color="neutral">{glAccountTypeBadge}</Badge> : null}</span>
          <SearchableSelect
            value={glAccountId}
            onChange={onGlAccountChange}
            options={glAccountOptions}
            placeholder="Select a GL account"
            searchPlaceholder="Search GL accounts..."
            disabled={readOnly || glAccountDisabled}
          />
        </label>
        {type === "BANK" ? (
          <>
            <label className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Bank Name (optional)</span>
              <Input value={bankName} maxLength={50} disabled={readOnly} onChange={(event) => onBankNameChange(event.target.value)} />
            </label>
            <label className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Bank Branch Name (optional)</span>
              <Input value={bankBranchName} maxLength={50} disabled={readOnly} onChange={(event) => onBankBranchNameChange(event.target.value)} />
            </label>
            <label className={detailStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Bank Account Identifier (optional)</span>
              <Input value={bankAccountIdentifier} maxLength={100} disabled={readOnly} onChange={(event) => onBankAccountIdentifierChange(event.target.value)} />
            </label>
          </>
        ) : (
          <label className={detailStyles.fieldGroup}>
            <span className={typography.fieldLabel}>Cash Account Identifier (optional)</span>
            <Input value={cashAccountIdentifier} maxLength={100} disabled={readOnly} onChange={(event) => onCashAccountIdentifierChange(event.target.value)} />
          </label>
        )}
      </div>
    </section>
  );
}
