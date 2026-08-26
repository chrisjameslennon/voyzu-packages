import "server-only";

import { operation } from "@voyzu/capability/operations";
import {
  IceCreamBatchPatchRequestDto,
  IceCreamBatchUpdateRequestDto,
  IceCreamCreateRequestDto,
  IceCreamFlavorResponseDto,
  IceCreamPatchRequestDto,
  IceCreamResponseDto,
  IceCreamUpdateRequestDto,
} from "@voyzu/ice-creams/types";
import { Filter, ListOptions } from "@voyzu/types";
import Type, { type TSchema } from "typebox";

const IceCreamList = Type.Array(IceCreamResponseDto);
const IceCreamFlavorList = Type.Array(IceCreamFlavorResponseDto);
const Codes = Type.Array(Type.String());
const optionalListOptions = (first: TSchema) =>
  Type.Union([Type.Tuple([first]), Type.Tuple([first, ListOptions])]);
const noParametersOrListOptions = Type.Union([
  Type.Tuple([]),
  Type.Tuple([ListOptions]),
]);
const loadService = () => import("./server/lib/ice-cream.service");

export const listIceCreamFlavors = operation.defineLazy(
  { parameters: Type.Tuple([]), result: IceCreamFlavorList },
  () => loadService().then((module) => module.listIceCreamFlavors),
);
export const createIceCream = operation.defineLazy(
  { parameters: Type.Tuple([IceCreamCreateRequestDto]), result: IceCreamResponseDto },
  () => loadService().then((module) => module.createIceCream),
);
export const getIceCream = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.String()]),
    result: Type.Union([IceCreamResponseDto, Type.Null()]),
  },
  () => loadService().then((module) => module.getIceCream),
);
export const listIceCreams = operation.defineLazy(
  { parameters: noParametersOrListOptions, result: IceCreamList },
  () => loadService().then((module) => module.listIceCreams),
);
export const filterIceCreams = operation.defineLazy(
  { parameters: optionalListOptions(Type.Array(Filter)), result: IceCreamList },
  () => loadService().then((module) => module.filterIceCreams),
);
export const searchIceCreams = operation.defineLazy(
  { parameters: optionalListOptions(Type.String()), result: IceCreamList },
  () => loadService().then((module) => module.searchIceCreams),
);
export const updateIceCream = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.String(), IceCreamUpdateRequestDto]),
    result: IceCreamResponseDto,
  },
  () => loadService().then((module) => module.updateIceCream),
);
export const patchIceCream = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.String(), IceCreamPatchRequestDto]),
    result: IceCreamResponseDto,
  },
  () => loadService().then((module) => module.patchIceCream),
);
export const batchCreateIceCreams = operation.defineLazy(
  { parameters: Type.Tuple([Type.Array(IceCreamCreateRequestDto)]), result: IceCreamList },
  () => loadService().then((module) => module.batchCreateIceCreams),
);
export const batchGetIceCreams = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: IceCreamList },
  () => loadService().then((module) => module.batchGetIceCreams),
);
export const batchUpdateIceCreams = operation.defineLazy(
  { parameters: Type.Tuple([Type.Array(IceCreamBatchUpdateRequestDto)]), result: IceCreamList },
  () => loadService().then((module) => module.batchUpdateIceCreams),
);
export const batchPatchIceCreams = operation.defineLazy(
  { parameters: Type.Tuple([Type.Array(IceCreamBatchPatchRequestDto)]), result: IceCreamList },
  () => loadService().then((module) => module.batchPatchIceCreams),
);
export const deleteIceCream = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => loadService().then((module) => module.deleteIceCream),
);
export const batchDeleteIceCreams = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: Type.Undefined() },
  () => loadService().then((module) => module.batchDeleteIceCreams),
);
export const activateIceCream = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: IceCreamResponseDto },
  () => loadService().then((module) => module.activateIceCream),
);
export const deactivateIceCream = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: IceCreamResponseDto },
  () => loadService().then((module) => module.deactivateIceCream),
);
export const activateIceCreams = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: IceCreamList },
  () => loadService().then((module) => module.activateIceCreams),
);
export const deactivateIceCreams = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: IceCreamList },
  () => loadService().then((module) => module.deactivateIceCreams),
);

export const operations = {
  listIceCreamFlavors,
  createIceCream,
  getIceCream,
  listIceCreams,
  filterIceCreams,
  searchIceCreams,
  updateIceCream,
  patchIceCream,
  batchCreateIceCreams,
  batchGetIceCreams,
  batchUpdateIceCreams,
  batchPatchIceCreams,
  deleteIceCream,
  batchDeleteIceCreams,
  activateIceCream,
  deactivateIceCream,
  activateIceCreams,
  deactivateIceCreams,
} as const;
