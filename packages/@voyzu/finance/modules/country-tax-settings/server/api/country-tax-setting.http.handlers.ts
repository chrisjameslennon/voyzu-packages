import { type NextRequest, NextResponse } from "next/server";
import { notFoundError, ok, serverError } from "@voyzu/capability/http";
import type { EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type { CountryTaxSetting } from "@voyzu/finance/types/modules/country-tax-settings";
import { getCountryTaxSetting, listCountryTaxSettings } from "../lib/country-tax-setting.service";

export async function handleList(): Promise<NextResponse<CountryTaxSetting[] | InternalServerErrorResponseDto>> {
  try { return ok(await listCountryTaxSettings()); } catch (error) { return serverError(error); }
}

export async function handleGet(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<CountryTaxSetting | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const country = await getCountryTaxSetting(code);
    return country ? ok(country) : notFoundError(`Country ${code} not found`);
  } catch (error) { return serverError(error); }
}
