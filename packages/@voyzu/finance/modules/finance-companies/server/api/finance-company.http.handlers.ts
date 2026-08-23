import { type NextRequest, NextResponse } from "next/server";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import {
  businessRuleError, inputValidationError, notFoundError, ok, parseBody, serverError,
} from "@voyzu/capability/http";
import type { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "@voyzu/finance/types/modules/finance-companies";
import type { OrganizationSelectionResponseDto, OrganizationSelectionUpdateResponseDto } from "@voyzu/erp-core/types/modules/organization-switcher";
import type { OrganizationSelectionUpdateRequestDto } from "@voyzu/erp-core/organization-switcher/types";
import {
  SELECTED_ORGANIZATION_COOKIE,
  SELECTED_ORGANIZATION_COOKIE_MAX_AGE_SECONDS,
  parseSelectedOrganizationId,
} from "@voyzu/erp-core/organization-switcher/server";
import {
  activateFinanceCompany,
  getFinanceCompany,
  listFinanceCompanies,
  listSelectableFinanceCompaniesForCurrentUser,
  resolveFinanceCompanySelectionForCurrentUser,
  updateFinanceCompany,
} from "../lib/finance-company.service";

type ErrorResponse = InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | BusinessRuleErrorResponseDto | InternalServerErrorResponseDto;

function applySelectedCompanyCookie(response: NextResponse, organizationId: number) {
  response.cookies.set(SELECTED_ORGANIZATION_COOKIE, String(organizationId), {
    httpOnly: true,
    maxAge: SELECTED_ORGANIZATION_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
  });
}

export async function handleGetFinanceCompanySelection(
  request: NextRequest,
): Promise<NextResponse<OrganizationSelectionResponseDto | InternalServerErrorResponseDto>> {
  try {
    const requestedOrganizationId = parseSelectedOrganizationId(request.cookies.get(SELECTED_ORGANIZATION_COOKIE)?.value);
    const { organizations, selectedOrganization } = await resolveFinanceCompanySelectionForCurrentUser(requestedOrganizationId);
    return ok({ organizations, selectedOrganization, selectedOrganizationId: selectedOrganization?.id ?? null });
  } catch (error) {
    return serverError(error);
  }
}

export async function handleSetFinanceCompanySelection(
  request: NextRequest,
): Promise<NextResponse<OrganizationSelectionUpdateResponseDto | ErrorResponse>> {
  try {
    const body = await parseBody<OrganizationSelectionUpdateRequestDto>(request);
    const organizationId = parseSelectedOrganizationId(String(body.organizationId));
    if (!organizationId) return inputValidationError("A valid organizationId is required");
    const selectedOrganization = (await listSelectableFinanceCompaniesForCurrentUser())
      .find((organization) => organization.id === organizationId);
    if (!selectedOrganization) return notFoundError("Finance company was not found");
    const response = ok({ selectedOrganizationId: selectedOrganization.id });
    applySelectedCompanyCookie(response, selectedOrganization.id);
    return response;
  } catch (error) {
    if (error instanceof SyntaxError) return inputValidationError(error.message);
    return serverError(error);
  }
}

export async function handleList(): Promise<NextResponse<FinanceCompanyResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    return ok(await listFinanceCompanies());
  } catch (error) {
    return serverError(error);
  }
}

export async function handleGet(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinanceCompanyResponseDto | ErrorResponse>> {
  try {
    const { code } = await params;
    const company = await getFinanceCompany(code);
    return company ? ok(company) : notFoundError(`Company ${code} not found`);
  } catch (error) {
    return serverError(error);
  }
}

export async function handleActivate(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinanceCompanyResponseDto | ErrorResponse>> {
  try {
    const { code } = await params;
    return ok(await activateFinanceCompany(code));
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundError(error.message);
    if (error instanceof BusinessRuleError) return businessRuleError(error.message);
    return serverError(error);
  }
}

export async function handleUpdate(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinanceCompanyResponseDto | ErrorResponse>> {
  try {
    const { code } = await params;
    const body = await parseBody<FinanceCompanyUpdateRequestDto>(request);
    return ok(await updateFinanceCompany(code, body));
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundError(error.message);
    if (error instanceof BusinessRuleError) return businessRuleError(error.message);
    if (error instanceof SyntaxError) return inputValidationError(error.message);
    return serverError(error);
  }
}
