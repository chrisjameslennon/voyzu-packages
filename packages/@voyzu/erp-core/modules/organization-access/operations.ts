import "server-only";

import { operation } from "@voyzu/capability/operations";
import { OrganizationAccessPageDto, OrganizationAccessUserDto } from "@voyzu/erp-core/types/modules/organization-access";
import Type from "typebox";

const loadService = () => import("./server/lib/organization-access.service");

export const listOrganizationAccess = operation.defineLazy(
  { parameters: Type.Tuple([]), result: OrganizationAccessPageDto },
  () => loadService().then((module) => module.listOrganizationAccess),
);
export const listOrganizationIdsForUser = operation.defineLazy(
  { parameters: Type.Tuple([Type.Integer({ minimum: 1 })]), result: Type.Array(Type.Integer({ minimum: 1 })) },
  () => loadService().then((module) => module.listOrganizationIdsForUser),
);
export const replaceUserOrganizationAccess = operation.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.Array(Type.Integer({ minimum: 1 }))]), result: OrganizationAccessUserDto },
  () => loadService().then((module) => module.replaceUserOrganizationAccess),
);

export const operations = { listOrganizationAccess, listOrganizationIdsForUser, replaceUserOrganizationAccess } as const;
