import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType, GlAccountPointerReference } from "@voyzu/finance/types/modules/core";
import { AuditMetadataDto } from "@voyzu/finance/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const InventoryControlAccountSettingResponseDto = StrictObject({
  code: BusinessCode,
  ledger: Type.Literal("INVENTORY"),
  name: NonBlankText,
  description: Type.String(),
  requiredAccountType: Type.Union([AccountType, Type.Null()]),
  glAccountId: PositiveId,
  glAccount: StrictObject({
    code: BusinessCode,
    name: NonBlankText,
    accountType: AccountType,
  }),
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE"), Type.Null()]),
  hasPostings: Type.Boolean(),
  companiesWithPostings: Type.Array(Type.String()),
  linkedBy: Type.Array(GlAccountPointerReference),
  audit: AuditMetadataDto,
});
export type InventoryControlAccountSettingResponseDto = Type.Static<typeof InventoryControlAccountSettingResponseDto>;
