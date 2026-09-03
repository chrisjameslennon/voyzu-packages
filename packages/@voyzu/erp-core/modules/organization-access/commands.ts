import "server-only";

import { command } from "@voyzu/capability/commands";
import { OrganizationAccessPageDto, OrganizationAccessUserDto } from "@voyzu/erp-core/types/modules/organization-access";
import Type from "typebox";

const loadService = () => import("./server/lib/organization-access.service");

export const listOrganizationAccess = command.defineLazy(
  { parameters: Type.Tuple([]), result: OrganizationAccessPageDto },
  () => loadService().then((module) => module.listOrganizationAccess),
);
export const listOrganizationIdsForUser = command.defineLazy(
  { parameters: Type.Tuple([Type.Integer({ minimum: 1 })]), result: Type.Array(Type.Integer({ minimum: 1 })) },
  () => loadService().then((module) => module.listOrganizationIdsForUser),
);
export const replaceUserOrganizationAccess = command.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.Array(Type.Integer({ minimum: 1 }))]), result: OrganizationAccessUserDto },
  () => loadService().then((module) => module.replaceUserOrganizationAccess),
);

export const commands = { listOrganizationAccess, listOrganizationIdsForUser, replaceUserOrganizationAccess } as const;
