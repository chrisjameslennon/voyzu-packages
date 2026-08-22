import { type NextRequest, NextResponse } from "next/server";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import {
  businessRuleError, inputValidationError, notFoundError, ok, parseBody, serverError,
} from "@voyzu/capability/http";
import type { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "@voyzu/core/types/modules/finance-companies";
import type { CompanySelectionResponseDto, CompanySelectionUpdateResponseDto } from "@voyzu/erp-core/types/modules/company-switcher";
import type { CompanySelectionUpdateRequestDto } from "@voyzu/erp-core/company-switcher/types";
import {
  SELECTED_COMPANY_COOKIE,
  SELECTED_COMPANY_COOKIE_MAX_AGE_SECONDS,
  parseSelectedCompanyId,
} from "@voyzu/erp-core/company-switcher/server";
import {
  activateFinanceCompany,
  getFinanceCompany,
  listFinanceCompanies,
  listSelectableFinanceCompaniesForCurrentUser,
  resolveFinanceCompanySelectionForCurrentUser,
  updateFinanceCompany,
} from "../lib/finance-company.service";

type ErrorResponse = InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | BusinessRuleErrorResponseDto | InternalServerErrorResponseDto;

function applySelectedCompanyCookie(response: NextResponse, companyId: number) {
  response.cookies.set(SELECTED_COMPANY_COOKIE, String(companyId), {
    httpOnly: true,
    maxAge: SELECTED_COMPANY_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
  });
}

export async function handleGetFinanceCompanySelection(
  request: NextRequest,
): Promise<NextResponse<CompanySelectionResponseDto | InternalServerErrorResponseDto>> {
  try {
    const requestedCompanyId = parseSelectedCompanyId(request.cookies.get(SELECTED_COMPANY_COOKIE)?.value);
    const { companies, selectedCompany } = await resolveFinanceCompanySelectionForCurrentUser(requestedCompanyId);
    return ok({ companies, selectedCompany, selectedCompanyId: selectedCompany?.id ?? null });
  } catch (error) {
    return serverError(error);
  }
}

export async function handleSetFinanceCompanySelection(
  request: NextRequest,
): Promise<NextResponse<CompanySelectionUpdateResponseDto | ErrorResponse>> {
  try {
    const body = await parseBody<CompanySelectionUpdateRequestDto>(request);
    const companyId = parseSelectedCompanyId(String(body.companyId));
    if (!companyId) return inputValidationError("A valid companyId is required");
    const selectedCompany = (await listSelectableFinanceCompaniesForCurrentUser())
      .find((company) => company.id === companyId);
    if (!selectedCompany) return notFoundError("Finance company was not found");
    const response = ok({ selectedCompanyId: selectedCompany.id });
    applySelectedCompanyCookie(response, selectedCompany.id);
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
