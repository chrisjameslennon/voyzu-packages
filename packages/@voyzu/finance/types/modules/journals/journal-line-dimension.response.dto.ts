import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const JournalLineDimensionResponseDto = StrictObject({
  id: PositiveId,
  journalLineId: PositiveId,
  dimensionId: PositiveId,
  dimensionValueId: PositiveId,
  dimensionCode: BusinessCode,
  dimensionName: NonBlankText,
  dimensionValueName: NonBlankText,
});
export type JournalLineDimensionResponseDto = Type.Static<typeof JournalLineDimensionResponseDto>;
