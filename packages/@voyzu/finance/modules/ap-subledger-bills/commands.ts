import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { ApLedgerEntryDocumentReportResponseDto, ApSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/ap-subledger";



export const getApLedgerEntryDocumentReport = platformCommand.defineLazy(
  { parameters: Type.Tuple([OrganizationResponseDto, ApSubledgerEntryResponseDto]), result: Type.Union([ApLedgerEntryDocumentReportResponseDto, Type.Null()]) },
  () => import("./server/lib/ap-bill-report.service").then((module) => module.getApLedgerEntryDocumentReport),
);

export const commands = {
  getApLedgerEntryDocumentReport,
} as const;
