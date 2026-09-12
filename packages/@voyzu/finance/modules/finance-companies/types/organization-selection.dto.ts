import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { PositiveId } from "../../common/types/constraints";
import { OrganizationResponseDto } from "./organization.response.dto";

// Finance's filtered selection API owns its wire schema.

export const OrganizationSelectionResponseDto = StrictObject({
  organizations: Type.Array(OrganizationResponseDto),
  selectedOrganization: Type.Union([OrganizationResponseDto, Type.Null()]),
  selectedOrganizationId: Type.Union([PositiveId, Type.Null()]),
});
export type OrganizationSelectionResponseDto = Type.Static<typeof OrganizationSelectionResponseDto>;

export const OrganizationSelectionUpdateResponseDto = StrictObject({
  selectedOrganizationId: PositiveId,
});
export type OrganizationSelectionUpdateResponseDto = Type.Static<typeof OrganizationSelectionUpdateResponseDto>;

export const OrganizationSelectionUpdateRequestDto = StrictObject({
  organizationId: PositiveId,
});
export type OrganizationSelectionUpdateRequestDto = Type.Static<typeof OrganizationSelectionUpdateRequestDto>;
