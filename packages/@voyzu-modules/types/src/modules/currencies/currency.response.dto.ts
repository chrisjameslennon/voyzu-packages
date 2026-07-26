import type { AuditMetadataDto, OperationReference } from "@voyzu/types/modules/core";
import type { Status } from "@voyzu/types/modules/core";

export interface CurrencyResponseDto {
  /** Stable currency identifier. */
  id: string;
  /** Stable currency business code. */
  code: string;
  /** Currency display name. */
  name: string;
  /** Currency symbol used for display. */
  symbol?: string;
  /** Current lifecycle status of the currency. */
  status: Status;
  /** True when at least one company using this base currency has posted journal headers. */
  hasPostings: boolean;
  /** Records that directly reference this currency. */
  linkedBy: OperationReference[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
