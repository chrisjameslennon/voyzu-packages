import "server-only";

import { CompanyAccess } from "../../client/CompanyAccess";
import { listCompanyAccess } from "../lib/company-access.service";

export async function CompanyAccessPage() {
  return <CompanyAccess initial={await listCompanyAccess()} />;
}
