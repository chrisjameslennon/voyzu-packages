import Type from "typebox";
import {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types";
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
const load = () => import("./server/http-api/stock.http.handlers");
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
const id = { id: { schema: Type.String({ pattern: "^[1-9][0-9]*$" }) } };
export const httpApiRoutes = {
  "inventory.stock.positions": {
    description: "Lists derived on-hand, reserved, and available positions by item and warehouse.",
    method: "GET",
    path: "/inventory/stock",
    loadHandler: () => load().then((m) => m.handlePositions),
    summary: "List stock positions",
    
    
    responses: {
      "200": {
        description: "Stock positions",
        body: Type.Array(StockPositionDto),
      },
      ...errors,
    },
  },
  "inventory.stock.activity": {
    description: "Lists stock movements and reservation activity for the active organization.",
    method: "GET",
    path: "/inventory/stock/activity",
    loadHandler: () => load().then((m) => m.handleActivity),
    summary: "List stock activity",
    
    
    responses: {
      "200": {
        description: "Stock activity",
        body: Type.Array(StockActivityDto),
      },
      ...errors,
    },
  },
  "inventory.stock.options": {
    description: "Returns active quantity-tracked items and warehouses, including warehouse status, for stock workflows.",
    method: "GET",
    path: "/inventory/stock/options",
    loadHandler: () => load().then((m) => m.handleOptions),
    summary: "Get stock operation options",
    
    
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
  "inventory.stock.receive": {
    description: "Records positive inventory ledger movements for stock received into a warehouse.",
    method: "POST",
    path: "/inventory/stock/receive",
    loadHandler: () => load().then((m) => m.handleReceive),
    summary: "Receive stock",
    
    
    request: { contentType: "application/json", body: ReceiptRequestDto },
    responses: {
      "201": { description: "Transaction id", body: Type.Number() },
      ...errors,
    },
  },
  "inventory.stock.issue": {
    description: "Records inventory ledger movements for stock issued from a warehouse.",
    method: "POST",
    path: "/inventory/stock/issue",
    loadHandler: () => load().then((m) => m.handleIssue),
    summary: "Issue stock",
    
    
    request: { contentType: "application/json", body: IssueRequestDto },
    responses: {
      "201": { description: "Transaction id", body: Type.Number() },
      ...errors,
    },
  },
  "inventory.stock.transfer": {
    description: "Records paired negative and positive ledger movements between warehouses.",
    method: "POST",
    path: "/inventory/stock/transfer",
    loadHandler: () => load().then((m) => m.handleTransfer),
    summary: "Transfer stock",
    
    
    request: { contentType: "application/json", body: TransferRequestDto },
    responses: {
      "201": { description: "Transaction id", body: Type.Number() },
      ...errors,
    },
  },
  "inventory.stock.reserve": {
    description: "Creates active reservations against available stock without moving physical quantity.",
    method: "POST",
    path: "/inventory/stock/reserve",
    loadHandler: () => load().then((m) => m.handleReserve),
    summary: "Reserve stock",
    
    
    request: { contentType: "application/json", body: ReservationRequestDto },
    responses: { "204": { description: "Stock reserved" }, ...errors },
  },
  "inventory.stock.adjust": {
    description: "Records exceptional inventory quantity adjustments in the stock ledger.",
    method: "POST",
    path: "/inventory/stock/adjust",
    loadHandler: () => load().then((m) => m.handleAdjust),
    summary: "Adjust stock quantity",
    
    
    request: { contentType: "application/json", body: AdjustmentRequestDto },
    responses: {
      "201": { description: "Transaction id", body: Type.Number() },
      ...errors,
    },
  },
  "inventory.stock.counts": {
    description: "Lists physical stocktake records and their adjustment counts.",
    method: "GET",
    path: "/inventory/stock-counts",
    loadHandler: () => load().then((m) => m.handleCounts),
    summary: "List stocktakes",
    
    
    responses: {
      "200": { description: "Stocktakes", body: Type.Array(StockCountRowDto) },
      ...errors,
    },
  },
  "inventory.stock.createCount": {
    description: "Creates a draft stocktake from current quantities for an active warehouse.",
    method: "POST",
    path: "/inventory/stock-counts",
    loadHandler: () => load().then((m) => m.handleCreateCount),
    summary: "Create stocktake",
    
    
    request: { contentType: "application/json", body: StockCountRequestDto },
    responses: {
      "201": { description: "Stocktake", body: StockCountDetailDto },
      ...errors,
    },
  },
  "inventory.stock.count": {
    description: "Gets a stocktake with expected, counted, and variance quantities and audit metadata.",
    method: "GET",
    path: "/inventory/stock-counts/[id]",
    loadHandler: () => load().then((m) => m.handleCount),
    summary: "Get stocktake",
    
    
    request: { path: id },
    responses: {
      "200": { description: "Stocktake", body: StockCountDetailDto },
      ...errors,
    },
  },
  "inventory.stock.saveCount": {
    description: "Saves draft or in-progress counted quantities for a stocktake.",
    method: "PATCH",
    path: "/inventory/stock-counts/[id]",
    loadHandler: () => load().then((m) => m.handleSaveCount),
    summary: "Save stocktake",
    
    
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
  "inventory.stock.completeCount": {
    description: "Completes a stocktake and posts ledger adjustments for non-zero variances.",
    method: "POST",
    path: "/inventory/stock-counts/[id]/complete",
    loadHandler: () => load().then((m) => m.handleCompleteCount),
    summary: "Complete stocktake",
    
    
    request: { path: id },
    responses: {
      "200": { description: "Completed stocktake", body: StockCountDetailDto },
      ...errors,
    },
  },
  "inventory.stock.deleteCount": {
    description: "Deletes a draft or in-progress stocktake; completed stocktakes are retained.",
    method: "DELETE",
    path: "/inventory/stock-counts/[id]",
    loadHandler: () => load().then((m) => m.handleDeleteCount),
    summary: "Delete stocktake",
    
    
    request: { path: id },
    responses: { "204": { description: "Deleted" }, ...errors },
  },
} as const;
