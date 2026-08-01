import type { AccountType, GlAccountPointerReference } from "@voyzu/core/types/modules/core";
import type { AuditMetadataDto } from "@voyzu/core/types/modules/core";

export interface TaxControlAccountResponseDto {
  code: string;
  ledger: "TAX";
  name: string;
  description: string;
  requiredAccountType: AccountType | null;
  glAccountId: number;
  glAccount: {
    code: string;
    name: string;
    accountType: AccountType;
  };
  status: "ACTIVE" | "INACTIVE" | null;
  hasPostings: boolean;
  companiesWithPostings: string[];
  linkedBy: GlAccountPointerReference[];
  audit: AuditMetadataDto;
}
