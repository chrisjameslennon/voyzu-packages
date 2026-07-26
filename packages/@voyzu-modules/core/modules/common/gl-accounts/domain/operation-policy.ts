import {
  CodeChange,
  CodeChangeAvailability as SharedCodeChangeAvailability,
  Deactivation,
  Deletion,
  type LinkedReference,
  type OperationBlocker,
} from "@voyzu-modules/core/common/domain/operation-policy";

export interface GlAccountOperationState {
  code: string;
  hasPostings: boolean;
  linkedBy: readonly LinkedReference[];
}

export function ChangeCode(current: GlAccountOperationState, proposedCode: string): OperationBlocker[] {
  return CodeChange(current, proposedCode, "GL account");
}

export function ChangeCodeAvailability(current: GlAccountOperationState): OperationBlocker[] {
  return SharedCodeChangeAvailability(current, "GL account");
}

export function Deactivate(current: GlAccountOperationState): OperationBlocker[] {
  return Deactivation(current, "GL account");
}

export function Delete(current: GlAccountOperationState): OperationBlocker[] {
  return Deletion(current, "GL account", { blockWhenHasPostings: true });
}
