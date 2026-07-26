import { financeUiDomain } from "./finance.ui-domain";
import { organizationUiDomain } from "./organization.ui-domain";

const coreUiDomains = [
  organizationUiDomain,
  financeUiDomain,
] as const;

export default coreUiDomains;
