import type { AuditMetadataDto, DrCr, EntryType } from "@voyzu/types/modules/core";
export interface TaxSubledgerEntryLineResponseDto {
  lineNumber: number;
  taxRuleCode: string;
  taxControlAccountCode: string;
  taxControlAccountName: string | null;
  taxAuthorityCode: string;
  taxAuthorityName: string;
  schemeLabel: string | null;
  taxRate: number | null;
  taxableBaseCurrencyAmount: number;
  drCr: DrCr;
  baseCurrencyAmount: number;
}

export interface TaxSubledgerEntryResponseDto {
  id: number;
  code: string;
  journalHeaderId: number;
  journalCode: string;
  hasBankCashDetails: boolean;
  arSubledgerEntryCode: string | null;
  apSubledgerEntryCode: string | null;
  postingDate: string;
  documentDate: string;
  baseCurrencyCode: string;
  entryType: EntryType;
  baseCurrencyAmount: number;
  status: string;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  description: string;
  taxRuleCode: string;
  taxControlAccountCode: string | null;
  taxControlAccountName: string | null;
  taxAuthorityCode: string;
  taxAuthorityName: string;
  schemeLabel: string | null;
  taxRate: number | null;
  taxLines: TaxSubledgerEntryLineResponseDto[];
  audit: AuditMetadataDto;
  documentSnapshot?: Record<string, unknown>;
  detailedDocumentSnapshot?: Record<string, unknown>;
}
