import type { JournalLineDimensionResponseDto } from "./journal-line-dimension.response.dto";
import type { DrCr } from "@voyzu-modules/core/types/modules/core";

export interface JournalLineResponseDto {
  id: number;
  journalHeaderId: number;
  lineNumber: number;
  glAccountId: number;
  glAccountCode: string;
  glAccountName: string;
  sourceLedger?: string | null;
  sourceControlAccount?: string | null;
  description: string;
  memo?: string | null;
  drCr: DrCr;
  baseCurrencyAmount: number;
  dimensions?: JournalLineDimensionResponseDto[];
}
