import { type NextRequest } from "next/server";
import {
  businessRuleError,
  conflictError,
  created,
  inputValidationError,
  noContent,
  notFoundError,
  ok,
  parseBody,
  serverError,
} from "@voyzu/capability/http";
import {
  BusinessRuleError,
  ConflictError,
  InputValidationError,
  NotFoundError,
} from "@voyzu/capability/errors";
import type { CodesRequestDto, FilterRequestDto } from "@voyzu/types/params";

import type {
  IceCreamBatchPatchRequestDto,
  IceCreamBatchUpdateRequestDto,
  IceCreamCreateRequestDto,
  IceCreamPatchRequestDto,
  IceCreamUpdateRequestDto,
} from "@voyzu/ice-creams/types";
import {
  activateIceCream,
  activateIceCreams,
  batchCreateIceCreams,
  batchDeleteIceCreams,
  batchGetIceCreams,
  batchPatchIceCreams,
  batchUpdateIceCreams,
  createIceCream,
  deactivateIceCream,
  deactivateIceCreams,
  deleteIceCream,
  filterIceCreams,
  getIceCream,
  listIceCreamFlavors,
  listIceCreams,
  patchIceCream,
  searchIceCreams,
  updateIceCream,
} from "../lib/ice-cream.service";

type RouteContext = { params: Promise<{ code: string }> };

function errorResponse(error: unknown) {
  if (error instanceof InputValidationError) return inputValidationError(error.message);
  if (error instanceof BusinessRuleError) return businessRuleError(error.message);
  if (error instanceof ConflictError) return conflictError(error.message);
  if (error instanceof NotFoundError) return notFoundError(error.message);
  return serverError(error);
}

export async function handleList(_request: NextRequest) {
  try { return ok(await listIceCreams()); } catch (error) { return errorResponse(error); }
}

export async function handleListFlavors(_request: NextRequest) {
  try { return ok(await listIceCreamFlavors()); } catch (error) { return errorResponse(error); }
}

export async function handleFilter(request: NextRequest) {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(request);
    return ok(await filterIceCreams(filters ?? [], options));
  } catch (error) { return errorResponse(error); }
}

export async function handleSearch(request: NextRequest) {
  try {
    return ok(await searchIceCreams(request.nextUrl.searchParams.get("q") ?? ""));
  } catch (error) { return errorResponse(error); }
}

export async function handleGet(_request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    const iceCream = await getIceCream(code);
    return iceCream ? ok(iceCream) : notFoundError(`Ice cream ${code} was not found`);
  } catch (error) { return errorResponse(error); }
}

export async function handleCreate(request: NextRequest) {
  try {
    return created(await createIceCream(await parseBody<IceCreamCreateRequestDto>(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handleUpdate(request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await updateIceCream(code, await parseBody<IceCreamUpdateRequestDto>(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handlePatch(request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await patchIceCream(code, await parseBody<IceCreamPatchRequestDto>(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handleDelete(_request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    await deleteIceCream(code);
    return noContent();
  } catch (error) { return errorResponse(error); }
}

export async function handleActivate(_request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await activateIceCream(code));
  } catch (error) { return errorResponse(error); }
}

export async function handleDeactivate(_request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await deactivateIceCream(code));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchCreate(request: NextRequest) {
  try {
    return created(await batchCreateIceCreams(
      await parseBody<IceCreamCreateRequestDto[]>(request),
    ));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchGet(request: NextRequest) {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    return ok(await batchGetIceCreams(codes));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchUpdate(request: NextRequest) {
  try {
    return ok(await batchUpdateIceCreams(
      await parseBody<IceCreamBatchUpdateRequestDto[]>(request),
    ));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchPatch(request: NextRequest) {
  try {
    return ok(await batchPatchIceCreams(
      await parseBody<IceCreamBatchPatchRequestDto[]>(request),
    ));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchDelete(request: NextRequest) {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    await batchDeleteIceCreams(codes);
    return noContent();
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchActivate(request: NextRequest) {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    return ok(await activateIceCreams(codes));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchDeactivate(request: NextRequest) {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    return ok(await deactivateIceCreams(codes));
  } catch (error) { return errorResponse(error); }
}
