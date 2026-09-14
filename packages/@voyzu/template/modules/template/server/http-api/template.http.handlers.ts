import type { NextRequest } from "next/server";
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
  TemplateBatchPatchRequestDto,
  TemplateBatchUpdateRequestDto,
  TemplateCreateRequestDto,
  TemplatePatchRequestDto,
  TemplateUpdateRequestDto,
} from "../../../types";
import {
  activateTemplate,
  activateTemplates,
  batchCreateTemplates,
  batchDeleteTemplates,
  batchGetTemplates,
  batchPatchTemplates,
  batchUpdateTemplates,
  createTemplate,
  deactivateTemplate,
  deactivateTemplates,
  deleteTemplate,
  filterTemplates,
  getTemplate,
  listTemplates,
  patchTemplate,
  searchTemplates,
  updateTemplate,
} from "../lib/template.service";

type RouteContext = { params: Promise<{ code: string }> };

function errorResponse(error: unknown) {
  if (error instanceof InputValidationError) return inputValidationError(error.message);
  if (error instanceof BusinessRuleError) return businessRuleError(error.message);
  if (error instanceof ConflictError) return conflictError(error.message);
  if (error instanceof NotFoundError) return notFoundError(error.message);
  return serverError(error);
}

export async function handleList(_request: NextRequest) {
  try { return ok(await listTemplates()); } catch (error) { return errorResponse(error); }
}

export async function handleFilter(request: NextRequest) {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(request);
    return ok(await filterTemplates(filters ?? [], options));
  } catch (error) { return errorResponse(error); }
}

export async function handleSearch(request: NextRequest) {
  try { return ok(await searchTemplates(request.nextUrl.searchParams.get("q") ?? "")); }
  catch (error) { return errorResponse(error); }
}

export async function handleGet(_request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    const template = await getTemplate(code);
    return template ? ok(template) : notFoundError(`Template ${code} was not found`);
  } catch (error) { return errorResponse(error); }
}

export async function handleCreate(request: NextRequest) {
  try { return created(await createTemplate(await parseBody<TemplateCreateRequestDto>(request))); }
  catch (error) { return errorResponse(error); }
}

export async function handleUpdate(request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await updateTemplate(code, await parseBody<TemplateUpdateRequestDto>(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handlePatch(request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await patchTemplate(code, await parseBody<TemplatePatchRequestDto>(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handleDelete(_request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    await deleteTemplate(code);
    return noContent();
  } catch (error) { return errorResponse(error); }
}

export async function handleActivate(_request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await activateTemplate(code));
  } catch (error) { return errorResponse(error); }
}

export async function handleDeactivate(_request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await deactivateTemplate(code));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchDelete(request: NextRequest) {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    await batchDeleteTemplates(codes);
    return noContent();
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchCreate(request: NextRequest) {
  try {
    return created(await batchCreateTemplates(await parseBody<TemplateCreateRequestDto[]>(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchGet(request: NextRequest) {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    return ok(await batchGetTemplates(codes));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchUpdate(request: NextRequest) {
  try {
    return ok(await batchUpdateTemplates(await parseBody<TemplateBatchUpdateRequestDto[]>(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchPatch(request: NextRequest) {
  try {
    return ok(await batchPatchTemplates(await parseBody<TemplateBatchPatchRequestDto[]>(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchActivate(request: NextRequest) {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    return ok(await activateTemplates(codes));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchDeactivate(request: NextRequest) {
  try {
    const { codes } = await parseBody<CodesRequestDto>(request);
    return ok(await deactivateTemplates(codes));
  } catch (error) { return errorResponse(error); }
}
