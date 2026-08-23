import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/finance/types/modules/core";
import { AccountType, GlAccountPointerReference } from "@voyzu/finance/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const GlAccountStatus = Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]);
export type GlAccountStatus = Type.Static<typeof GlAccountStatus>;

export const GlAccountLinkedByDto = GlAccountPointerReference;
export type GlAccountLinkedByDto = Type.Static<typeof GlAccountLinkedByDto>;

export const GlAccountResponseDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  name: NonBlankText,
  accountType: AccountType,
  accountCategoryId: Type.Optional(PositiveId),
  category: Type.Optional(StrictObject({
    code: BusinessCode,
    name: NonBlankText,
  })),
  status: GlAccountStatus,
  linkedBy: Type.Array(GlAccountLinkedByDto),
  hasPostings: Type.Boolean({ description: "True when one or more posted journal headers include a line for this GL account." }),
  companiesWithPostings: Type.Array(Type.String()),
  audit: AuditMetadataDto,
});
export type GlAccountResponseDto = Type.Static<typeof GlAccountResponseDto>;
