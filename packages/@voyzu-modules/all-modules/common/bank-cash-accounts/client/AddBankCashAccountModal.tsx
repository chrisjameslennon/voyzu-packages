"use client";

import type { BankCashAccountCreateRequestDto, BankCashAccountType } from "@voyzu-modules/types/modules/bank-cash-accounts";
import { Badge, Button, Input, SearchableSelect, ValidationAlert } from "@voyzu/ui-components";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface AddBankCashAccountModalProps {
  isOpen: boolean;
  value: BankCashAccountCreateRequestDto;
  glAccountOptions: Array<{ value: string; label: string; code?: string }>;
  errors: string[];
  showErrors: boolean;
  saving: boolean;
  onChange: (value: BankCashAccountCreateRequestDto) => void;
  onClose: () => void;
  onDismissErrors: () => void;
  onSubmit: () => void;
}

const TYPE_OPTIONS: Array<{ value: BankCashAccountType; label: string }> = [
  { value: "BANK", label: "Bank" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
];

export function AddBankCashAccountModal({
  isOpen,
  value,
  glAccountOptions,
  errors,
  showErrors,
  saving,
  onChange,
  onClose,
  onDismissErrors,
  onSubmit,
}: AddBankCashAccountModalProps) {
  if (!isOpen) return null;
  const update = <K extends keyof BankCashAccountCreateRequestDto>(key: K, fieldValue: BankCashAccountCreateRequestDto[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.header}>
          <h3 className={typography.contentTitle}>Add Bank / Cash Account</h3>
          <Button variant="plain" icon="close" title="Close" onClick={onClose} />
        </div>
        <div className={modalStyles.body}>
          <ValidationAlert errors={errors} visible={showErrors} onDismiss={onDismissErrors} />
          <div className={modalStyles.fieldRow}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Code</span>
              <Input value={value.code} maxLength={40} onChange={(event) => update("code", event.target.value)} />
              <span className={typography.fieldHelp}>Capital letters, numbers, dash (-) and underscore (_) only. 40 characters max.</span>
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Type</span>
              <SearchableSelect value={value.type} searchable={false} options={TYPE_OPTIONS} onChange={(next) => update("type", next as BankCashAccountType)} />
            </label>
          </div>
          <label className={modalStyles.fieldGroup}>
            <span className={typography.fieldLabel}>GL Account <Badge variant="soft" size="x-small" color="neutral">ASSET</Badge></span>
            <SearchableSelect value={value.glAccountId ? String(value.glAccountId) : ""} options={glAccountOptions} placeholder="Select a GL account" searchPlaceholder="Search GL accounts..." onChange={(next) => update("glAccountId", Number(next))} />
          </label>
          {value.type === "BANK" ? (
            <>
              <div className={modalStyles.fieldRow}>
                <label className={modalStyles.fieldGroup}>
                  <span className={typography.fieldLabel}>Bank Name (optional)</span>
                  <Input value={value.bankName ?? ""} maxLength={50} onChange={(event) => update("bankName", event.target.value)} />
                </label>
                <label className={modalStyles.fieldGroup}>
                  <span className={typography.fieldLabel}>Bank Branch Name (optional)</span>
                  <Input value={value.bankBranchName ?? ""} maxLength={50} onChange={(event) => update("bankBranchName", event.target.value)} />
                </label>
              </div>
              <label className={modalStyles.fieldGroup}>
                <span className={typography.fieldLabel}>Bank Account Identifier (optional)</span>
                <Input value={value.bankAccountIdentifier ?? ""} maxLength={100} onChange={(event) => update("bankAccountIdentifier", event.target.value)} />
              </label>
            </>
          ) : (
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Cash Account Identifier (optional)</span>
              <Input value={value.cashAccountIdentifier ?? ""} maxLength={100} onChange={(event) => update("cashAccountIdentifier", event.target.value)} />
            </label>
          )}
        </div>
        <div className={modalStyles.footer}>
          <Button variant="cancel" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={saving} onClick={onSubmit}>{saving ? "Creating..." : "Create Account"}</Button>
        </div>
      </div>
    </div>
  );
}
