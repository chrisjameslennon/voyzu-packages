import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/core/types/modules/core";
import { AccountType, GlAccountPointerReference, Status } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const ControlAccountResponseDto = StrictObject({
  code: BusinessCode,
  ledger: Type.Union([Type.Literal("ACCOUNTS_RECEIVABLE"), Type.Literal("ACCOUNTS_PAYABLE")]),
  name: NonBlankText,
  glAccountId: PositiveId,
  glAccount: Type.Union([StrictObject({
    code: BusinessCode,
    name: NonBlankText,
    accountType: AccountType,
  }), Type.Null()]),
  status: Status,
  hasPostings: Type.Boolean({ description: "True when one or more posted journal headers include a line for this control account's linked GL account." }),
  companiesWithPostings: Type.Array(Type.String()),
  linkedBy: Type.Array(GlAccountPointerReference),
  audit: AuditMetadataDto,
});
export type ControlAccountResponseDto = Type.Static<typeof ControlAccountResponseDto>;
