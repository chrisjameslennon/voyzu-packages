import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { ArInvoiceStatementResponseDto } from "@voyzu/finance/types/modules/ar-subledger";



export const getArInvoiceStatement = platformOperation.defineLazy(
  { parameters: Type.Tuple([OrganizationResponseDto, Type.String()]), result: Type.Union([ArInvoiceStatementResponseDto, Type.Null()]) },
  () => import("./server/lib/ar-invoice-statement.service").then((module) => module.getArInvoiceStatement),
);

export const operations = {
  getArInvoiceStatement,
} as const;
