import type { AuditMetadataDto } from "@voyzu-modules/core/types/modules/core";
import type { Ledger, Status } from "@voyzu-modules/core/types/modules/core";

export interface FinancialDocumentTypeResponseDto {
  code: string;
  name: string;
  description: string;
  documentPurpose: string;
  primarySupportingLedger: Ledger;
  supportsDimensions: boolean;
  cashMovement: boolean;
  supportsItems: boolean;
  status: Status;
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
