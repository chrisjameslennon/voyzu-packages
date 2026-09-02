import "server-only";
import { operation } from "@voyzu/capability/operations";
import Type from "typebox";
import { OperationalItemDto } from "./types/operational-item.types";
import { ItemCategoryChangeRequestDto, ItemCategoryOptionDto, ItemCodeListRequestDto, ItemCreateRequestDto, ItemDeletionImpactDto, ItemListRowDto, ItemPatchRequestDto, ItemResponseDto, ItemSkuReservationDto } from "./types/item.types";

const loadService = () => import("./server/lib/item.service");
export const listInventoryItems = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.Optional(Type.String())]), result: Type.Array(ItemListRowDto) }, () => loadService().then((module) => module.listItems));
export const listInventoryItemCategories = operation.defineLazy({ parameters: Type.Tuple([Type.Number()]), result: Type.Array(ItemCategoryOptionDto) }, () => loadService().then((module) => module.listItemCategories));
export const reserveInventoryItemSku = operation.defineLazy({ parameters: Type.Tuple([]), result: ItemSkuReservationDto }, () => loadService().then((module) => module.reserveItemSku));
export const getInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ItemResponseDto, Type.Null()]) }, () => loadService().then((module) => module.getItem));
export const createInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCreateRequestDto]), result: ItemResponseDto }, () => loadService().then((module) => module.createItem));
export const patchInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String(), ItemPatchRequestDto]), result: ItemResponseDto }, () => loadService().then((module) => module.patchItem));
export const deleteInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Undefined() }, () => loadService().then((module) => module.deleteItem));
export const activateInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: ItemResponseDto }, () => loadService().then((module) => module.activateItem));
export const deactivateInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: ItemResponseDto }, () => loadService().then((module) => module.deactivateItem));
export const activateInventoryItems = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Array(ItemResponseDto) }, () => loadService().then((module) => module.activateItems));
export const deactivateInventoryItems = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Array(ItemResponseDto) }, () => loadService().then((module) => module.deactivateItems));
export const changeInventoryItemsCategory = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCategoryChangeRequestDto.properties.skus, ItemCategoryChangeRequestDto.properties.categoryId]), result: Type.Array(ItemResponseDto) }, () => loadService().then((module) => module.changeItemsCategory));
export const deleteInventoryItems = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Undefined() }, () => loadService().then((module) => module.deleteItems));
export const getInventoryItemDeletionImpact = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Array(ItemDeletionImpactDto) }, () => loadService().then((module) => module.getItemDeletionImpact));
export const getOperationalInventoryItems = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.Array(Type.String())]), result: Type.Array(OperationalItemDto) }, () => loadService().then((module) => module.getOperationalItems));

export const operations = { listInventoryItems, listInventoryItemCategories, reserveInventoryItemSku, getInventoryItem, createInventoryItem, patchInventoryItem,
  deleteInventoryItem, activateInventoryItem, deactivateInventoryItem, activateInventoryItems, deactivateInventoryItems, changeInventoryItemsCategory, deleteInventoryItems, getInventoryItemDeletionImpact,
  getOperationalInventoryItems } as const;
