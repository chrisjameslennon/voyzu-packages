import type { NextRequest } from "next/server";
import {
  BusinessRuleError,
  ConflictError,
  NotFoundError,
} from "@voyzu/capability/errors";
import {
  businessRuleError,
  conflictError,
  created,
  notFoundError,
  ok,
  parseBody,
  serverError,
} from "@voyzu/capability/http";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import type {
  ConfigurationCreate,
  ConfigurationKind,
  ConfigurationPatch,
  OptionValueCreate,
  OptionValuePatch,
} from "../../types/configuration.types";
import {
  addOptionValue,
  createConfiguration,
  getConfiguration,
  listConfiguration,
  patchConfiguration,
  transitionConfiguration,
  patchOptionValue,
  deleteOptionValue,
} from "../lib/configuration.service";
type Context = {
  params: Promise<{
    kind?: ConfigurationKind;
    id?: string;
    optionId?: string;
  }>;
};
const org = async () => {
  const selected = await getSelectedOrganization();
  if (!selected) throw new BusinessRuleError("Select an organization first");
  return selected.id;
};
const fail = (error: unknown) =>
  error instanceof BusinessRuleError
    ? businessRuleError(error.message)
    : error instanceof NotFoundError
      ? notFoundError(error.message)
      : error instanceof ConflictError
        ? conflictError(error.message)
        : serverError(error);
export async function handleList(_request: NextRequest, { params }: Context) {
  try {
    const { kind } = await params;
    return ok(await listConfiguration(await org(), kind!));
  } catch (error) {
    return fail(error);
  }
}
export async function handleCreate(request: NextRequest, { params }: Context) {
  try {
    const { kind } = await params;
    return created(
      await createConfiguration(
        await org(),
        kind!,
        await parseBody<ConfigurationCreate>(request),
      ),
    );
  } catch (error) {
    return fail(error);
  }
}
export async function handleGet(_request: NextRequest, { params }: Context) {
  try {
    const { kind, id } = await params;
    const result = await getConfiguration(await org(), kind!, Number(id));
    return result ? ok(result) : notFoundError("Record was not found");
  } catch (error) {
    return fail(error);
  }
}
export async function handlePatch(request: NextRequest, { params }: Context) {
  try {
    const { kind, id } = await params;
    return ok(
      await patchConfiguration(
        await org(),
        kind!,
        Number(id),
        await parseBody<ConfigurationPatch>(request),
      ),
    );
  } catch (error) {
    return fail(error);
  }
}
export async function handleTransition(
  request: NextRequest,
  { params }: Context,
) {
  try {
    const { kind } = await params;
    const body = await parseBody<{
      ids: number[];
      status: "ACTIVE" | "INACTIVE" | "DELETED";
    }>(request);
    return ok(
      await transitionConfiguration(await org(), kind!, body.ids, body.status),
    );
  } catch (error) {
    return fail(error);
  }
}
export async function handleAddOption(
  request: NextRequest,
  { params }: Context,
) {
  try {
    const { id } = await params;
    return ok(
      await addOptionValue(
        await org(),
        Number(id),
        await parseBody<OptionValueCreate>(request),
      ),
    );
  } catch (error) {
    return fail(error);
  }
}
export async function handlePatchOption(
  request: NextRequest,
  { params }: Context,
) {
  try {
    const { id, optionId } = await params;
    return ok(
      await patchOptionValue(
        await org(),
        Number(id),
        Number(optionId),
        await parseBody<OptionValuePatch>(request),
      ),
    );
  } catch (error) {
    return fail(error);
  }
}
export async function handleDeleteOption(
  _request: NextRequest,
  { params }: Context,
) {
  try {
    const { id, optionId } = await params;
    return ok(
      await deleteOptionValue(await org(), Number(id), Number(optionId)),
    );
  } catch (error) {
    return fail(error);
  }
}
