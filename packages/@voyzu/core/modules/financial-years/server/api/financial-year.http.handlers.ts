import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/core/common/server";

import type {
  BusinessRuleErrorResponseDto,
  ConflictErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types/errors";
import type { FinancialYearsExportRequestDto } from "@voyzu/core/financial-years/types";
import type { FinancialYearResponseDto } from "@voyzu/core/types/modules/financial-years";
import type { FinancialYearCreateRequestDto } from "@voyzu/core/types/modules/financial-years";
import type { FinancialYearPatchRequestDto } from "@voyzu/core/types/modules/financial-years";

import { businessRuleError, conflictError, notFoundError, serverError, inputValidationError } from "@voyzu/capability/http";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { created, noContent, ok } from "@voyzu/capability/http";
import { parseBody } from "@voyzu/capability/http";

import { toCsv } from "@voyzu/capability";

import {
  listFinancialYears,
  getFinancialYear,
  createFinancialYear,
  patchFinancialYear,
  deleteFinancialYear,
  openFinancialYear,
  closeFinancialYear,
  reopenFinancialYear,
  exportFinancialYearsWithPeriods,
} from "../lib/financial-year.service";

type ZipArchiveInstance = {
  on(event: "data", listener: (chunk: Buffer) => void): ZipArchiveInstance;
  on(event: "end", listener: () => void): ZipArchiveInstance;
  on(event: "error", listener: (err: Error) => void): ZipArchiveInstance;
  append(source: Buffer, data: { name: string }): ZipArchiveInstance;
  finalize(): Promise<void>;
};

function getCompanyId(req: NextRequest): Promise<number> {
  return resolveApiCompanyIdFromPath(req);
}

// ── Collection operations ──────────────────────────────────────


export async function handleList(
  req: NextRequest,
): Promise<NextResponse<FinancialYearResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const years = await listFinancialYears(companyId);
    return ok(years satisfies FinancialYearResponseDto[]);
  } catch (err) {
    return serverError(err);
  }
}

// ── Item operations ────────────────────────────────────────────


export async function handleGet(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialYearResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const { code } = await params;
    const year = await getFinancialYear(companyId, code);
    if (!year) return notFoundError(`Financial year ${code} not found`);
    return ok(year satisfies FinancialYearResponseDto);
  } catch (err) {
    return serverError(err);
  }
}


export async function handleCreate(
  req: NextRequest,
): Promise<NextResponse<FinancialYearResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const body = await parseBody<FinancialYearCreateRequestDto>(req);
    const year = await createFinancialYear(companyId, body);
    return created(year satisfies FinancialYearResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handlePatch(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialYearResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const { code } = await params;
    const body = await parseBody<FinancialYearPatchRequestDto>(req);
    const year = await patchFinancialYear(companyId, code, body);
    return ok(year satisfies FinancialYearResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleDelete(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<null | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const { code } = await params;
    await deleteFinancialYear(companyId, code);
    return noContent();
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}

// ── Lifecycle operations ───────────────────────────────────────


export async function handleOpen(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialYearResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const { code } = await params;
    const year = await openFinancialYear(companyId, code);
    return ok(year satisfies FinancialYearResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}


export async function handleClose(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialYearResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const { code } = await params;
    const year = await closeFinancialYear(companyId, code);
    return ok(year satisfies FinancialYearResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}


export async function handleReopen(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<FinancialYearResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const companyId = await getCompanyId(req);
    const { code } = await params;
    const year = await reopenFinancialYear(companyId, code);
    return ok(year satisfies FinancialYearResponseDto);
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}

// ── Export ────────────────────────────────────────────────────

const YEAR_EXPORT_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "code", label: "Code" },
  { key: "name", label: "Name" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "hasPostings", label: "Has Postings" },
  { key: "status", label: "Status" },
];

const PERIOD_EXPORT_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "financialYearId", label: "Financial Year ID" },
  { key: "code", label: "Code" },
  { key: "name", label: "Name" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "hasPostings", label: "Has Postings" },
  { key: "status", label: "Status" },
];

export async function handleExportZip(req: NextRequest): Promise<NextResponse> {
  try {
    const { companyId, yearIds, filename } = await req.json() as Partial<FinancialYearsExportRequestDto>;
    if (typeof companyId !== "number") return inputValidationError("companyId must be a number");
    if (!Array.isArray(yearIds)) return inputValidationError("yearIds must be an array");
    const safeFilename = typeof filename === "string" && filename ? filename : "financial-years";

    const { years, periods } = await exportFinancialYearsWithPeriods(companyId, yearIds as number[]);

    const [yearsCsv, periodsCsv] = await Promise.all([
      toCsv(YEAR_EXPORT_COLUMNS, years as unknown as Record<string, unknown>[]),
      toCsv(PERIOD_EXPORT_COLUMNS, periods as unknown as Record<string, unknown>[]),
    ]);

    const { ZipArchive } = await import("archiver") as unknown as {
      ZipArchive: new () => ZipArchiveInstance;
    };

    const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
      const archive = new ZipArchive();
      const chunks: Buffer[] = [];
      archive.on("data", (chunk: Buffer) => chunks.push(chunk));
      archive.on("end", () => resolve(Buffer.concat(chunks)));
      archive.on("error", reject);
      archive.append(Buffer.from(yearsCsv), { name: `${safeFilename}.csv` });
      archive.append(Buffer.from(periodsCsv), { name: `${safeFilename}-periods.csv` });
      void archive.finalize();
    });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeFilename}.zip"`,
      },
    });
  } catch (err) {
    return serverError(err);
  }
}
