import Type from "typebox";
import { OrganizationMasterData } from "../master-data/organization";
export const organizationFinanceCapability = {
  createFinancialEntity: {
    input: Type.Object({ organizationId: OrganizationMasterData.properties.id }, { additionalProperties: false }),
    output: Type.Object({ financialEntityId: OrganizationMasterData.properties.id }, { additionalProperties: false }),
    transactional: true,
  },
} as const;
