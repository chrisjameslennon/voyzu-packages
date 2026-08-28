import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { ItemPostingProfileBatchPatchRequestDto, ItemPostingProfileBatchUpdateRequestDto, ItemPostingProfileCreateRequestDto, ItemPostingProfilePatchRequestDto, ItemPostingProfileResponseDto, ItemPostingProfileUpdateRequestDto } from "@voyzu/finance/types/modules/inventory-item-posting-profiles";
import { Filter, ListOptions } from "@voyzu/types/params";



export const listItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(ItemPostingProfileResponseDto) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.listItemPostingProfiles),
);
export const filterItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(ItemPostingProfileResponseDto) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.filterItemPostingProfiles),
);
export const searchItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(ItemPostingProfileResponseDto) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.searchItemPostingProfiles),
);
export const getItemPostingProfile = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([ItemPostingProfileResponseDto, Type.Null()]) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.getItemPostingProfile),
);
export const createItemPostingProfile = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([ItemPostingProfileCreateRequestDto]), Type.Tuple([ItemPostingProfileCreateRequestDto, Type.Number()])]), result: ItemPostingProfileResponseDto },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.createItemPostingProfile),
);
export const updateItemPostingProfile = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), ItemPostingProfileUpdateRequestDto]), Type.Tuple([Type.String(), ItemPostingProfileUpdateRequestDto, Type.Number()])]), result: ItemPostingProfileResponseDto },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.updateItemPostingProfile),
);
export const patchItemPostingProfile = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), ItemPostingProfilePatchRequestDto]), Type.Tuple([Type.String(), ItemPostingProfilePatchRequestDto, Type.Number()])]), result: ItemPostingProfileResponseDto },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.patchItemPostingProfile),
);
export const deleteItemPostingProfile = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.deleteItemPostingProfile),
);
export const batchGetItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(ItemPostingProfileResponseDto) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.batchGetItemPostingProfiles),
);
export const batchCreateItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(ItemPostingProfileCreateRequestDto)]), Type.Tuple([Type.Array(ItemPostingProfileCreateRequestDto), Type.Number()])]), result: Type.Array(ItemPostingProfileResponseDto) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.batchCreateItemPostingProfiles),
);
export const batchUpdateItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(ItemPostingProfileBatchUpdateRequestDto)]), Type.Tuple([Type.Array(ItemPostingProfileBatchUpdateRequestDto), Type.Number()])]), result: Type.Array(ItemPostingProfileResponseDto) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.batchUpdateItemPostingProfiles),
);
export const batchPatchItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(ItemPostingProfileBatchPatchRequestDto)]), Type.Tuple([Type.Array(ItemPostingProfileBatchPatchRequestDto), Type.Number()])]), result: Type.Array(ItemPostingProfileResponseDto) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.batchPatchItemPostingProfiles),
);
export const batchDeleteItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.batchDeleteItemPostingProfiles),
);
export const activateItemPostingProfile = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: ItemPostingProfileResponseDto },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.activateItemPostingProfile),
);
export const deactivateItemPostingProfile = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: ItemPostingProfileResponseDto },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.deactivateItemPostingProfile),
);
export const activateItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(ItemPostingProfileResponseDto) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.activateItemPostingProfiles),
);
export const deactivateItemPostingProfiles = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(ItemPostingProfileResponseDto) },
  () => import("../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service").then((module) => module.deactivateItemPostingProfiles),
);

export const operations = {
  listItemPostingProfilesOrganizationInventoryItemPostingProfiles: listItemPostingProfiles,
  filterItemPostingProfilesOrganizationInventoryItemPostingProfiles: filterItemPostingProfiles,
  searchItemPostingProfilesOrganizationInventoryItemPostingProfiles: searchItemPostingProfiles,
  getItemPostingProfileOrganizationInventoryItemPostingProfiles: getItemPostingProfile,
  createItemPostingProfileOrganizationInventoryItemPostingProfiles: createItemPostingProfile,
  updateItemPostingProfileOrganizationInventoryItemPostingProfiles: updateItemPostingProfile,
  patchItemPostingProfileOrganizationInventoryItemPostingProfiles: patchItemPostingProfile,
  deleteItemPostingProfileOrganizationInventoryItemPostingProfiles: deleteItemPostingProfile,
  batchGetItemPostingProfilesOrganizationInventoryItemPostingProfiles: batchGetItemPostingProfiles,
  batchCreateItemPostingProfilesOrganizationInventoryItemPostingProfiles: batchCreateItemPostingProfiles,
  batchUpdateItemPostingProfilesOrganizationInventoryItemPostingProfiles: batchUpdateItemPostingProfiles,
  batchPatchItemPostingProfilesOrganizationInventoryItemPostingProfiles: batchPatchItemPostingProfiles,
  batchDeleteItemPostingProfilesOrganizationInventoryItemPostingProfiles: batchDeleteItemPostingProfiles,
  activateItemPostingProfileOrganizationInventoryItemPostingProfiles: activateItemPostingProfile,
  deactivateItemPostingProfileOrganizationInventoryItemPostingProfiles: deactivateItemPostingProfile,
  activateItemPostingProfilesOrganizationInventoryItemPostingProfiles: activateItemPostingProfiles,
  deactivateItemPostingProfilesOrganizationInventoryItemPostingProfiles: deactivateItemPostingProfiles,
} as const;
