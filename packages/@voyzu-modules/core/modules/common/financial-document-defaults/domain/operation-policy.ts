import type { AccountType, Status } from "@voyzu/types/modules";
import type { FinancialDocumentDefaultTargetType } from "@voyzu-modules/core/types/modules/financial-document-defaults";
import type { OperationBlocker } from "@voyzu-modules/core/common/domain/operation-policy";

export interface FinancialDocumentDefaultOperationState {
  code: string;
  targetType: FinancialDocumentDefaultTargetType;
  allowedAccountTypes: readonly AccountType[];
}

export type FinancialDocumentDefaultTarget =
  | { kind: "GENERAL_LEDGER"; id: number; status: Status; accountType: AccountType }
  | { kind: "BANK_CASH_ACCOUNT"; id: number; status: Status };

export function AssignTarget(current: FinancialDocumentDefaultOperationState, target: FinancialDocumentDefaultTarget): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (target.kind !== current.targetType) {
    blockers.push({ code: "TARGET_TYPE_INVALID", message: `${current.targetType} financial document default ${current.code} requires a ${current.targetType} target` });
    return blockers;
  }
  if (target.status !== "ACTIVE") blockers.push({ code: "TARGET_NOT_ACTIVE", message: "Financial document default target must be active" });
  if (target.kind === "GENERAL_LEDGER" && !current.allowedAccountTypes.includes(target.accountType)) {
    blockers.push({ code: "GL_ACCOUNT_TYPE_INVALID", message: `GL account type ${target.accountType} is not allowed for this financial document default` });
  }
  return blockers;
}
