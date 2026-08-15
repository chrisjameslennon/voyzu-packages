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

function requestObject(value: unknown, allowedFields: readonly string[]): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new InputValidationError("Request body must be a JSON object");
  }
  const body = value as Record<string, unknown>;
  const unsupported = Object.keys(body).filter((field) => !allowedFields.includes(field));
  if (unsupported.length) throw new InputValidationError(`Unsupported request field${unsupported.length === 1 ? "" : "s"}: ${unsupported.join(", ")}`);
  return body;
}

async function parseCreateRequest(request: NextRequest): Promise<TemplateCreateRequestDto> {
  const body = requestObject(await parseBody<unknown>(request), ["code", "description"]);
  return {
    code: body.code as string,
    description: body.description as string | null,
  };
}

async function parsePatchRequest(request: NextRequest): Promise<TemplatePatchRequestDto> {
  const body = requestObject(await parseBody<unknown>(request), ["description"]);
  return {
    ...(Object.hasOwn(body, "description") && { description: body.description as string | null }),
  };
}

async function parseUpdateRequest(request: NextRequest): Promise<TemplateUpdateRequestDto> {
  const body = requestObject(await parseBody<unknown>(request), ["description"]);
  return { description: body.description as string | null };
}

async function parseCodesRequest(request: NextRequest): Promise<string[]> {
  const body = requestObject(await parseBody<unknown>(request), ["codes"]);
  if (!Array.isArray(body.codes) || body.codes.some((code) => typeof code !== "string")) {
    throw new InputValidationError("codes must be an array of template code strings");
  }
  return body.codes;
}

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
  try { return created(await createTemplate(await parseCreateRequest(request))); }
  catch (error) { return errorResponse(error); }
}

export async function handleUpdate(request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await updateTemplate(code, await parseUpdateRequest(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handlePatch(request: NextRequest, { params }: RouteContext) {
  try {
    const { code } = await params;
    return ok(await patchTemplate(code, await parsePatchRequest(request)));
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
    await batchDeleteTemplates(await parseCodesRequest(request));
    return noContent();
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchCreate(request: NextRequest) {
  try {
    const values = await parseBody<unknown>(request);
    if (!Array.isArray(values)) throw new InputValidationError("Request body must be an array of templates");
    const inputs = values.map((value) => {
      const body = requestObject(value, ["code", "description"]);
      return { code: body.code as string, description: body.description as string | null };
    });
    return created(await batchCreateTemplates(inputs));
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
    const values = await parseBody<unknown>(request);
    if (!Array.isArray(values)) throw new InputValidationError("Request body must be an array of templates");
    const inputs: TemplateBatchUpdateRequestDto[] = values.map((value) => {
      const body = requestObject(value, ["code", "description"]);
      return { code: body.code as string, description: body.description as string | null };
    });
    return ok(await batchUpdateTemplates(inputs));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchPatch(request: NextRequest) {
  try {
    const values = await parseBody<unknown>(request);
    if (!Array.isArray(values)) throw new InputValidationError("Request body must be an array of templates");
    const inputs: TemplateBatchPatchRequestDto[] = values.map((value) => {
      const body = requestObject(value, ["code", "description"]);
      return {
        code: body.code as string,
        ...(Object.hasOwn(body, "description") && { description: body.description as string | null }),
      };
    });
    return ok(await batchPatchTemplates(inputs));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchActivate(request: NextRequest) {
  try {
    return ok(await activateTemplates(await parseCodesRequest(request)));
  } catch (error) { return errorResponse(error); }
}

export async function handleBatchDeactivate(request: NextRequest) {
  try {
    return ok(await deactivateTemplates(await parseCodesRequest(request)));
  } catch (error) { return errorResponse(error); }
}
