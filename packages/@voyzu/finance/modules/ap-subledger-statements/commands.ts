import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { ApCounterpartyStatementResponseDto, ApCounterpartySummaryResponseDto } from "@voyzu/finance/types/modules/ap-subledger";



export const listApCounterpartySummaries = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ApCounterpartySummaryResponseDto) },
  () => import("./server/lib/ap-subledger-statement.service").then((module) => module.listApCounterpartySummaries),
);
export const getApCounterpartyStatement = platformCommand.defineLazy(
  { parameters: Type.Tuple([OrganizationResponseDto, Type.String()]), result: Type.Union([ApCounterpartyStatementResponseDto, Type.Null()]) },
  () => import("./server/lib/ap-subledger-statement.service").then((module) => module.getApCounterpartyStatement),
);

export const commands = {
  listApCounterpartySummaries,
  getApCounterpartyStatement,
} as const;
