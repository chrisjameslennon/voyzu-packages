import { currentUserCanManageUsers, getUser, listUsers } from "@voyzu/auth/users/server";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError, NotFoundError } from "@voyzu/capability/errors";
import type {
  CompanyAccessPage,
  CompanyAccessUser,
} from "@voyzu/erp-core/types/modules/company-access";

import { listCompanies } from "@voyzu/erp-core/companies/server";
import { CompanyAccessRepo } from "../db/company-access.repo";

async function requireAdmin(): Promise<void> {
  if (!(await currentUserCanManageUsers())) {
    throw new BusinessRuleError("Only admin users can manage company access");
  }
}

export async function listCompanyAccess(): Promise<CompanyAccessPage> {
  await requireAdmin();
  const [users, companies, companyIdsByUser] = await Promise.all([
    listUsers(),
    listCompanies(),
    new CompanyAccessRepo(getDb()).listCompanyIdsByUser(),
  ]);

  return {
    users: users.map((user) => ({
        userId: user.id,
        userCode: user.code,
        displayName: user.displayName,
        userRole: user.role,
        userStatus: user.status,
        companyIds: user.role === "ADMIN"
          ? companies.map((company) => company.id)
          : companyIdsByUser.get(user.id) ?? [],
      })),
    companies: companies.map((company) => ({
      id: company.id,
      code: company.code,
      name: company.name,
      status: company.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
    })),
  };
}

export async function replaceUserCompanyAccess(
  userCode: string,
  companyIds: number[],
): Promise<CompanyAccessUser> {
  await requireAdmin();
  const normalizedCode = userCode.trim().toUpperCase();
  const user = await getUser(normalizedCode);
  if (!user) throw new NotFoundError(`User ${normalizedCode} not found`);
  if (user.role !== "STANDARD") {
    throw new BusinessRuleError("Company access can only be assigned to standard users");
  }

  const normalizedCompanyIds = [...new Set(companyIds)];
  return withTransaction(async (db) => {
    const repo = new CompanyAccessRepo(db);
    const existingCompanyIds = await repo.existingCompanyIds(normalizedCompanyIds);
    const missing = normalizedCompanyIds.filter((companyId) => !existingCompanyIds.has(companyId));
    if (missing.length > 0) {
      throw new InputValidationError(`Company ${missing.join(", ")} not found`);
    }
    await repo.replace(user.id, normalizedCompanyIds);
    return {
      userId: user.id,
      userCode: user.code,
      displayName: user.displayName,
      userRole: user.role,
      userStatus: user.status,
      companyIds: normalizedCompanyIds,
    };
  });
}

export function listCompanyIdsForUser(userId: number): Promise<number[]> {
  return new CompanyAccessRepo(getDb()).listCompanyIdsForUser(userId);
}
