import "server-only";
import { command } from "@voyzu/capability/commands";
import Type from "typebox";
import { OperationalItemDto } from "./types/operational-item.types";
import { ItemCategoryChangeRequestDto, ItemCategoryOptionDto, ItemCodeListRequestDto, ItemCreateRequestDto, ItemDeletionImpactDto, ItemListRowDto, ItemPatchRequestDto, ItemResponseDto, ItemSkuReservationDto } from "./types/item.types";

const loadService = () => import("./server/lib/item.service");
export const listInventoryItems = command.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.Optional(Type.String())]), result: Type.Array(ItemListRowDto) }, () => loadService().then((module) => module.listItems));
export const listInventoryItemCategories = command.defineLazy({ parameters: Type.Tuple([Type.Number()]), result: Type.Array(ItemCategoryOptionDto) }, () => loadService().then((module) => module.listItemCategories));
export const reserveInventoryItemSku = command.defineLazy({ parameters: Type.Tuple([]), result: ItemSkuReservationDto }, () => loadService().then((module) => module.reserveItemSku));
export const getInventoryItem = command.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ItemResponseDto, Type.Null()]) }, () => loadService().then((module) => module.getItem));
export const createInventoryItem = command.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCreateRequestDto]), result: ItemResponseDto }, () => loadService().then((module) => module.createItem));
export const patchInventoryItem = command.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String(), ItemPatchRequestDto]), result: ItemResponseDto }, () => loadService().then((module) => module.patchItem));
export const deleteInventoryItem = command.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Undefined() }, () => loadService().then((module) => module.deleteItem));
export const activateInventoryItem = command.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: ItemResponseDto }, () => loadService().then((module) => module.activateItem));
export const deactivateInventoryItem = command.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: ItemResponseDto }, () => loadService().then((module) => module.deactivateItem));
export const activateInventoryItems = command.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Array(ItemResponseDto) }, () => loadService().then((module) => module.activateItems));
export const deactivateInventoryItems = command.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Array(ItemResponseDto) }, () => loadService().then((module) => module.deactivateItems));
export const changeInventoryItemsCategory = command.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCategoryChangeRequestDto.properties.skus, ItemCategoryChangeRequestDto.properties.categoryId]), result: Type.Array(ItemResponseDto) }, () => loadService().then((module) => module.changeItemsCategory));
export const deleteInventoryItems = command.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Undefined() }, () => loadService().then((module) => module.deleteItems));
export const getInventoryItemDeletionImpact = command.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Array(ItemDeletionImpactDto) }, () => loadService().then((module) => module.getItemDeletionImpact));
export const getOperationalInventoryItems = command.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.Array(Type.String())]), result: Type.Array(OperationalItemDto) }, () => loadService().then((module) => module.getOperationalItems));

export const commands = { listInventoryItems, listInventoryItemCategories, reserveInventoryItemSku, getInventoryItem, createInventoryItem, patchInventoryItem,
  deleteInventoryItem, activateInventoryItem, deactivateInventoryItem, activateInventoryItems, deactivateInventoryItems, changeInventoryItemsCategory, deleteInventoryItems, getInventoryItemDeletionImpact,
  getOperationalInventoryItems } as const;
