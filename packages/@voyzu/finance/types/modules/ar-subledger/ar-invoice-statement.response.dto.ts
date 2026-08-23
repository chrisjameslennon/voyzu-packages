import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { CompanyResponseDto } from "@voyzu/erp-core/types/modules/companies/company.response.dto";
import { ArInvoiceDetailedInvoiceDto } from "../financial-document-types/ar-invoice.response.dto";
import { BusinessCode, IsoDate, NonBlankText } from "@voyzu/finance/types/constraints";

export const ArInvoiceStatementTransactionDto = StrictObject({
  code: BusinessCode,
  journalCode: BusinessCode,
  postingDate: IsoDate,
  documentDate: IsoDate,
  documentTypeCode: BusinessCode,
  documentTypeLabel: Type.String(),
  documentId: Type.String(),
  documentRef: Type.String(),
  memo: Type.Union([Type.String(), Type.Null()]),
  amount: Type.Number(),
});
export type ArInvoiceStatementTransactionDto = Type.Static<typeof ArInvoiceStatementTransactionDto>;

export const ArInvoiceStatementResponseDto = StrictObject({
  company: CompanyResponseDto,
  invoiceEntryCode: BusinessCode,
  invoice: ArInvoiceDetailedInvoiceDto,
  counterpartyCode: BusinessCode,
  counterpartyName: NonBlankText,
  invoiceAmount: Type.Number(),
  appliedAmount: Type.Number(),
  openBalance: Type.Number(),
  transactions: Type.Array(ArInvoiceStatementTransactionDto),
});
export type ArInvoiceStatementResponseDto = Type.Static<typeof ArInvoiceStatementResponseDto>;
