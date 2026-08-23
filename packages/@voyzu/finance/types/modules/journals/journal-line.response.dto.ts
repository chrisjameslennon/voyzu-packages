import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { JournalLineDimensionResponseDto } from "./journal-line-dimension.response.dto";
import { DrCr } from "@voyzu/finance/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const JournalLineResponseDto = StrictObject({
  id: PositiveId,
  journalHeaderId: PositiveId,
  lineNumber: PositiveId,
  glAccountId: PositiveId,
  glAccountCode: BusinessCode,
  glAccountName: NonBlankText,
  sourceLedger: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  sourceControlAccount: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  description: Type.String(),
  memo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  drCr: DrCr,
  baseCurrencyAmount: Type.Number(),
  dimensions: Type.Optional(Type.Array(JournalLineDimensionResponseDto)),
});
export type JournalLineResponseDto = Type.Static<typeof JournalLineResponseDto>;
