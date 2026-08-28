import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "@voyzu/finance/types/modules/finance-companies";

const FinanceCompanySelectionResponseDto = Type.Object({
  organizations: Type.Array(OrganizationResponseDto),
  selectedOrganization: Type.Union([OrganizationResponseDto, Type.Null()]),
}, { additionalProperties: false });

export const listFinanceCompanies = platformOperation.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(FinanceCompanyResponseDto) },
  () => import("./server/lib/finance-company.service").then((module) => module.listFinanceCompanies),
);
export const getFinanceCompany = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([FinanceCompanyResponseDto, Type.Null()]) },
  () => import("./server/lib/finance-company.service").then((module) => module.getFinanceCompany),
);
export const activateFinanceCompany = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: FinanceCompanyResponseDto },
  () => import("./server/lib/finance-company.service").then((module) => module.activateFinanceCompany),
);
export const updateFinanceCompany = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String(), FinanceCompanyUpdateRequestDto]), result: FinanceCompanyResponseDto },
  () => import("./server/lib/finance-company.service").then((module) => module.updateFinanceCompany),
);
export const listSelectableFinanceCompaniesForCurrentUser = platformOperation.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(OrganizationResponseDto) },
  () => import("./server/lib/finance-company.service").then((module) => module.listSelectableFinanceCompaniesForCurrentUser),
);
export const resolveFinanceCompanySelectionForCurrentUser = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Union([Type.Number(), Type.Null()])]), result: FinanceCompanySelectionResponseDto },
  () => import("./server/lib/finance-company.service").then((module) => module.resolveFinanceCompanySelectionForCurrentUser),
);
export const deleteFinanceCompanyForErpOrganization = platformOperation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Any()]),
    result: Type.Undefined(),
  },
  () => import("./server/lib/finance-company.service").then((module) => module.deleteFinanceCompanyForErpOrganization),
);

export const operations = {
  listFinanceCompanies,
  getFinanceCompany,
  activateFinanceCompany,
  updateFinanceCompany,
  listSelectableFinanceCompaniesForCurrentUser,
  resolveFinanceCompanySelectionForCurrentUser,
  deleteFinanceCompanyForErpOrganization,
} as const;
