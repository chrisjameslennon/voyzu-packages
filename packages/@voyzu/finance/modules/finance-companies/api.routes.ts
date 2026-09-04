import Type from "typebox";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "@voyzu/finance/types/modules/finance-companies";
import { OrganizationSelectionResponseDto, OrganizationSelectionUpdateResponseDto } from "@voyzu/erp-core/types/modules/organization-switcher";
import { OrganizationSelectionUpdateRequestDto } from "@voyzu/erp-core/organization-switcher/types";

const codePath = { code: { description: "ERP company business code.", schema: Type.String() } };

export const apiDefinitions = {
  companySelection: {
    method: "GET", path: "/finance/company-selection", loadHandler: () => import("./server/api/finance-company.http.handlers").then((module) => module.handleGetFinanceCompanySelection),
    summary: "Get selected Finance company", description: "Lists Finance-enabled companies accessible to the current user and resolves the selected company.", tags: ["Finance Companies"],
    responses: {
      "200": { description: "Finance company selection.", body: OrganizationSelectionResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  setOrganizationSelection: {
    method: "PUT", path: "/finance/company-selection", loadHandler: () => import("./server/api/finance-company.http.handlers").then((module) => module.handleSetFinanceCompanySelection),
    request: { contentType: "application/json", body: OrganizationSelectionUpdateRequestDto },
    summary: "Select Finance company", description: "Selects an accessible Finance-enabled company.", tags: ["Finance Companies"],
    responses: {
      "200": { description: "Selected Finance company.", body: OrganizationSelectionUpdateResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Finance company not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  activate: {
    method: "POST", path: "/finance/companies/[code]/activate", loadHandler: () => import("./server/api/finance-company.http.handlers").then((module) => module.handleActivate),
    request: { path: codePath }, summary: "Enable an ERP company for Finance", description: "Creates the Finance company aggregate from its country settings and creates its fiscal calendar.", tags: ["Finance Companies"],
    responses: {
      "200": { description: "Activated Finance company.", body: FinanceCompanyResponseDto },
      "400": { description: "Company cannot be enabled.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Company not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected server error.", body: InternalServerErrorResponseDto },
    },
  },
  update: {
    method: "PUT", path: "/finance/companies/[code]", loadHandler: () => import("./server/api/finance-company.http.handlers").then((module) => module.handleUpdate),
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
