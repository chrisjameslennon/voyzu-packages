import { randomUUID } from "node:crypto";

import type {
  OrganizationResponseDto,
  OrganizationUpdateRequestDto,
} from "@voyzu-modules/types/modules/organization";
import { BusinessRuleError } from "@voyzu/capability/errors";
import { ChangeCode } from "@voyzu-modules/all-modules/organization/domain/operation-policy";
import { runtime } from "@voyzu/capability/runtime";

import { getDb } from "@voyzu/capability/db";
import { UserRepo } from "@voyzu/modules/users/server";
import { getCurrentActorType, getCurrentUser } from "@voyzu/modules/users/server";

import { OrganizationRepo } from "../db/organization.repo";
import type { OrganizationRow } from "../db/organization.row.types";

import { toDto, toUpdateRow } from "./organization.mapper";
import { validateUpdate, validateResponse } from "./organization.validator";

async function getAuditActor(
  repo: UserRepo,
  userId: string | null,
): Promise<OrganizationResponseDto["audit"]["created"]["user"]> {
  if (!userId) return null;
  const parsed = Number(userId);
  if (!Number.isInteger(parsed)) return null;
  const row = await repo.getById(parsed);
  return row
    ? {
        id: row.id,
        code: row.code,
        displayName: row.display_name,
      }
    : null;
}

async function enrich(row: OrganizationRow): Promise<OrganizationResponseDto> {
  const userRepo = new UserRepo(getDb());
  const [creationUser, updatedUser] = await Promise.all([
    getAuditActor(userRepo, row.creation_user_id),
    getAuditActor(userRepo, row.updated_user_id),
  ]);
  const dto = toDto(row);
  return {
    ...dto,
    audit: {
      created: {
        ...dto.audit.created,
        user: creationUser,
      },
      updated: {
        ...dto.audit.updated,
        user: updatedUser,
      },
    },
  };
}

function checkedResponse(dto: OrganizationResponseDto): OrganizationResponseDto {
  const errors = validateResponse(dto);
  if (errors.length) {
    const message = `Invalid organization response: ${errors.join("; ")}`;
    if (runtime.isDevLike) throw new Error(message);
    console.error(message);
  }
  return dto;
}

export async function getOrganization(): Promise<OrganizationResponseDto | null> {
  const row = await new OrganizationRepo(getDb()).get();
  if (!row) return null;
  return checkedResponse(await enrich(row));
}

export async function updateOrganization(input: OrganizationUpdateRequestDto): Promise<OrganizationResponseDto> {
  const errors = validateUpdate(input);
  if (errors.length) throw new Error(errors.join("; "));

  const repo = new OrganizationRepo(getDb());
  const existing = await repo.get();
  if (!existing) throw new Error("Organization not found");
  if (input.code !== undefined) {
    const blockers = ChangeCode({ code: existing.code, hasPostings: existing.has_postings }, input.code);
    if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
  }

  const currentUser = await getCurrentUser();
  const mutationId = randomUUID();
  const row = await repo.update(existing.id, {
    ...toUpdateRow(input),
    updated_actor_type: getCurrentActorType(),
    updated_user_id: currentUser ? String(currentUser.id) : null,
    updated_mutation_id: mutationId,
  });
  return checkedResponse(await enrich(row));
}
