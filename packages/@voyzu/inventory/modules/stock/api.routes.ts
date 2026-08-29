import Type from "typebox";
import {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types";
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
const load = () => import("./server/api/stock.http.handlers");
const errors = {
  "400": {
    description: "Validation failed",
    body: InputValidationErrorResponseDto,
  },
  "404": { description: "Not found", body: EntityNotFoundErrorResponseDto },
  "422": {
    description: "Business rule blocked operation",
    body: BusinessRuleErrorResponseDto,
  },
  "500": {
    description: "Unexpected error",
    body: InternalServerErrorResponseDto,
  },
} as const;
const id = { id: { schema: Type.Integer({ minimum: 1 }) } };
export const apiDefinitions = {
  positions: {
    method: "GET",
    path: "/inventory/stock",
    loadHandler: () => load().then((m) => m.handlePositions),
    summary: "List stock positions",
    description:
      "Lists derived on-hand, reserved, and available positions by item and warehouse.",
    tags: ["Inventory Stock"],
    responses: {
      "200": {
        description: "Stock positions",
        body: Type.Array(StockPositionDto),
      },
      ...errors,
    },
  },
  activity: {
    method: "GET",
    path: "/inventory/stock/activity",
    loadHandler: () => load().then((m) => m.handleActivity),
    summary: "List stock activity",
    description:
      "Lists stock movements and reservation activity for the active organization.",
    tags: ["Inventory Stock"],
    responses: {
      "200": {
        description: "Stock activity",
        body: Type.Array(StockActivityDto),
      },
      ...errors,
    },
  },
  options: {
    method: "GET",
    path: "/inventory/stock/options",
    loadHandler: () => load().then((m) => m.handleOptions),
    summary: "Get stock operation options",
    description:
      "Returns active quantity-tracked items and warehouses for stock workflows.",
    tags: ["Inventory Stock"],
    responses: {
      "200": {
        description: "Items and warehouses",
        body: Type.Object({
          items: Type.Array(StockOptionDto),
          warehouses: Type.Array(StockOptionDto),
        }),
      },
      ...errors,
    },
  },
  receive: {
    method: "POST",
    path: "/inventory/stock/receive",
    loadHandler: () => load().then((m) => m.handleReceive),
    summary: "Receive stock",
    description:
      "Records positive inventory ledger movements for stock received into a warehouse.",
    tags: ["Inventory Stock"],
    request: { contentType: "application/json", body: MovementRequestDto },
    responses: {
      "201": { description: "Transaction id", body: Type.Number() },
      ...errors,
    },
  },
  issue: {
    method: "POST",
    path: "/inventory/stock/issue",
    loadHandler: () => load().then((m) => m.handleIssue),
    summary: "Issue stock",
    description:
      "Records inventory ledger movements for stock issued from a warehouse.",
    tags: ["Inventory Stock"],
    request: { contentType: "application/json", body: MovementRequestDto },
    responses: {
      "201": { description: "Transaction id", body: Type.Number() },
      ...errors,
    },
  },
  transfer: {
    method: "POST",
    path: "/inventory/stock/transfer",
    loadHandler: () => load().then((m) => m.handleTransfer),
    summary: "Transfer stock",
    description:
      "Records paired negative and positive ledger movements between warehouses.",
    tags: ["Inventory Stock"],
    request: { contentType: "application/json", body: TransferRequestDto },
    responses: {
      "201": { description: "Transaction id", body: Type.Number() },
      ...errors,
    },
  },
  reserve: {
    method: "POST",
    path: "/inventory/stock/reserve",
    loadHandler: () => load().then((m) => m.handleReserve),
    summary: "Reserve stock",
    description:
      "Creates active reservations against available stock without moving physical quantity.",
    tags: ["Inventory Stock"],
    request: { contentType: "application/json", body: ReservationRequestDto },
    responses: { "204": { description: "Stock reserved" }, ...errors },
  },
  adjust: {
    method: "POST",
    path: "/inventory/stock/adjust",
    loadHandler: () => load().then((m) => m.handleAdjust),
    summary: "Adjust stock quantity",
    description:
      "Records exceptional inventory quantity adjustments in the stock ledger.",
    tags: ["Inventory Stock"],
    request: { contentType: "application/json", body: AdjustmentRequestDto },
    responses: {
      "201": { description: "Transaction id", body: Type.Number() },
      ...errors,
    },
  },
  counts: {
    method: "GET",
    path: "/inventory/stock-counts",
    loadHandler: () => load().then((m) => m.handleCounts),
    summary: "List stocktakes",
    description:
      "Lists physical stocktake records and their adjustment counts.",
    tags: ["Inventory Stock Counts"],
    responses: {
      "200": { description: "Stocktakes", body: Type.Array(StockCountRowDto) },
      ...errors,
    },
  },
  createCount: {
    method: "POST",
    path: "/inventory/stock-counts",
    loadHandler: () => load().then((m) => m.handleCreateCount),
    summary: "Create stocktake",
    description:
      "Creates a draft stocktake from current quantities for an active warehouse.",
    tags: ["Inventory Stock Counts"],
    request: { contentType: "application/json", body: StockCountRequestDto },
    responses: {
      "201": { description: "Stocktake", body: StockCountDetailDto },
      ...errors,
    },
  },
  count: {
    method: "GET",
    path: "/inventory/stock-counts/[id]",
    loadHandler: () => load().then((m) => m.handleCount),
    summary: "Get stocktake",
    description:
      "Gets a stocktake with expected, counted, and variance quantities and audit metadata.",
    tags: ["Inventory Stock Counts"],
    request: { path: id },
    responses: {
      "200": { description: "Stocktake", body: StockCountDetailDto },
      ...errors,
    },
  },
  saveCount: {
    method: "PATCH",
    path: "/inventory/stock-counts/[id]",
    loadHandler: () => load().then((m) => m.handleSaveCount),
    summary: "Save stocktake",
    description:
      "Saves draft or in-progress counted quantities for a stocktake.",
    tags: ["Inventory Stock Counts"],
    request: {
      path: id,
      contentType: "application/json",
      body: Type.Intersect([
        StockCountRequestDto,
        Type.Object({
          status: Type.Union([
            Type.Literal("DRAFT"),
            Type.Literal("IN_PROGRESS"),
          ]),
        }),
      ]),
    },
    responses: {
      "200": { description: "Stocktake", body: StockCountDetailDto },
      ...errors,
    },
  },
  completeCount: {
    method: "POST",
    path: "/inventory/stock-counts/[id]/complete",
    loadHandler: () => load().then((m) => m.handleCompleteCount),
    summary: "Complete stocktake",
    description:
      "Completes a stocktake and posts ledger adjustments for non-zero variances.",
    tags: ["Inventory Stock Counts"],
    request: { path: id },
    responses: {
      "200": { description: "Completed stocktake", body: StockCountDetailDto },
      ...errors,
    },
  },
  deleteCount: {
    method: "DELETE",
    path: "/inventory/stock-counts/[id]",
    loadHandler: () => load().then((m) => m.handleDeleteCount),
    summary: "Delete stocktake",
    description:
      "Deletes a draft or in-progress stocktake; completed stocktakes are retained.",
    tags: ["Inventory Stock Counts"],
    request: { path: id },
    responses: { "204": { description: "Deleted" }, ...errors },
  },
} as const;
