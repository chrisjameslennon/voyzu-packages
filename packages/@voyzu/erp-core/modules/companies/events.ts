import { CompanyResponseDto } from "@voyzu/erp-core/types/modules/companies";

export const events = {
  companyDeleted: {
    description: "A company was deleted.",
    payload: CompanyResponseDto,
  },
  companyUpdated: {
    description: "A company was updated.",
    payload: CompanyResponseDto,
  },
} as const;
