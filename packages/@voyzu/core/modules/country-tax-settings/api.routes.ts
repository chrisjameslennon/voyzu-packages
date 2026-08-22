import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { CountryTaxSettingResponseDto } from "@voyzu/core/types/modules/country-tax-settings";
import { handleGet, handleList } from "./server/api/country-tax-setting.http.handlers";

export const apiDefinitions = {
  list: {
    method: "GET", path: "/finance/country-tax-settings", handler: handleList,
    summary: "List country tax settings", description: "Lists Finance tax configuration for active countries.", tags: ["Country Tax Settings"],
    responses: {
      "200": { description: "Active country tax settings.", body: Type.Array(CountryTaxSettingResponseDto) },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  get: {
    method: "GET", path: "/finance/country-tax-settings/[code]", handler: handleGet,
    request: { path: { code: { description: "ISO country code.", schema: Type.String() } } },
    summary: "Get country tax settings", description: "Gets Finance filing and tax configuration for an active country.", tags: ["Country Tax Settings"],
    responses: {
      "200": { description: "Country tax settings.", body: CountryTaxSettingResponseDto },
      "404": { description: "Country not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
} as const;
