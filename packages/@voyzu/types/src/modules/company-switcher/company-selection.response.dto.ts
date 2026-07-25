import type { CompanyResponseDto } from "../companies";

export interface CompanySelectionResponseDto {
  /** Companies the current user can select in the application. */
  companies: CompanyResponseDto[];
  /** The current company context, including an explicitly selected archived company. */
  selectedCompany: CompanyResponseDto | null;
  /** Unique numeric identifier of the selected company, or null when no company is selected. */
  selectedCompanyId: number | null;
}
