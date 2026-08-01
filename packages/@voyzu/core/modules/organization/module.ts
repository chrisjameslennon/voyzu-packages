import { handleGetOrganization, handleUpdateOrganization } from "@voyzu/core/organization/server";
import { dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { OrganizationPage } from "@voyzu/core/organization/server";

export const organizationModule = {
  pageRoutes: {
    detail: {
          id: "voyzu.organization.page.detail",
          pageTitle: "Organization",
          helpPath: "modules-help/organization-financial-settings/organization",
          path: "/organization",
          Page: OrganizationPage,
          breadcrumbBase: [],
          auth: { required: true, minRole: "ORGANIZATION_USER" }
        }
  },
  apiDefinitions: {
    get: {
      method: "GET",
      path: "/organization",
      handler: (request: any) => handleGetOrganization(request),
      apiDoc: {
        summary: "Get",
        description: "Get",
        tags: ["Organization"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("OrganizationResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }
        }
      },
    },
    update: {
      method: "PUT",
      path: "/organization",
      handler: (request: any) => handleUpdateOrganization(request),
      apiDoc: {
        summary: "Update",
        description: "Update",
        tags: ["Organization"],
        requestBody: { required: true, schema: dtoRef("OrganizationUpdateRequestDto") },
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("OrganizationResponseDto") }, "400": { description: "Invalid request body.", schema: dtoRef("InputValidationErrorResponseDto") }, "404": { description: "Organization was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
          "422": { description: "Code cannot be changed if the organization has postings.", schema: dtoRef("BusinessRuleErrorResponseDto") }
        }
      },
    },
  }
} as const satisfies VoyzuPackageModuleDefinition;
