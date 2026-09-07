import Type from "typebox";
import { OrganizationMasterData } from "./organization";
// Canonical finance exchange shape, faithful to the current Finance company DTO.
export const OrganizationFinanceMasterData = Type.Object({
  ...OrganizationMasterData.properties,
  financeCompanyId: Type.Union([OrganizationMasterData.properties.id, Type.Null()]),
  financeEnabled: Type.Boolean(),
  taxFilingAnchorMonth: Type.Integer({ minimum: 1, maximum: 12 }),
  taxFilingIntervalMonths: Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3), Type.Literal(6), Type.Literal(12)]),
  reportLine1: Type.Optional(Type.String({ maxLength: 80 })),
  reportLine2: Type.Optional(Type.String({ maxLength: 80 })),
  reportFooter: Type.Optional(Type.String({ maxLength: 80 })),
  hasPostings: Type.Boolean(),
}, { additionalProperties: false });
export type OrganizationFinanceMasterData = Type.Static<typeof OrganizationFinanceMasterData>;
