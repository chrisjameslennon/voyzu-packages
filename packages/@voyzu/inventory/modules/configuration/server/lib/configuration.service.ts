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
import {
  Activate,
  AddOptionValue,
  Create,
  Deactivate,
  Delete,
  DeleteOptionValue,
  DeleteWarehouse,
  Update,
  UpdateOptionValue,
} from "../../domain/operation-policy";
const enforce = (blockers: Array<{ message: string }>) => {
  if (blockers.length) throw new BusinessRuleError(blockers[0]!.message);
};
const isCustomFieldNameConflict = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "23505" &&
  "constraint" in error &&
  error.constraint === "uq_inv_custom_field_organization_applies_to_name";
const rethrowCustomFieldNameConflict = (
  error: unknown,
  name: string,
  appliesTo: string,
): never => {
  if (isCustomFieldNameConflict(error)) {
    enforce(
      Create({
        kind: "custom-field",
        name,
        hasCode: false,
        hasDataType: true,
        hasAppliesTo: true,
        appliesTo,
        nameAlreadyExists: true,
      }),
    );
  }
  throw error;
};
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
  try {
    return await withTransaction(async (db) => {
      const repo = new ConfigurationRepo(db);
      const nameAlreadyExists =
        kind === "custom-field" && input.appliesTo
          ? await repo.customFieldNameExists(
              organizationId,
              input.name,
              input.appliesTo,
            )
          : false;
      enforce(
        Create({
          kind,
          name: input.name,
          hasCode: Boolean(input.code),
          hasDataType: Boolean(input.dataType),
          hasAppliesTo: Boolean(input.appliesTo),
          dataType: input.dataType,
          appliesTo: input.appliesTo,
          showInFilter: input.showInFilter,
          nameAlreadyExists,
        }),
      );
      let createInput = input;
      if (
        kind === "custom-field" &&
        (input.dataType === "OPTION" ||
          input.dataType === "MULTIPLE_OPTIONS") &&
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
  } catch (error) {
    if (kind === "custom-field" && input.appliesTo)
      rethrowCustomFieldNameConflict(error, input.name, input.appliesTo);
    throw error;
  }
}
export async function patchConfiguration(
  organizationId: number,
  kind: ConfigurationKind,
  id: number,
  input: ConfigurationPatch,
) {
  let conflictName = input.name ?? "";
  let conflictAppliesTo = input.appliesTo ?? "";
  try {
    return await withTransaction(async (db) => {
      const repo = new ConfigurationRepo(db);
      const current = await repo.get(organizationId, kind, id);
      if (!current) throw new NotFoundError("Record was not found");
      conflictName = input.name ?? current.name;
      conflictAppliesTo = input.appliesTo ?? current.appliesTo ?? "";
      const nameAlreadyExists =
        kind === "custom-field" && conflictAppliesTo
          ? await repo.customFieldNameExists(
              organizationId,
              conflictName,
              conflictAppliesTo,
              id,
            )
          : false;
      enforce(
        Update({
          kind,
          name: conflictName,
          dataType: input.dataType ?? current.dataType,
          appliesTo: input.appliesTo ?? current.appliesTo,
          showInFilter: input.showInFilter ?? current.showInFilter,
          nameAlreadyExists,
        }),
      );
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
  } catch (error) {
    if (kind === "custom-field" && conflictAppliesTo)
      rethrowCustomFieldNameConflict(error, conflictName, conflictAppliesTo);
    throw error;
  }
}
export async function transitionConfiguration(
  organizationId: number,
  kind: ConfigurationKind,
  ids: number[],
  status: "ACTIVE" | "INACTIVE" | "DELETED",
) {
  return withTransaction(async (db) => {
    const repo = new ConfigurationRepo(db);
    const records =
      status === "DELETED" || (kind === "category" && status === "INACTIVE")
        ? await Promise.all(ids.map((id) => repo.get(organizationId, kind, id)))
        : [];
    const existingRecords = records.filter(
      (record): record is NonNullable<typeof record> => record !== null,
    );
    if (status === "ACTIVE") enforce(Activate());
    if (status === "INACTIVE") enforce(Deactivate(kind, existingRecords));
    if (kind === "category" && status === "DELETED")
      enforce(Deactivate(kind, existingRecords));
    if (kind === "warehouse" && status === "DELETED") {
      const stockedWarehouses = await repo.stockedWarehouses(
        organizationId,
        ids,
      );
      const blockers = DeleteWarehouse(
        stockedWarehouses.map(({ name }) => ({
          name,
          hasUnitsOnHand: true,
        })),
      );
      enforce(blockers);
    }
    if (status === "DELETED") {
      enforce(Delete(existingRecords));
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
    enforce(AddOptionValue());
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
    enforce(UpdateOptionValue());
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
    enforce(DeleteOptionValue());
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
