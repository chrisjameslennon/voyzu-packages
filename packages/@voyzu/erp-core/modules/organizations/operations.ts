import "server-only";

import { operation } from "@voyzu/capability/operations";
import {
  OrganizationBatchPatchRequestDto,
  OrganizationBatchUpdateRequestDto,
  OrganizationCreateRequestDto,
  OrganizationPatchRequestDto,
  OrganizationResponseDto,
  OrganizationUpdateRequestDto,
} from "@voyzu/erp-core/types/modules/organizations";
import { Filter, ListOptions } from "@voyzu/types";
import Type, { type TSchema } from "typebox";

const OrganizationList = Type.Array(OrganizationResponseDto);
const Codes = Type.Array(Type.String());
const optionalListOptions = (first: TSchema) => Type.Union([Type.Tuple([first]), Type.Tuple([first, ListOptions])]);
const noParametersOrListOptions = Type.Union([Type.Tuple([]), Type.Tuple([ListOptions])]);
const loadService = () => import("./server/lib/organization.service");

export const createOrganization = operation.defineLazy(
  { parameters: Type.Tuple([OrganizationCreateRequestDto]), result: OrganizationResponseDto },
  () => loadService().then((module) => module.createOrganization),
);
export const getOrganization = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([OrganizationResponseDto, Type.Null()]) },
  () => loadService().then((module) => module.getOrganization),
);
export const updateOrganization = operation.defineLazy(
  { parameters: Type.Tuple([Type.String(), OrganizationUpdateRequestDto]), result: OrganizationResponseDto },
  () => loadService().then((module) => module.updateOrganization),
);
export const patchOrganization = operation.defineLazy(
  { parameters: Type.Tuple([Type.String(), OrganizationPatchRequestDto]), result: OrganizationResponseDto },
  () => loadService().then((module) => module.patchOrganization),
);
export const deleteOrganization = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => loadService().then((module) => module.deleteOrganization),
);
export const listOrganizations = operation.defineLazy(
  { parameters: noParametersOrListOptions, result: OrganizationList },
  () => loadService().then((module) => module.listOrganizations),
);
export const filterOrganizations = operation.defineLazy(
  { parameters: optionalListOptions(Type.Array(Filter)), result: OrganizationList },
  () => loadService().then((module) => module.filterOrganizations),
);
export const searchOrganizations = operation.defineLazy(
  { parameters: optionalListOptions(Type.String()), result: OrganizationList },
  () => loadService().then((module) => module.searchOrganizations),
);
export const batchCreateOrganizations = operation.defineLazy(
  { parameters: Type.Tuple([Type.Array(OrganizationCreateRequestDto)]), result: OrganizationList },
  () => loadService().then((module) => module.batchCreateOrganizations),
);
export const batchGetOrganizations = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: OrganizationList },
  () => loadService().then((module) => module.batchGetOrganizations),
);
export const batchUpdateOrganizations = operation.defineLazy(
  { parameters: Type.Tuple([Type.Array(OrganizationBatchUpdateRequestDto)]), result: OrganizationList },
  () => loadService().then((module) => module.batchUpdateOrganizations),
);
export const batchPatchOrganizations = operation.defineLazy(
  { parameters: Type.Tuple([Type.Array(OrganizationBatchPatchRequestDto)]), result: OrganizationList },
  () => loadService().then((module) => module.batchPatchOrganizations),
);
export const batchDeleteOrganizations = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: Type.Undefined() },
  () => loadService().then((module) => module.batchDeleteOrganizations),
);
export const activateOrganizations = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: OrganizationList },
  () => loadService().then((module) => module.activateOrganizations),
);
export const deactivateOrganizations = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: OrganizationList },
  () => loadService().then((module) => module.deactivateOrganizations),
);
export const activateOrganization = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: OrganizationResponseDto },
  () => loadService().then((module) => module.activateOrganization),
);
export const deactivateOrganization = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: OrganizationResponseDto },
  () => loadService().then((module) => module.deactivateOrganization),
);

export const operations = {
  createOrganization, getOrganization, updateOrganization, patchOrganization, deleteOrganization,
  listOrganizations, filterOrganizations, searchOrganizations, batchCreateOrganizations,
  batchGetOrganizations, batchUpdateOrganizations, batchPatchOrganizations, batchDeleteOrganizations,
  activateOrganizations, deactivateOrganizations, activateOrganization, deactivateOrganization,
} as const;
