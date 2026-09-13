import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { OrganizationFinanceSchema } from "@voyzu/types/business-objects/organization-finance";
import { OrganizationResponseDto } from "./organization.response.dto";

export const FinanceCompanyResponseDto = StrictObject({
  ...OrganizationResponseDto.properties,
  ...Type.Omit(OrganizationFinanceSchema, ["organization_id"]).properties,
});
export type FinanceCompanyResponseDto = Type.Static<typeof FinanceCompanyResponseDto>;
