import type { UserAuditActorDto } from "@voyzu/types/modules/users";
import { getDb } from "@voyzu/capability/db";
import { UserRepo } from "@voyzu/modules/users/server";

export async function getAuditActor(userId: string | null | undefined): Promise<UserAuditActorDto | null> {
  if (!userId) return null;
  const parsed = Number(userId);
  if (!Number.isInteger(parsed)) return null;
  const row = await new UserRepo(getDb()).getById(parsed);
  return row
    ? {
        id: row.id,
        code: row.code,
        displayName: row.display_name,
      }
    : null;
}

export async function getAuditActors(row: {
  creation_user_id?: string | null;
  updated_user_id?: string | null;
}): Promise<{
  creationUser: UserAuditActorDto | null;
  updatedUser: UserAuditActorDto | null;
}> {
  const [creationUser, updatedUser] = await Promise.all([
    getAuditActor(row.creation_user_id),
    getAuditActor(row.updated_user_id),
  ]);
  return { creationUser, updatedUser };
}

export async function withAuditActors<T extends {
  audit: {
    created: { user?: UserAuditActorDto | null };
    updated: { user?: UserAuditActorDto | null };
  };
}>(dto: T, row: {
  creation_user_id?: string | null;
  updated_user_id?: string | null;
}): Promise<T> {
  const { creationUser, updatedUser } = await getAuditActors(row);
  return {
    ...dto,
    audit: {
      ...dto.audit,
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
