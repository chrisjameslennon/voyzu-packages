import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { ApLedgerEntryDocumentReportResponseDto, ApSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/ap-subledger";



export const getApLedgerEntryDocumentReport = platformOperation.defineLazy(
  { parameters: Type.Tuple([OrganizationResponseDto, ApSubledgerEntryResponseDto]), result: Type.Union([ApLedgerEntryDocumentReportResponseDto, Type.Null()]) },
  () => import("./server/lib/ap-bill-report.service").then((module) => module.getApLedgerEntryDocumentReport),
);

export const operations = {
  getApLedgerEntryDocumentReport,
} as const;
