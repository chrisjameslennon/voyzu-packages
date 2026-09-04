import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "@voyzu/finance/types/modules/finance-companies";

const FinanceCompanySelectionResponseDto = Type.Object({
  organizations: Type.Array(OrganizationResponseDto),
  selectedOrganization: Type.Union([OrganizationResponseDto, Type.Null()]),
}, { additionalProperties: false });

export const activateFinanceCompany = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: FinanceCompanyResponseDto },
  () => import("./server/lib/finance-company.service").then((module) => module.activateFinanceCompany),
);
export const updateFinanceCompany = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String(), FinanceCompanyUpdateRequestDto]), result: FinanceCompanyResponseDto },
  () => import("./server/lib/finance-company.service").then((module) => module.updateFinanceCompany),
);
export const listSelectableFinanceCompaniesForCurrentUser = platformCommand.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(OrganizationResponseDto) },
  () => import("./server/lib/finance-company.service").then((module) => module.listSelectableFinanceCompaniesForCurrentUser),
);
export const resolveFinanceCompanySelectionForCurrentUser = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Union([Type.Number(), Type.Null()])]), result: FinanceCompanySelectionResponseDto },
  () => import("./server/lib/finance-company.service").then((module) => module.resolveFinanceCompanySelectionForCurrentUser),
);
export const deleteFinanceCompanyForErpOrganization = platformCommand.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Any()]),
    result: Type.Undefined(),
  },
  () => import("./server/lib/finance-company.service").then((module) => module.deleteFinanceCompanyForErpOrganization),
);
const erpOrganizationLifecycleCommand = (serviceName:
  | "createFinanceCompanyForErpOrganization"
  | "activateFinanceCompanyForErpOrganization"
  | "deactivateFinanceCompanyForErpOrganization"
) => platformCommand.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Any()]),
    result: Type.Undefined(),
  },
  () => import("./server/lib/finance-company.service").then((module) => module[serviceName]),
);

export const createFinanceCompanyForErpOrganization = erpOrganizationLifecycleCommand(
  "createFinanceCompanyForErpOrganization",
);
export const activateFinanceCompanyForErpOrganization = erpOrganizationLifecycleCommand(
  "activateFinanceCompanyForErpOrganization",
);
export const deactivateFinanceCompanyForErpOrganization = erpOrganizationLifecycleCommand(
  "deactivateFinanceCompanyForErpOrganization",
);

export const commands = {
  activateFinanceCompany,
  updateFinanceCompany,
  listSelectableFinanceCompaniesForCurrentUser,
  resolveFinanceCompanySelectionForCurrentUser,
  createFinanceCompanyForErpOrganization,
  activateFinanceCompanyForErpOrganization,
  deactivateFinanceCompanyForErpOrganization,
  deleteFinanceCompanyForErpOrganization,
} as const;
