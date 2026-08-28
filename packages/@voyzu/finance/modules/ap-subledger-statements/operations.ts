import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { ApCounterpartyStatementResponseDto, ApCounterpartySummaryResponseDto } from "@voyzu/finance/types/modules/ap-subledger";



export const listApCounterpartySummaries = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ApCounterpartySummaryResponseDto) },
  () => import("./server/lib/ap-subledger-statement.service").then((module) => module.listApCounterpartySummaries),
);
export const getApCounterpartyStatement = platformOperation.defineLazy(
  { parameters: Type.Tuple([OrganizationResponseDto, Type.String()]), result: Type.Union([ApCounterpartyStatementResponseDto, Type.Null()]) },
  () => import("./server/lib/ap-subledger-statement.service").then((module) => module.getApCounterpartyStatement),
);

export const operations = {
  listApCounterpartySummaries,
  getApCounterpartyStatement,
} as const;
