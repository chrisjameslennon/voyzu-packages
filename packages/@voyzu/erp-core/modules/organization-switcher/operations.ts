import "server-only";

import { operation } from "@voyzu/capability/operations";
import { UserResponseDto } from "@voyzu/auth/types";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import Type from "typebox";

const OrganizationList = Type.Array(OrganizationResponseDto);
const UserOrNull = Type.Union([UserResponseDto, Type.Null()]);
const OrganizationIds = Type.Array(Type.Integer({ minimum: 1 }));
const NullableId = Type.Union([Type.Integer({ minimum: 1 }), Type.Null()]);
const Selection = Type.Object({
  organizations: OrganizationList,
  selectedOrganization: Type.Union([OrganizationResponseDto, Type.Null()]),
});
const organizationFilterParameters = Type.Union([
  Type.Tuple([OrganizationList, UserOrNull]),
  Type.Tuple([OrganizationList, UserOrNull, OrganizationIds]),
]);
const selectionParameters = Type.Union([
  Type.Tuple([OrganizationList, UserOrNull, NullableId]),
  Type.Tuple([OrganizationList, UserOrNull, NullableId, OrganizationIds]),
]);
const loadService = () => import("./server/organization-selection.service");

export const filterSelectableOrganizations = operation.defineLazy(
  { parameters: organizationFilterParameters, result: OrganizationList },
  () => loadService().then((module) => module.filterSelectableOrganizations),
);
export const filterAccessibleOrganizations = operation.defineLazy(
  { parameters: organizationFilterParameters, result: OrganizationList },
  () => loadService().then((module) => module.filterAccessibleOrganizations),
);
export const resolveOrganizationSelection = operation.defineLazy(
  { parameters: selectionParameters, result: Selection },
  () => loadService().then((module) => module.resolveOrganizationSelection),
);
export const listSelectableOrganizationsForCurrentUser = operation.defineLazy(
  { parameters: Type.Tuple([]), result: OrganizationList },
  () => loadService().then((module) => module.listSelectableOrganizationsForCurrentUser),
);
export const listAccessibleOrganizationsForCurrentUser = operation.defineLazy(
  { parameters: Type.Tuple([]), result: OrganizationList },
  () => loadService().then((module) => module.listAccessibleOrganizationsForCurrentUser),
);
export const resolveOrganizationSelectionForCurrentUser = operation.defineLazy(
  { parameters: Type.Tuple([NullableId]), result: Selection },
  () => loadService().then((module) => module.resolveOrganizationSelectionForCurrentUser),
);

export const operations = {
  filterSelectableOrganizations, filterAccessibleOrganizations, resolveOrganizationSelection,
  listSelectableOrganizationsForCurrentUser, listAccessibleOrganizationsForCurrentUser,
  resolveOrganizationSelectionForCurrentUser,
} as const;
