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

const load = () => import("./server/http-api/financial-activity.http.handlers");
const errors = {
  "404": { description: "Financial activity was not found", body: EntityNotFoundErrorResponseDto },
  "422": { description: "Business rule blocked the request", body: BusinessRuleErrorResponseDto },
  "500": { description: "Unexpected error", body: InternalServerErrorResponseDto },
} as const;
export const httpApiRoutes = {
  "inventory.financial-activity.list": {
    method: "GET",
    path: "/inventory/financial-activity",
    loadHandler: () => load().then((module) => module.handleList),
    summary: "List inventory financial activity",
    
    
    responses: { "200": { description: "Financial activity", body: Type.Array(FinancialActivitySummaryDto) }, ...errors },
  },
  "inventory.financial-activity.get": {
    method: "GET",
    path: "/inventory/financial-activity/[id]",
    loadHandler: () => load().then((module) => module.handleGet),
    summary: "Get inventory financial activity",
    
    
    request: { path: { id: { schema: Type.String({ pattern: "^[1-9][0-9]*$" }) } } },
    responses: { "200": { description: "Financial activity", body: FinancialActivityDetailDto }, ...errors },
  },
} as const;
