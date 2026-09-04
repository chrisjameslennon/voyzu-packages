import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { PositiveId } from "../../constraints";

export const FinanceCompanyResponseDto = StrictObject({
  ...OrganizationResponseDto.properties,
  financeCompanyId: Type.Union([PositiveId, Type.Null()]),
  financeEnabled: Type.Boolean(),
  taxFilingAnchorMonth: Type.Integer({ minimum: 1, maximum: 12 }),
  taxFilingIntervalMonths: Type.Union([
    Type.Literal(1), Type.Literal(2), Type.Literal(3), Type.Literal(6), Type.Literal(12),
  ]),
  reportLine1: Type.Optional(Type.String({ maxLength: 80 })),
  reportLine2: Type.Optional(Type.String({ maxLength: 80 })),
  reportFooter: Type.Optional(Type.String({ maxLength: 80 })),
  hasPostings: Type.Boolean(),
});
export type FinanceCompanyResponseDto = Type.Static<typeof FinanceCompanyResponseDto>;
