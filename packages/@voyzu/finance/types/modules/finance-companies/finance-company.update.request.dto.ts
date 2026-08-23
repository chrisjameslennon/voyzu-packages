import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";

export const FinanceCompanyUpdateRequestDto = StrictObject({
  taxFilingAnchorMonth: Type.Integer({ minimum: 1, maximum: 12 }),
  taxFilingIntervalMonths: Type.Union([
    Type.Literal(1), Type.Literal(2), Type.Literal(3), Type.Literal(6), Type.Literal(12),
  ]),
  useFinanceTemplateSettings: Type.Boolean(),
  reportLine1: Type.Optional(Type.String({ maxLength: 80 })),
  reportLine2: Type.Optional(Type.String({ maxLength: 80 })),
  reportFooter: Type.Optional(Type.String({ maxLength: 80 })),
});
export type FinanceCompanyUpdateRequestDto = Type.Static<typeof FinanceCompanyUpdateRequestDto>;
