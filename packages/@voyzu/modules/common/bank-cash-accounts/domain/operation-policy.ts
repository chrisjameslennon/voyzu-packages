import type { AccountType, Status } from "@voyzu/types/modules";
import type { BankCashAccountType } from "@voyzu/types/modules/bank-cash-accounts";
import {
  CodeChangeAvailability as SharedCodeChangeAvailability,
  Deactivation,
  Deletion,
  GLAccountReassignment,
  type LinkedReference,
  type OperationBlocker,
} from "@voyzu/modules/common/domain/operation-policy";

export interface BankCashAccountOperationState {
  code: string;
  glAccountId: number;
  hasPostings: boolean;
  linkedBy: readonly LinkedReference[];
}

export interface BankCashGlAccountTarget {
  id: number;
  status: Status;
  accountType: AccountType;
}

export function ChangeCode(
  current: BankCashAccountOperationState,
  proposedCode: string,
): OperationBlocker[] {
  if (proposedCode === current.code) return [];
  return ChangeCodeAvailability(current);
}

export function ChangeCodeAvailability(current: BankCashAccountOperationState): OperationBlocker[] {
  const blockers = SharedCodeChangeAvailability(current, "Bank / Cash Account");
  if (current.linkedBy.length > 0) {
    blockers.push({
      code: "LINKED_RECORD_CODE_LOCKED",
      message: `Bank / Cash Account ${current.code} is linked to and its code cannot be changed`,
    });
  }
  return blockers;
}

export function ChangeType(
  current: BankCashAccountOperationState & { type: BankCashAccountType },
  proposedType: BankCashAccountType,
): OperationBlocker[] {
  if (proposedType === current.type) return [];
  return ChangeTypeAvailability(current);
}

export function ChangeTypeAvailability(current: BankCashAccountOperationState): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (current.hasPostings) {
    blockers.push({
      code: "HAS_POSTINGS_TYPE_LOCKED",
      message: `Bank / Cash Account ${current.code} has postings and its type cannot be changed`,
    });
  }
  if (current.linkedBy.length > 0) {
    blockers.push({
      code: "LINKED_RECORD_TYPE_LOCKED",
      message: `Bank / Cash Account ${current.code} is linked to and its type cannot be changed`,
    });
  }
  return blockers;
}

export function UpdateGLAccount(
  current: BankCashAccountOperationState,
  target: BankCashGlAccountTarget,
): OperationBlocker[] {
  const blockers = GLAccountReassignment(current, target.id, "Bank / Cash Account");
  if (target.id === current.glAccountId) return blockers;
  blockers.push(...AssignGLAccount(target));
  return blockers;
}

export function AssignGLAccount(target: BankCashGlAccountTarget): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (target.status !== "ACTIVE") {
    blockers.push({ code: "GL_ACCOUNT_NOT_ACTIVE", message: "GL account must be active" });
  }
  if (target.accountType !== "ASSET") {
    blockers.push({ code: "GL_ACCOUNT_TYPE_INVALID", message: "Bank / Cash Account requires an ASSET GL account" });
  }
  return blockers;
}

export function Deactivate(current: BankCashAccountOperationState): OperationBlocker[] {
  return Deactivation(current, "Bank / Cash Account");
}

export function Delete(current: BankCashAccountOperationState): OperationBlocker[] {
  return Deletion(current, "Bank / Cash Account", { blockWhenHasPostings: true });
}
