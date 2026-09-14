import Type from "typebox";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "./types/index";
import { OrganizationSelectionResponseDto, OrganizationSelectionUpdateResponseDto } from "./types/organization-selection.dto";
import { OrganizationSelectionUpdateRequestDto } from "./types/organization-selection.dto";

const codePath = { code: { description: "ERP company business code.", schema: Type.String() } };

export const httpApiRoutes = {
  "ledger.organization-finance.companySelection": {
    description: "Lists Finance-enabled companies accessible to the current user and resolves the selected company.",
    method: "GET", path: "/ledger/company-selection", loadHandler: () => import("./server/http-api/finance-company.http.handlers").then((module) => module.handleGetFinanceCompanySelection),
    summary: "Get selected Finance company",  
    responses: {
      "200": { description: "Finance company selection.", body: OrganizationSelectionResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  "ledger.organization-finance.setOrganizationSelection": {
    description: "Selects an accessible Finance-enabled company.",
    method: "PUT", path: "/ledger/company-selection", loadHandler: () => import("./server/http-api/finance-company.http.handlers").then((module) => module.handleSetFinanceCompanySelection),
    request: { contentType: "application/json", body: OrganizationSelectionUpdateRequestDto },
    summary: "Select Finance company",  
    responses: {
      "200": { description: "Selected Finance company.", body: OrganizationSelectionUpdateResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Finance company not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  "ledger.organization-finance.update": {
    description: "Updates Finance-owned tax, report and standard-setting fields; ERP identity remains read-only.",
    method: "PUT", path: "/ledger/companies/[code]", loadHandler: () => import("./server/http-api/finance-company.http.handlers").then((module) => module.handleUpdate),
    request: { path: codePath, contentType: "application/json", body: FinanceCompanyUpdateRequestDto },
    summary: "Update Finance company settings",  
    responses: {
      "200": { description: "Updated Finance company.", body: FinanceCompanyResponseDto },
      "400": { description: "Validation or business rule failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Company not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
} as const;
