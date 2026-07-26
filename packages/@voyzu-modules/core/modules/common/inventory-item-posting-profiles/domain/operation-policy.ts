import { Deactivation, Deletion, type LinkedReference, type OperationBlocker } from "@voyzu-modules/core/common/domain/operation-policy";
import type { AccountType, Status } from "@voyzu/types/modules";

export interface ItemPostingProfileOperationState {
  code: string;
  linkedBy: readonly LinkedReference[];
}

export interface ItemPostingProfileGLTarget {
  code: string;
  status: Status;
  accountType: AccountType;
}

export interface ItemPostingProfilePermissions {
  is_sold: boolean;
  is_purchased: boolean;
  is_consumed: boolean;
}

export type ItemPostingProfileAccountField =
  | "revenue_code"
  | "cogs_code"
  | "purchase_expense_code"
  | "consumption_code"
  | "adjustment_gain_code"
  | "adjustment_loss_code";

export function PostingAccountEnabled(
  field: ItemPostingProfileAccountField,
  permissions: ItemPostingProfilePermissions,
): boolean {
  if (field === "revenue_code" || field === "cogs_code") return permissions.is_sold;
  if (field === "purchase_expense_code") return permissions.is_purchased;
  if (field === "consumption_code") return permissions.is_consumed;
  return true;
}

export function PostingAccountRequired(
  field: ItemPostingProfileAccountField,
  permissions: ItemPostingProfilePermissions,
): boolean {
  if (field === "revenue_code" || field === "cogs_code") return permissions.is_sold;
  if (field === "purchase_expense_code") return permissions.is_purchased;
  if (field === "consumption_code") return permissions.is_consumed;
  return false;
}

const POSTING_ACCOUNT_FIELDS: ReadonlyArray<{
  field: ItemPostingProfileAccountField;
  label: string;
}> = [
  { field: "revenue_code", label: "Revenue code" },
  { field: "cogs_code", label: "COGS code" },
  { field: "purchase_expense_code", label: "Purchase expense code" },
  { field: "consumption_code", label: "Consumption code" },
  { field: "adjustment_gain_code", label: "Adjustment gain code" },
  { field: "adjustment_loss_code", label: "Adjustment loss code" },
];

export function ConfigurePostingAccounts(
  permissions: ItemPostingProfilePermissions,
  accounts: Partial<Record<ItemPostingProfileAccountField, string | null>>,
): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  for (const { field, label } of POSTING_ACCOUNT_FIELDS) {
    const value = accounts[field]?.trim();
    if (PostingAccountRequired(field, permissions) && !value) {
      blockers.push({
        code: "POSTING_ACCOUNT_REQUIRED",
        message: `${label} is required when its operation is permitted`,
      });
    } else if (value && !PostingAccountEnabled(field, permissions)) {
      blockers.push({
        code: "POSTING_ACCOUNT_NOT_PERMITTED",
        message: `${field} cannot be configured when its operation is not permitted`,
      });
    }
  }
  return blockers;
}

export function AssignGLAccount(target: ItemPostingProfileGLTarget, requiredAccountType: "REVENUE" | "EXPENSE"): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (target.status !== "ACTIVE") blockers.push({ code: "GL_ACCOUNT_NOT_ACTIVE", message: `GL account ${target.code} must be active` });
  if (target.accountType !== requiredAccountType) blockers.push({ code: "GL_ACCOUNT_TYPE_INVALID", message: `GL account ${target.code} must be a ${requiredAccountType} account` });
  return blockers;
}

export function Deactivate(current: ItemPostingProfileOperationState): OperationBlocker[] {
  return Deactivation(current, "Item posting profile");
}

export function Delete(current: ItemPostingProfileOperationState): OperationBlocker[] {
  return Deletion(current, "Item posting profile");
}
