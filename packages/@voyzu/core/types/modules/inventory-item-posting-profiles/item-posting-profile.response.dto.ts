import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto, OperationReference } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const ItemPostingProfileGlRefDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
});
export type ItemPostingProfileGlRefDto = Type.Static<typeof ItemPostingProfileGlRefDto>;

export const ItemPostingProfileResponseDto = StrictObject({
  id: PositiveId,
  profile_code: BusinessCode,
  profile_name: NonBlankText,
  description: Type.String(),
  is_sold: Type.Boolean(),
  is_purchased: Type.Boolean(),
  is_consumed: Type.Boolean(),
  revenue_code: Type.Union([ItemPostingProfileGlRefDto, Type.Null()]),
  cogs_code: Type.Union([ItemPostingProfileGlRefDto, Type.Null()]),
  purchase_expense_code: Type.Union([ItemPostingProfileGlRefDto, Type.Null()]),
  consumption_code: Type.Union([ItemPostingProfileGlRefDto, Type.Null()]),
  adjustment_gain_code: Type.Union([ItemPostingProfileGlRefDto, Type.Null()]),
  adjustment_loss_code: Type.Union([ItemPostingProfileGlRefDto, Type.Null()]),
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
  linkedBy: Type.Array(OperationReference),
  audit: AuditMetadataDto,
});
export type ItemPostingProfileResponseDto = Type.Static<typeof ItemPostingProfileResponseDto>;
