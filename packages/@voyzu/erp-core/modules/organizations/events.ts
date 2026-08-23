import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";

export const events = {
  organizationDeleted: {
    description: "An organization was deleted.",
    payload: OrganizationResponseDto,
  },
  organizationUpdated: {
    description: "An organization was updated.",
    payload: OrganizationResponseDto,
  },
} as const;
