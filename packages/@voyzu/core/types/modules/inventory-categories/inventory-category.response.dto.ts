import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto, OperationReference } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const InventoryCategoryResponseDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  name: NonBlankText,
  description: Type.String(),
  posting_profile_code: BusinessCode,
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
  numberOfItems: StrictObject({
    total: Type.Number(),
    active: Type.Number(),
    inactive: Type.Number(),
  }),
  linkedBy: Type.Array(OperationReference),
  audit: AuditMetadataDto,
});
export type InventoryCategoryResponseDto = Type.Static<typeof InventoryCategoryResponseDto>;
