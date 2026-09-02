import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import {
  createCreationAuditStamp,
  createUpdateAuditStamp,
  withCreationAudit,
  withAuditActors,
  withUpdateAudit,
} from "@voyzu/audit/stamps";
import type {
  ConfigurationCreate,
  ConfigurationKind,
  ConfigurationPatch,
  OptionValueCreate,
  OptionValuePatch,
  ConfigurationDetail,
} from "../../types/configuration.types";
import { ConfigurationRepo } from "../db/configuration.repo";
import { Delete } from "../../domain/operation-policy";
const enrichAuditActors = (record: ConfigurationDetail) =>
  withAuditActors(record, {
    creation_user_id: record.audit.created.userId,
    updated_user_id: record.audit.updated.userId,
  });
export const listConfiguration = (
  organizationId: number,
  kind: ConfigurationKind,
) => new ConfigurationRepo(getDb()).list(organizationId, kind);
export const getConfiguration = async (
  organizationId: number,
  kind: ConfigurationKind,
  id: number,
) => {
  const record = await new ConfigurationRepo(getDb()).get(
    organizationId,
    kind,
    id,
  );
  return record ? enrichAuditActors(record) : null;
};
export async function createConfiguration(
  organizationId: number,
  kind: ConfigurationKind,
  input: ConfigurationCreate,
) {
  return withTransaction(async (db) => {
    if ((kind === "category" || kind === "warehouse") && !input.code)
      throw new BusinessRuleError("Code is required");
    if (kind === "custom-field" && (!input.dataType || !input.appliesTo))
      throw new BusinessRuleError("Data type and Applies To are required");
    const repo = new ConfigurationRepo(db);
    let createInput = input;
    if (
      kind === "custom-field" &&
      (input.dataType === "OPTION" || input.dataType === "MULTIPLE_OPTIONS") &&
      !input.optionListId
    ) {
      const optionListId = await repo.insert(
        organizationId,
        "option-list",
        { name: `${input.name.trim()} Options`, isShared: false },
        withCreationAudit({}, await createCreationAuditStamp()),
      );
      createInput = { ...input, optionListId };
    }
    const id = await repo.insert(
      organizationId,
      kind,
      createInput,
      withCreationAudit({}, await createCreationAuditStamp()),
    );
    return enrichAuditActors((await repo.get(organizationId, kind, id))!);
  });
}
export async function patchConfiguration(
  organizationId: number,
  kind: ConfigurationKind,
  id: number,
  input: ConfigurationPatch,
) {
  return withTransaction(async (db) => {
    const repo = new ConfigurationRepo(db);
    const current = await repo.get(organizationId, kind, id);
    if (!current) throw new NotFoundError("Record was not found");
    let patchInput = input;
    if (
      kind === "custom-field" &&
      (current.dataType === "OPTION" ||
        current.dataType === "MULTIPLE_OPTIONS") &&
      input.optionListId === null
    ) {
      const optionListId = await repo.insert(
        organizationId,
        "option-list",
        {
          name: `${(input.name ?? current.name).trim()} Options`,
          isShared: false,
        },
        withCreationAudit({}, await createCreationAuditStamp()),
      );
      patchInput = { ...input, optionListId };
    }
    await repo.patch(
      organizationId,
      kind,
      id,
      patchInput,
      withUpdateAudit({}, await createUpdateAuditStamp()),
    );
    return enrichAuditActors((await repo.get(organizationId, kind, id))!);
  });
}
export async function transitionConfiguration(
  organizationId: number,
  kind: ConfigurationKind,
  ids: number[],
  status: "ACTIVE" | "INACTIVE" | "DELETED",
) {
  return withTransaction(async (db) => {
    const repo = new ConfigurationRepo(db);
    const records = status === "DELETED" || (kind === "category" && status === "INACTIVE")
      ? await Promise.all(
        ids.map((id) => repo.get(organizationId, kind, id)),
      )
      : [];
    if (kind === "category" && status !== "ACTIVE") {
      const usedCategories = records.filter(
        (record): record is NonNullable<typeof record> => Boolean(record?.inUse),
      );
      if (usedCategories.length) {
        throw new BusinessRuleError(
          `Item categories containing items cannot be deleted or made inactive. This applies whether the items are active or inactive. [${usedCategories.map(({ name }) => name).join(", ")}]`,
        );
      }
    }
    if (status === "DELETED") {
      const blockers = Delete(
        records.filter(
          (record): record is NonNullable<typeof record> => record !== null,
        ),
      );
      if (blockers.length) throw new BusinessRuleError(blockers[0]!.message);
    }
    await repo.transition(
      organizationId,
      kind,
      ids,
      status,
      withUpdateAudit({}, await createUpdateAuditStamp()),
    );
    return status === "DELETED"
      ? []
      : Promise.all(
          ids.map(async (id) =>
            enrichAuditActors((await repo.get(organizationId, kind, id))!),
          ),
        );
  });
}
export async function addOptionValue(
  organizationId: number,
  listId: number,
  input: OptionValueCreate,
) {
  return withTransaction(async (db) => {
    const repo = new ConfigurationRepo(db);
    const list = await repo.get(organizationId, "option-list", listId);
    if (!list) throw new NotFoundError("Option list was not found");
    await repo.addOption(
      organizationId,
      listId,
      input.value,
      withCreationAudit({}, await createCreationAuditStamp()),
    );
    return enrichAuditActors(
      (await repo.get(organizationId, "option-list", listId))!,
    );
  });
}
export async function patchOptionValue(
  organizationId: number,
  listId: number,
  optionId: number,
  input: OptionValuePatch,
) {
  return withTransaction(async (db) => {
    const repo = new ConfigurationRepo(db);
    if (!(await repo.get(organizationId, "option-list", listId)))
      throw new NotFoundError("Option list was not found");
    await repo.patchOption(
      organizationId,
      listId,
      optionId,
      input,
      withUpdateAudit({}, await createUpdateAuditStamp()),
    );
    return enrichAuditActors(
      (await repo.get(organizationId, "option-list", listId))!,
    );
  });
}
export async function deleteOptionValue(
  organizationId: number,
  listId: number,
  optionId: number,
) {
  return withTransaction(async (db) => {
    const repo = new ConfigurationRepo(db);
    if (!(await repo.get(organizationId, "option-list", listId)))
      throw new NotFoundError("Option list was not found");
    await repo.deleteOption(
      organizationId,
      listId,
      optionId,
      withUpdateAudit({}, await createUpdateAuditStamp()),
    );
    return enrichAuditActors(
      (await repo.get(organizationId, "option-list", listId))!,
    );
  });
}
