export interface FinancialYearsExportRequestDto {
  /** Unique numeric identifier of the company to export financial years for. */
  companyId: number;

  /** Unique numeric identifiers of financial years to include in the export. */
  yearIds: number[];

  /** Download filename without extension. */
  filename: string;
}
