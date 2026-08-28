import "server-only";
import { operation } from "@voyzu/capability/operations";
import Type from "typebox";
import { FinanceItemDto, ItemPostingCodeUsageDto } from "./types/finance-item.types";
import { ItemCategoryOptionDto, ItemCodeListRequestDto, ItemCreateRequestDto, ItemListRowDto, ItemPatchRequestDto, ItemResponseDto } from "./types/item.types";

const loadService = () => import("./server/lib/item.service");
export const listInventoryItems = operation.defineLazy({ parameters: Type.Tuple([Type.Number()]), result: Type.Array(ItemListRowDto) }, () => loadService().then((module) => module.listItems));
export const listInventoryItemCategories = operation.defineLazy({ parameters: Type.Tuple([Type.Number()]), result: Type.Array(ItemCategoryOptionDto) }, () => loadService().then((module) => module.listItemCategories));
export const generateInventoryItemSku = operation.defineLazy({ parameters: Type.Tuple([Type.Number()]), result: Type.String() }, () => loadService().then((module) => module.generateItemSku));
export const getInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ItemResponseDto, Type.Null()]) }, () => loadService().then((module) => module.getItem));
export const createInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCreateRequestDto]), result: ItemResponseDto }, () => loadService().then((module) => module.createItem));
export const patchInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String(), ItemPatchRequestDto]), result: ItemResponseDto }, () => loadService().then((module) => module.patchItem));
export const deleteInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Undefined() }, () => loadService().then((module) => module.deleteItem));
export const activateInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: ItemResponseDto }, () => loadService().then((module) => module.activateItem));
export const deactivateInventoryItem = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.String()]), result: ItemResponseDto }, () => loadService().then((module) => module.deactivateItem));
export const activateInventoryItems = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Array(ItemResponseDto) }, () => loadService().then((module) => module.activateItems));
export const deactivateInventoryItems = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Array(ItemResponseDto) }, () => loadService().then((module) => module.deactivateItems));
export const deleteInventoryItems = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), ItemCodeListRequestDto.properties.skus]), result: Type.Undefined() }, () => loadService().then((module) => module.deleteItems));
export const getItemsForFinance = operation.defineLazy({ parameters: Type.Tuple([Type.Number(), Type.Array(Type.String())]), result: Type.Array(FinanceItemDto) }, () => loadService().then((module) => module.getItemsForFinance));
export const getItemPostingCodeUsages = operation.defineLazy({ parameters: Type.Tuple([Type.Array(Type.Number())]), result: Type.Array(ItemPostingCodeUsageDto) }, () => loadService().then((module) => module.getItemPostingCodeUsages));

export const operations = { listInventoryItems, listInventoryItemCategories, generateInventoryItemSku, getInventoryItem, createInventoryItem, patchInventoryItem,
  deleteInventoryItem, activateInventoryItem, deactivateInventoryItem, activateInventoryItems, deactivateInventoryItems, deleteInventoryItems,
  getItemsForFinance, getItemPostingCodeUsages } as const;
