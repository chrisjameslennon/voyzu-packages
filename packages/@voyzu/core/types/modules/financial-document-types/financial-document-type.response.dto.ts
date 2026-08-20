import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/core/types/modules/core";
import { Ledger, Status } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText } from "@voyzu/core/types/constraints";

export const FinancialDocumentTypeResponseDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
  description: Type.String(),
  documentPurpose: Type.String(),
  primarySupportingLedger: Ledger,
  supportsDimensions: Type.Boolean(),
  cashMovement: Type.Boolean(),
  supportsItems: Type.Boolean(),
  status: Status,
  audit: AuditMetadataDto,
});
export type FinancialDocumentTypeResponseDto = Type.Static<typeof FinancialDocumentTypeResponseDto>;
