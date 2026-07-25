import { arrayOf, dtoRef } from "@voyzu/types/api";

import {
  handleBatchCreate,
  handleBatchActivate,
  handleBatchDeactivate,
  handleBatchDelete,
  handleBatchGet,
  handleBatchPatch,
  handleBatchUpdate,
  handleActivate,
  handleCreate,
  handleDeactivate,
  handleDelete,
  handleFilter,
  handleGet,
  handleList,
  handlePatch,
  handleSearch,
  handleUpdate,
} from "./server/api/company.http.handlers";

export const companiesModule = {
  id: "voyzu.companies",
  name: "Companies",
  pageRoutes: {
    list: {
      id: "voyzu.companies.page.list",
      pageTitle: "Companies",
      helpUrl: "modules-help/organization-financial-settings/company",
      apiDocsUrl: "companies",
    },
    detail: {
      id: "voyzu.companies.page.detail",
      pageTitle: "Company",
      helpUrl: "modules-help/organization-financial-settings/company",
      apiDocsUrl: "companies",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/companies",
      handler: handleList,
      apiDoc: {
        summary: "List companies",
        description: "Returns all companies in the system.",
        tags: ["Companies"],
        responses: {
          "200": { description: "A list of all companies.", schema: arrayOf(dtoRef("CompanyResponseDto")) },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    create: {
      method: "POST",
      path: "/organization/companies",
      handler: handleCreate,
      apiDoc: {
        summary: "Create company",
        description: "Creates a new company record. Status defaults to ACTIVE and cannot be supplied in the request body.",
        tags: ["Companies"],
        requestBody: {
          required: true,
          schema: dtoRef("CompanyCreateRequestDto"),
        },
        responses: {
          "201": { description: "The created company.", schema: dtoRef("CompanyResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "A company with this code already exists.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    filter: {
      method: "POST",
      path: "/organization/companies/filter",
      handler: handleFilter,
      apiDoc: {
        summary: "Filter companies",
        description: "Returns companies matching the supplied filter criteria.",
        tags: ["Companies"],
        requestBody: {
          required: true,
          schema: dtoRef("FilterRequestDto"),
        },
        responses: {
          "200": { description: "A filtered list of companies.", schema: arrayOf(dtoRef("CompanyResponseDto")) },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    search: {
      method: "GET",
      path: "/organization/companies/search",
      handler: handleSearch,
      apiDoc: {
        summary: "Search companies",
        description: "Full-text search across companies using the query string parameter.",
        tags: ["Companies"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match company records.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": { description: "Companies matching the search query.", schema: arrayOf(dtoRef("CompanyResponseDto")) },
          "400": { description: "Query parameter q is missing or invalid.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    batchCreate: {
      method: "POST",
      path: "/organization/companies/batch/create",
      handler: handleBatchCreate,
      apiDoc: {
        summary: "Batch create companies",
        description:
          "Creates multiple company records in a single request. Executed as a single database transaction; if any item fails, all changes are rolled back.",
        tags: ["Companies"],
        requestBody: {
          required: true,
          schema: arrayOf(dtoRef("CompanyCreateRequestDto")),
        },
        responses: {
          "201": { description: "The created companies.", schema: arrayOf(dtoRef("CompanyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "One or more codes already exist.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    batchGet: {
      method: "POST",
      path: "/organization/companies/batch/get",
      handler: handleBatchGet,
      apiDoc: {
        summary: "Batch get companies",
        description: "Retrieves multiple companies by a list of business codes.",
        tags: ["Companies"],
        requestBody: {
          required: true,
          schema: dtoRef("CompanyCodesRequestDto"),
        },
        responses: {
          "200": { description: "The requested companies.", schema: arrayOf(dtoRef("CompanyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    batchUpdate: {
      method: "PUT",
      path: "/organization/companies/batch/update",
      handler: handleBatchUpdate,
      apiDoc: {
        summary: "Batch update companies",
        description:
          "Fully replaces multiple company records in a single request. Executed as a single database transaction; if any item fails, all changes are rolled back.",
        tags: ["Companies"],
        requestBody: {
          required: true,
          schema: arrayOf(dtoRef("CompanyBatchUpdateRequestDto")),
        },
        responses: {
          "200": { description: "The updated companies.", schema: arrayOf(dtoRef("CompanyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more companies not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "One or more target codes already exist.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    batchPatch: {
      method: "PATCH",
      path: "/organization/companies/batch/patch",
      handler: handleBatchPatch,
      apiDoc: {
        summary: "Batch patch companies",
        description:
          "Partially updates multiple company records in a single request. Executed as a single database transaction; if any item fails, all changes are rolled back.",
        tags: ["Companies"],
        requestBody: {
          required: true,
          schema: arrayOf(dtoRef("CompanyBatchPatchRequestDto")),
        },
        responses: {
          "200": { description: "The patched companies.", schema: arrayOf(dtoRef("CompanyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more companies not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "One or more target codes already exist.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    batchDelete: {
      method: "POST",
      path: "/organization/companies/batch/delete",
      handler: handleBatchDelete,
      apiDoc: {
        summary: "Batch delete companies",
        description: "Permanently deletes multiple companies and all company-owned financial records by their business codes.",
        tags: ["Companies"],
        requestBody: {
          required: true,
          schema: dtoRef("CompanyCodesRequestDto"),
        },
        responses: {
          "204": { description: "Companies deleted successfully." },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more companies not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    batchActivate: {
      method: "POST",
      path: "/organization/companies/batch/activate",
      handler: handleBatchActivate,
      apiDoc: {
        summary: "Batch activate companies",
        description: "Sets multiple companies to ACTIVE.",
        tags: ["Companies"],
        requestBody: {
          required: true,
          schema: dtoRef("CompanyCodesRequestDto"),
        },
        responses: {
          "200": { description: "The activated companies.", schema: arrayOf(dtoRef("CompanyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more companies not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/organization/companies/batch/deactivate",
      handler: handleBatchDeactivate,
      apiDoc: {
        summary: "Batch deactivate companies",
        description: "Sets multiple companies to INACTIVE.",
        tags: ["Companies"],
        requestBody: {
          required: true,
          schema: dtoRef("CompanyCodesRequestDto"),
        },
        responses: {
          "200": { description: "The deactivated companies.", schema: arrayOf(dtoRef("CompanyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more companies not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    activate: {
      method: "POST",
      path: "/organization/companies/[code]/activate",
      handler: handleActivate,
      apiDoc: {
        summary: "Activate company",
        description: "Sets a company to ACTIVE.",
        tags: ["Companies"],
        requestPathParams: {
          code: {
            description: "Company business code.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": { description: "The activated company.", schema: dtoRef("CompanyResponseDto") },
          "404": { description: "Company not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    deactivate: {
      method: "POST",
      path: "/organization/companies/[code]/deactivate",
      handler: handleDeactivate,
      apiDoc: {
        summary: "Deactivate company",
        description: "Sets a company to INACTIVE.",
        tags: ["Companies"],
        requestPathParams: {
          code: {
            description: "Company business code.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": { description: "The deactivated company.", schema: dtoRef("CompanyResponseDto") },
          "404": { description: "Company not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    get: {
      method: "GET",
      path: "/organization/companies/[code]",
      handler: handleGet,
      apiDoc: {
        summary: "Get company",
        description: "Retrieves a single company by its business code.",
        tags: ["Companies"],
        requestPathParams: {
          code: {
            description: "Company business code.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": { description: "The requested company.", schema: dtoRef("CompanyResponseDto") },
          "404": { description: "Company not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    update: {
      method: "PUT",
      path: "/organization/companies/[code]",
      handler: handleUpdate,
      apiDoc: {
        summary: "Update company",
        description: "Fully replaces a company record with the supplied data.",
        tags: ["Companies"],
        requestPathParams: {
          code: {
            description: "Company business code.",
            schema: { type: "string" },
          },
        },
        requestBody: {
          required: true,
          schema: dtoRef("CompanyUpdateRequestDto"),
        },
        responses: {
          "200": { description: "The updated company.", schema: dtoRef("CompanyResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Company not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "A company with the target code already exists.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/organization/companies/[code]",
      handler: handlePatch,
      apiDoc: {
        summary: "Patch company",
        description: "Partially updates a company record. Only the fields provided are changed.",
        tags: ["Companies"],
        requestPathParams: {
          code: {
            description: "Company business code.",
            schema: { type: "string" },
          },
        },
        requestBody: {
          required: true,
          schema: dtoRef("CompanyPatchRequestDto"),
        },
        responses: {
          "200": { description: "The patched company.", schema: dtoRef("CompanyResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Company not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "A company with the target code already exists.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/organization/companies/[code]",
      handler: handleDelete,
      apiDoc: {
        summary: "Delete company",
        description: "Permanently deletes a company and all company-owned financial records by its business code.",
        tags: ["Companies"],
        requestPathParams: {
          code: {
            description: "Company business code.",
            schema: { type: "string" },
          },
        },
        responses: {
          "204": { description: "Company deleted successfully." },
          "404": { description: "Company not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
  },
} as const;
