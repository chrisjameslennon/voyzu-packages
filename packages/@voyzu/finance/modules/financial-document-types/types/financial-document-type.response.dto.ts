import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "../../common/types/index";
import { Ledger, Status } from "../../common/types/index";
import { BusinessCode, NonBlankText } from "../../common/types/constraints";

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
