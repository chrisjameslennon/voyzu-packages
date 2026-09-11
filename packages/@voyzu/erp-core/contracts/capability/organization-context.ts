import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { OrganizationMasterData } from "../master-data/organization";

const id = OrganizationMasterData.properties.id;
/** Request-scoped organization selection. Cookie representation remains provider-private. */
export const organizationContextCapability = {
  getSavedOrganizationId: {
    input: StrictObject({}),
    output: StrictObject({ organizationId: Type.Union([id, Type.Null()]) }),
  },
  getAvailableOrganizations: {
    input: StrictObject({}),
    output: StrictObject({ organizations: Type.Array(OrganizationMasterData) }),
  },
  getActiveOrganization: {
    input: StrictObject({}),
    output: StrictObject({ selectedOrganization: Type.Union([OrganizationMasterData, Type.Null()]) }),
  },
  setActiveOrganization: {
    input: StrictObject({ organizationId: id }),
    output: StrictObject({ selectedOrganizationId: id }),
  },
} as const;
