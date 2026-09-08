import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { OrganizationMasterData } from "../master-data/organization";

const id = OrganizationMasterData.properties.id;
/** Request-scoped organization selection. Cookie representation remains provider-private. */
export const organizationContextCapability = {
  requested: {
    input: StrictObject({}),
    output: StrictObject({ organizationId: Type.Union([id, Type.Null()]) }),
  },
  selectable: {
    input: StrictObject({}),
    output: StrictObject({ organizations: Type.Array(OrganizationMasterData) }),
  },
  current: {
    input: StrictObject({}),
    output: StrictObject({ selectedOrganization: Type.Union([OrganizationMasterData, Type.Null()]) }),
  },
  select: {
    input: StrictObject({ organizationId: id }),
    output: StrictObject({ selectedOrganizationId: id }),
  },
} as const;
