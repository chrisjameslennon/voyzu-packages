import type { AccountType, GlAccountPointerReference } from "@voyzu/types/modules/core";
import type { AuditMetadataDto } from "@voyzu/types/modules/core";

export interface InventoryControlAccountSettingResponseDto {
  code: string;
  ledger: "INVENTORY";
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
