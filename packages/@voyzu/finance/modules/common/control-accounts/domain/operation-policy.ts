import type { AccountType, Status } from "@voyzu/finance/types/modules/core";
import type { OperationBlocker } from "@voyzu/finance/common/domain/operation-policy";

export type { OperationBlocker } from "@voyzu/finance/common/domain/operation-policy";

/**
 * A reason why an operation cannot be performed.
 *
 * An empty blocker array means the operation is valid.
 *
 * The code is stable and suitable for tests or client behaviour.
 * The message is suitable for display or for a BusinessRuleError.
 */
/**
 * The minimum current control-account information required to assess a
 * GL-account change.
 *
 * The service is responsible for loading and supplying this complete object.
 */
export interface UpdateGLAccountCurrent {
  code: string;
  glAccountId: number;
  hasPostings: boolean;
}

/**
 * The proposed GL account.
 *
 * This is not the raw PATCH DTO. The service must first resolve the supplied
 * GL-account ID so the policy receives the minimum complete information it
 * needs to assess the operation.
 */
export interface UpdateGLAccountTarget {
  id: number;
  status: Status;
  accountType: AccountType;
}

/**
 * The fixed requirements that apply to this control account.
 *
 * These are neither properties of the current record nor properties of the
 * proposed GL account.
 */
export interface UpdateGLAccountRequirements {
  requiredAccountType: AccountType;
}

/**
 * Determines whether the linked GL account may be changed.
 *
 * This function is pure and can be shared by client and server code.
 *
 * The client may use the returned blockers to disable or explain the control.
 * The server must evaluate the same policy again using freshly loaded data
 * before performing the update.
 */
export function UpdateGLAccount(
  current: UpdateGLAccountCurrent,
  target: UpdateGLAccountTarget,
  requirements: UpdateGLAccountRequirements,
): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];

  // Assigning the currently linked GL account is not a change.
  if (target.id === current.glAccountId) {
    return blockers;
  }

  // Once postings exist, the linked GL account cannot be changed.
  if (current.hasPostings) {
    blockers.push({
      code: "CONTROL_ACCOUNT_HAS_POSTINGS",
      message: `Control account ${current.code} is in use and cannot be changed`,
    });
  }

  // The proposed GL account must be active.
  if (target.status !== "ACTIVE") {
    blockers.push({
      code: "GL_ACCOUNT_NOT_ACTIVE",
      message: "GL account must be active",
    });
  }

  // The proposed GL account must satisfy the fixed control-account requirement.
  if (target.accountType !== requirements.requiredAccountType) {
    blockers.push({
      code: "GL_ACCOUNT_TYPE_INVALID",
      message: `${current.code} requires a ${requirements.requiredAccountType} GL account`,
    });
  }

  return blockers;
}
