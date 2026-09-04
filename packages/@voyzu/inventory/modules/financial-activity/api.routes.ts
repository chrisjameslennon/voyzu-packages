import Type from "typebox";
import {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
} from "@voyzu/types";
import {
  FinancialActivityDetailDto,
  FinancialActivitySummaryDto,
} from "./types/financial-activity.types";

const load = () => import("./server/api/financial-activity.http.handlers");
const errors = {
  "404": { description: "Financial activity was not found", body: EntityNotFoundErrorResponseDto },
  "422": { description: "Business rule blocked the request", body: BusinessRuleErrorResponseDto },
  "500": { description: "Unexpected error", body: InternalServerErrorResponseDto },
} as const;
export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/inventory/financial-activity",
    loadHandler: () => load().then((module) => module.handleList),
    summary: "List inventory financial activity",
    description: "Lists financially significant inventory movement lines for consuming packages.",
    tags: ["Inventory Financial Activity"],
    responses: { "200": { description: "Financial activity", body: Type.Array(FinancialActivitySummaryDto) }, ...errors },
  },
  get: {
    method: "GET",
    path: "/inventory/financial-activity/[id]",
    loadHandler: () => load().then((module) => module.handleGet),
    summary: "Get inventory financial activity",
    description: "Gets one financial activity record and its inventory movement.",
    tags: ["Inventory Financial Activity"],
    request: { path: { id: { schema: Type.Integer({ minimum: 1 }) } } },
    responses: { "200": { description: "Financial activity", body: FinancialActivityDetailDto }, ...errors },
  },
} as const;
