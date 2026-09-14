import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { CountryTaxSettingResponseDto } from "./types/index";

export const httpApiRoutes = {
  "finance.country-tax-settings.list": {
    description: "Lists Finance tax configuration for active countries.",
    method: "GET", path: "/finance/country-tax-settings", loadHandler: () => import("./server/http-api/country-tax-setting.http.handlers").then((module) => module.handleList),
    summary: "List country tax settings",  
    responses: {
      "200": { description: "Active country tax settings.", body: Type.Array(CountryTaxSettingResponseDto) },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  "finance.country-tax-settings.get": {
    description: "Gets Finance filing and tax configuration for an active country.",
    method: "GET", path: "/finance/country-tax-settings/[code]", loadHandler: () => import("./server/http-api/country-tax-setting.http.handlers").then((module) => module.handleGet),
    request: { path: { code: { description: "ISO country code.", schema: Type.String() } } },
    summary: "Get country tax settings",  
    responses: {
      "200": { description: "Country tax settings.", body: CountryTaxSettingResponseDto },
      "404": { description: "Country not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
} as const;
