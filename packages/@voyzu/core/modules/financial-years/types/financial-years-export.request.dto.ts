import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const FinancialYearsExportRequestDto = StrictObject({
  companyId: PositiveId,
  yearIds: Type.Array(Type.Number(), { description: "Unique numeric identifiers of financial years to include in the export." }),
  filename: Type.Optional(NonBlankText),
});
export type FinancialYearsExportRequestDto = Type.Static<typeof FinancialYearsExportRequestDto>;
