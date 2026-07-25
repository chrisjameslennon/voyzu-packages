import type { AccountType } from "@voyzu/types/modules";
import type {
  FinancialDocumentDefaultOverrideScope,
  FinancialDocumentDefaultTargetType,
} from "./financial-document-default.response.dto";

export interface FinancialDocumentDefaultCreateRequestDto {
  /** Document processor code this row belongs to. */
  documentCode: string;
  /** Stable financial-document default slot code. */
  code: string;
  /** Display name for this default slot. */
  name: string;
  /** Whether this default resolves directly to GL or through Bank / Cash. */
  targetType: FinancialDocumentDefaultTargetType;
  /** GL account types allowed for this default slot. */
  allowedAccountTypes: AccountType[];
  /** Request property used to override this default. */
  overridePropertyName: string;
  /** Request level where this default can be overridden. */
  overrideScope: FinancialDocumentDefaultOverrideScope;
  /** Unique numeric identifier of the GL account to link to this posting code. */
  glAccountId?: number;
  /** Unique numeric identifier of the Bank / Cash control account to link to this posting code. */
  bankCashControlAccountId?: number;
}
