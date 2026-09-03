import "server-only";
import { command } from "@voyzu/capability/commands";
import Type from "typebox";
import {
  AdjustmentRequestDto,
  IssueRequestDto,
  ReceiptRequestDto,
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
export const listInventoryStock = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number()]),
    result: Type.Array(StockPositionDto),
  },
  () => load().then((m) => m.listStockPositions),
);
export const listInventoryStockActivity = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number()]),
    result: Type.Array(StockActivityDto),
  },
  () => load().then((m) => m.listStockActivity),
);
export const getInventoryStockOptions = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number()]),
    result: Type.Object({
      items: Type.Array(StockOptionDto),
      warehouses: Type.Array(StockOptionDto),
    }),
  },
  () => load().then((m) => m.getStockOptions),
);
export const receiveInventoryStock = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), ReceiptRequestDto]),
    result: Type.Number(),
  },
  () => load().then((m) => m.receiveStock),
);
export const issueInventoryStock = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), IssueRequestDto]),
    result: Type.Number(),
  },
  () => load().then((m) => m.issueStock),
);
export const transferInventoryStock = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), TransferRequestDto]),
    result: Type.Number(),
  },
  () => load().then((m) => m.transferStock),
);
export const reserveInventoryStock = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), ReservationRequestDto]),
    result: Type.Undefined(),
  },
  () => load().then((m) => m.reserveStock),
);
export const adjustInventoryStock = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), AdjustmentRequestDto]),
    result: Type.Number(),
  },
  () => load().then((m) => m.adjustStock),
);
export const listInventoryStockCounts = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number()]),
    result: Type.Array(StockCountRowDto),
  },
  () => load().then((m) => m.listStockCounts),
);
export const getInventoryStockCount = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Number()]),
    result: Type.Union([StockCountDetailDto, Type.Null()]),
  },
  () => load().then((m) => m.getStockCount),
);
export const createInventoryStockCount = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), StockCountRequestDto]),
    result: StockCountDetailDto,
  },
  () => load().then((m) => m.createStockCount),
);
export const saveInventoryStockCount = command.defineLazy(
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
export const completeInventoryStockCount = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Number()]),
    result: StockCountDetailDto,
  },
  () => load().then((m) => m.completeStockCount),
);
export const deleteInventoryStockCount = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Number()]),
    result: Type.Undefined(),
  },
  () => load().then((m) => m.deleteStockCount),
);
export const commands = {
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
