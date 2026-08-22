import Type from "typebox";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "@voyzu/core/types/modules/finance-companies";
import { CompanySelectionResponseDto, CompanySelectionUpdateResponseDto } from "@voyzu/erp-core/types/modules/company-switcher";
import { CompanySelectionUpdateRequestDto } from "@voyzu/erp-core/company-switcher/types";
import {
  handleActivate,
  handleGet,
  handleGetFinanceCompanySelection,
  handleList,
  handleSetFinanceCompanySelection,
  handleUpdate,
} from "./server/api/finance-company.http.handlers";

const codePath = { code: { description: "ERP company business code.", schema: Type.String() } };

export const apiDefinitions = {
  companySelection: {
    method: "GET", path: "/finance/company-selection", handler: handleGetFinanceCompanySelection,
    summary: "Get selected Finance company", description: "Lists Finance-enabled companies accessible to the current user and resolves the selected company.", tags: ["Finance Companies"],
    responses: {
      "200": { description: "Finance company selection.", body: CompanySelectionResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  setCompanySelection: {
    method: "PUT", path: "/finance/company-selection", handler: handleSetFinanceCompanySelection,
    request: { contentType: "application/json", body: CompanySelectionUpdateRequestDto },
    summary: "Select Finance company", description: "Selects an accessible Finance-enabled company.", tags: ["Finance Companies"],
    responses: {
      "200": { description: "Selected Finance company.", body: CompanySelectionUpdateResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Finance company not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  list: {
    method: "GET", path: "/finance/companies", handler: handleList,
    summary: "List Finance companies", description: "Lists ERP companies with their Finance activation state and financial settings.", tags: ["Finance Companies"],
    responses: {
      "200": { description: "ERP companies with their Finance activation state.", body: Type.Array(FinanceCompanyResponseDto) },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  get: {
    method: "GET", path: "/finance/companies/[code]", handler: handleGet,
    request: { path: codePath }, summary: "Get Finance company", description: "Gets an ERP company and its Finance activation state and settings.", tags: ["Finance Companies"],
    responses: {
      "200": { description: "Finance company details.", body: FinanceCompanyResponseDto },
      "404": { description: "Company not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  activate: {
    method: "POST", path: "/finance/companies/[code]/activate", handler: handleActivate,
    request: { path: codePath }, summary: "Enable an ERP company for Finance", description: "Creates the Finance company aggregate from its country settings and creates its fiscal calendar.", tags: ["Finance Companies"],
    responses: {
      "200": { description: "Activated Finance company.", body: FinanceCompanyResponseDto },
      "400": { description: "Company cannot be enabled.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Company not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  update: {
    method: "PUT", path: "/finance/companies/[code]", handler: handleUpdate,
    request: { path: codePath, contentType: "application/json", body: FinanceCompanyUpdateRequestDto },
    summary: "Update Finance company settings", description: "Updates Finance-owned tax, report and standard-setting fields; ERP identity remains read-only.", tags: ["Finance Companies"],
    responses: {
      "200": { description: "Updated Finance company.", body: FinanceCompanyResponseDto },
      "400": { description: "Validation or business rule failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Company not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
} as const;
