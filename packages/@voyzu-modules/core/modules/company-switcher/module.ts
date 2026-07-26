import {
  handleAccessArchivedCompany,
  handleGetCompanySelection,
  handleSetCompanySelection,
} from "@voyzu-modules/core/company-switcher/server";
import { dtoRef } from "@voyzu/types/api";

export const companySwitcherModule = {
  id: "voyzu.companySwitcher",
  name: "Company Switcher",
  apiDefinitions: {
    getSelection: {
      method: "GET",
      path: "/company-selection",
      handler: (request: any) => handleGetCompanySelection(request),
      apiDoc: {
        summary: "Get Selection",
        description: "Get Selection Company Switcher.",
        tags: ["Company Switcher"],
        requestCookies: {
          voyzuSelectedCompanyId: {
            description: "Selected company cookie used to resolve the current company selection.",
            example: "10001",
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAgeSeconds: 31536000,
          },
        },
        responses: { "200": { description: "Current company selection and selectable companies.", schema: dtoRef("CompanySelectionResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    setSelection: {
      method: "PUT",
      path: "/company-selection",
      handler: (request: any) => handleSetCompanySelection(request),
      apiDoc: {
        summary: "Set Selection",
        description: "Set Selection Company Switcher.",
        tags: ["Company Switcher"],
        requestBody: { required: true, schema: dtoRef("CompanySelectionUpdateRequestDto") },
        responses: {
          "200": {
            description: "The selected company id.",
            schema: dtoRef("CompanySelectionUpdateResponseDto"),
            cookies: {
              voyzuSelectedCompanyId: {
                description: "Selected company cookie used by company-scoped UI requests.",
                action: "set",
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAgeSeconds: 31536000,
              },
            },
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    accessArchivedSelection: {
      method: "POST",
      path: "/company-selection/archived",
      handler: (request: any) => handleAccessArchivedCompany(request),
      apiDoc: {
        summary: "Access Archived Company",
        description: "Select an accessible archived company without adding it to the active company switcher.",
        tags: ["Company Switcher"],
        requestBody: { required: true, schema: dtoRef("CompanySelectionUpdateRequestDto") },
        responses: {
          "200": {
            description: "The selected archived company id.",
            schema: dtoRef("CompanySelectionUpdateResponseDto"),
            cookies: {
              voyzuSelectedCompanyId: {
                description: "Selected company cookie used by company-scoped UI requests.",
                action: "set",
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAgeSeconds: 31536000,
              },
            },
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
  }
} as const;
