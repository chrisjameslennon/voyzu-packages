import "server-only";
import { operation } from "@voyzu/capability/operations";
import Type from "typebox";
import {
  AdjustmentRequestDto,
  MovementRequestDto,
  ReservationRequestDto,
  StockActivityDto,
  StockCountDetailDto,
  StockCountRequestDto,
  StockCountRowDto,
  StockOptionDto,
  StockPositionDto,
  TransferRequestDto,
} from "./types/stock.types";
const load = () => import("./server/lib/stock.service");
export const listInventoryStock = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number()]),
    result: Type.Array(StockPositionDto),
  },
  () => load().then((m) => m.listStockPositions),
);
export const listInventoryStockActivity = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number()]),
    result: Type.Array(StockActivityDto),
  },
  () => load().then((m) => m.listStockActivity),
);
export const getInventoryStockOptions = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number()]),
    result: Type.Object({
      items: Type.Array(StockOptionDto),
      warehouses: Type.Array(StockOptionDto),
    }),
  },
  () => load().then((m) => m.getStockOptions),
);
export const receiveInventoryStock = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), MovementRequestDto]),
    result: Type.Number(),
  },
  () => load().then((m) => m.receiveStock),
);
export const issueInventoryStock = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), MovementRequestDto]),
    result: Type.Number(),
  },
  () => load().then((m) => m.issueStock),
);
export const transferInventoryStock = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), TransferRequestDto]),
    result: Type.Number(),
  },
  () => load().then((m) => m.transferStock),
);
export const reserveInventoryStock = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), ReservationRequestDto]),
    result: Type.Undefined(),
  },
  () => load().then((m) => m.reserveStock),
);
export const adjustInventoryStock = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), AdjustmentRequestDto]),
    result: Type.Number(),
  },
  () => load().then((m) => m.adjustStock),
);
export const listInventoryStockCounts = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number()]),
    result: Type.Array(StockCountRowDto),
  },
  () => load().then((m) => m.listStockCounts),
);
export const getInventoryStockCount = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Number()]),
    result: Type.Union([StockCountDetailDto, Type.Null()]),
  },
  () => load().then((m) => m.getStockCount),
);
export const createInventoryStockCount = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), StockCountRequestDto]),
    result: StockCountDetailDto,
  },
  () => load().then((m) => m.createStockCount),
);
export const saveInventoryStockCount = operation.defineLazy(
  {
    parameters: Type.Tuple([
      Type.Number(),
      Type.Number(),
      StockCountRequestDto,
      Type.Union([Type.Literal("DRAFT"), Type.Literal("IN_PROGRESS")]),
    ]),
    result: StockCountDetailDto,
  },
  () => load().then((m) => m.saveStockCount),
);
export const completeInventoryStockCount = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Number()]),
    result: StockCountDetailDto,
  },
  () => load().then((m) => m.completeStockCount),
);
export const deleteInventoryStockCount = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Number()]),
    result: Type.Undefined(),
  },
  () => load().then((m) => m.deleteStockCount),
);
export const operations = {
  listInventoryStock,
  listInventoryStockActivity,
  getInventoryStockOptions,
  receiveInventoryStock,
  issueInventoryStock,
  transferInventoryStock,
  reserveInventoryStock,
  adjustInventoryStock,
  listInventoryStockCounts,
  getInventoryStockCount,
  createInventoryStockCount,
  saveInventoryStockCount,
  completeInventoryStockCount,
  deleteInventoryStockCount,
} as const;
