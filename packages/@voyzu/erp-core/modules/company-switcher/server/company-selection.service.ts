import type { CompanyResponseDto } from "@voyzu/erp-core/types/modules/companies";
import type { UserResponseDto } from "@voyzu/auth/types";
import { listCompanies } from "@voyzu/erp-core/companies/server";
import { getCurrentUser } from "@voyzu/auth/users/server";
import { listCompanyIdsForUser } from "@voyzu/erp-core/company-access/server";

function hasUiAccess(user: UserResponseDto | null): user is UserResponseDto {
  return user?.status === "ACTIVE" && (user.accessMode === "UI" || user.accessMode === "UI_AND_API");
}

export function filterSelectableCompanies(
  companies: CompanyResponseDto[],
  user: UserResponseDto | null,
  assignedCompanyIds: readonly number[] = [],
): CompanyResponseDto[] {
  return filterAccessibleCompanies(companies, user, assignedCompanyIds).filter((company) => company.status === "ACTIVE");
}

export function filterAccessibleCompanies(
  companies: CompanyResponseDto[],
  user: UserResponseDto | null,
  assignedCompanyIds: readonly number[] = [],
): CompanyResponseDto[] {
  if (!hasUiAccess(user)) return [];

  const accessibleCompanies = companies.filter(
    (company) => company.status === "ACTIVE" || company.status === "INACTIVE",
  );
  if (user.role === "ADMIN") return accessibleCompanies;

  const assignedIds = new Set(assignedCompanyIds);
  return accessibleCompanies.filter((company) => assignedIds.has(company.id));
}

export function resolveCompanySelection(
  companies: CompanyResponseDto[],
  user: UserResponseDto | null,
  requestedCompanyId: number | null,
  assignedCompanyIds: readonly number[] = [],
) {
  const accessibleCompanies = filterAccessibleCompanies(companies, user, assignedCompanyIds);
  const selectableCompanies = accessibleCompanies.filter((company) => company.status === "ACTIVE");
  const selectedCompany = accessibleCompanies.find((company) => company.id === requestedCompanyId)
    ?? selectableCompanies[0]
    ?? null;

  return { companies: selectableCompanies, selectedCompany };
}

async function listSelectableCompaniesForCurrentUserUnchecked(): Promise<CompanyResponseDto[]> {
  const [companies, user] = await Promise.all([listCompanies(), getCurrentUser()]);
  const companyIds = user?.role === "STANDARD" ? await listCompanyIdsForUser(user.id) : [];
  return filterSelectableCompanies(companies, user, companyIds);
}

async function listAccessibleCompaniesForCurrentUserUnchecked(): Promise<CompanyResponseDto[]> {
  const [companies, user] = await Promise.all([listCompanies(), getCurrentUser()]);
  const companyIds = user?.role === "STANDARD" ? await listCompanyIdsForUser(user.id) : [];
  return filterAccessibleCompanies(companies, user, companyIds);
}

async function resolveCompanySelectionForCurrentUserUnchecked(requestedCompanyId: number | null) {
  const [companies, user] = await Promise.all([listCompanies(), getCurrentUser()]);
  const companyIds = user?.role === "STANDARD" ? await listCompanyIdsForUser(user.id) : [];
  return resolveCompanySelection(companies, user, requestedCompanyId, companyIds);
}

export const listSelectableCompaniesForCurrentUser = listSelectableCompaniesForCurrentUserUnchecked;
export const listAccessibleCompaniesForCurrentUser = listAccessibleCompaniesForCurrentUserUnchecked;
export const resolveCompanySelectionForCurrentUser = resolveCompanySelectionForCurrentUserUnchecked;
