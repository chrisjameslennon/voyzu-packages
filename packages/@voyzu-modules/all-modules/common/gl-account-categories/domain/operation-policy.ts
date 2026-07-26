import { Deactivation, Deletion, type LinkedReference, type OperationBlocker } from "@voyzu-modules/all-modules/common/domain/operation-policy";

export interface GlAccountCategoryOperationState {
  code: string;
  linkedBy: readonly LinkedReference[];
}

export function Deactivate(current: GlAccountCategoryOperationState): OperationBlocker[] {
  return Deactivation(current, "Reporting category");
}

export function Delete(current: GlAccountCategoryOperationState): OperationBlocker[] {
  return Deletion(current, "Reporting category");
}
