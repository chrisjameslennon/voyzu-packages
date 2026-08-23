import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/finance/types/modules/core";
import { AccountType, OperationReference, Status } from "@voyzu/finance/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const GlAccountCategoryResponseDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  name: NonBlankText,
  accountType: AccountType,
  sequence: Type.Number(),
  status: Status,
  hasPostings: Type.Boolean(),
  companiesWithPostings: Type.Array(Type.String()),
  linkedBy: Type.Array(OperationReference),
  audit: AuditMetadataDto,
});
export type GlAccountCategoryResponseDto = Type.Static<typeof GlAccountCategoryResponseDto>;
