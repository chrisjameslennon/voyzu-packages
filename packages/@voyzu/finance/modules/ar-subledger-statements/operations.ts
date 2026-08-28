import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { ArCounterpartyStatementResponseDto, ArCounterpartySummaryResponseDto } from "@voyzu/finance/types/modules/ar-subledger";



export const listArCounterpartySummaries = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ArCounterpartySummaryResponseDto) },
  () => import("./server/lib/ar-subledger-statement.service").then((module) => module.listArCounterpartySummaries),
);
export const getArCounterpartyStatement = platformOperation.defineLazy(
  { parameters: Type.Tuple([OrganizationResponseDto, Type.String()]), result: Type.Union([ArCounterpartyStatementResponseDto, Type.Null()]) },
  () => import("./server/lib/ar-subledger-statement.service").then((module) => module.getArCounterpartyStatement),
);

export const operations = {
  listArCounterpartySummaries,
  getArCounterpartyStatement,
} as const;
