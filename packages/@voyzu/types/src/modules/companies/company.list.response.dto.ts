import type { CompanyResponseDto } from "./company.response.dto";

export interface CompanyListResponseDto {
  items: CompanyResponseDto[];
  totalMatching: number;
}
