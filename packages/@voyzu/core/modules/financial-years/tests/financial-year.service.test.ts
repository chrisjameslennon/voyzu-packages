import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";

import type { FinancialYearCreateRequestDto } from "@voyzu/core/types/modules/financial-years/financial-year.create.request.dto";
import type { FinancialYearResponseDto } from "@voyzu/core/types/modules/financial-years/financial-year.response.dto";

import { getPool } from "@voyzu/capability/db";
import { listCompanies } from "../../companies/server/lib/company.service";
import {
  listFinancialYears,
  getFinancialYear,
  createFinancialYear,
  patchFinancialYear,
  deleteFinancialYear,
  reopenFinancialYear,
  closeFinancialYear,
} from "../server/lib/financial-year.service";

let companyId: number;
const createdCodes: string[] = [];

function uniqueCode() {
  return `SVC-FY-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function yearDates(startIso: string): { startDate: string; endDate: string } {
  const start = new Date(startIso);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  end.setDate(end.getDate() - 1);
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
}

before(async () => {
  const companies = await listCompanies();
  const company = companies[0];
  if (!company) throw new Error("No companies found — run seed scripts before running financial year tests");
  companyId = company.id;
});

after(async () => {
  for (const code of createdCodes) {
    try { await deleteFinancialYear(companyId, code); } catch { /* best-effort */ }
  }
  await getPool().end();
});

describe("financial-year.service", () => {
  it("creates a financial year", async () => {
    const code = uniqueCode();
    const { startDate, endDate } = yearDates("2090-01-01");
    const input: FinancialYearCreateRequestDto = { code, startDate, endDate, status: "PLANNED" };

    const year: FinancialYearResponseDto = await createFinancialYear(companyId, input);
    createdCodes.push(year.code);

    assert.equal(year.code, code);
    assert.equal(year.startDate, startDate);
    assert.equal(year.endDate, endDate);
    assert.equal(year.companyId, companyId);
    assert.ok(year.id > 0);
    assert.ok(year.audit.created.date);
    assert.ok(year.audit.updated.date);
  });

  it("gets a financial year by code", async () => {
    const code = createdCodes[0];
    assert.ok(code, "expected a created code from prior test");

    const year = await getFinancialYear(companyId, code);
    assert.ok(year);
    assert.equal(year.code, code);
  });

  it("returns null for non-existent code", async () => {
    const year = await getFinancialYear(companyId, "DOES-NOT-EXIST");
    assert.equal(year, null);
  });

  it("lists financial years for a company (includes test codes)", async () => {
    const years = await listFinancialYears(companyId);
    const testCodes = years.map((y) => y.code).filter((c) => c.startsWith("SVC-FY-"));
    assert.ok(testCodes.length >= 1);
  });

  it("patches a financial year code", async () => {
    const oldCode = createdCodes[0];
    const newCode = uniqueCode();

    const patched = await patchFinancialYear(companyId, oldCode, { code: newCode });
    createdCodes[0] = newCode;

    assert.equal(patched.code, newCode);
  });

  it("validates required code on create", async () => {
    const { startDate, endDate } = yearDates("2091-01-01");
    await assert.rejects(
      () => createFinancialYear(companyId, { code: "", startDate, endDate, status: "PLANNED" }),
      (err: Error) => {
        assert.ok(err.message.includes("Code is required"));
        return true;
      },
    );
  });

  it("validates date span on create (must be ~365 days)", async () => {
    const code = uniqueCode();
    await assert.rejects(
      () => createFinancialYear(companyId, { code, startDate: "2092-01-01", endDate: "2092-06-30", status: "PLANNED" }),
      (err: Error) => {
        assert.ok(err.message.toLowerCase().includes("365") || err.message.toLowerCase().includes("date"));
        return true;
      },
    );
  });

  it("rejects duplicate code for same company", async () => {
    const code = createdCodes[0];
    assert.ok(code);
    const { startDate, endDate } = yearDates("2093-01-01");
    await assert.rejects(
      () => createFinancialYear(companyId, { code, startDate, endDate, status: "PLANNED" }),
    );
  });

  it("lifecycle — reopen fails when year is not CLOSED", async () => {
    const code = createdCodes[0];
    assert.ok(code);
    const year = await getFinancialYear(companyId, code);
    assert.ok(year);
    // year is PLANNED — reopening a non-CLOSED year must fail
    assert.notEqual(year.status, "CLOSED");
    await assert.rejects(
      () => reopenFinancialYear(companyId, code),
      (err: Error) => {
        assert.ok(err.message.length > 0);
        return true;
      },
    );
  });

  it("closes and reopens a financial year (if no open periods)", async () => {
    // Use the existing OPEN year rather than creating one (avoids contiguity issues)
    const years = await listFinancialYears(companyId);
    const openYear = years.find((y) => y.status === "OPEN");
    if (!openYear) return; // no OPEN year to test with

    try {
      const closed = await closeFinancialYear(companyId, openYear.code);
      assert.equal(closed.status, "CLOSED");

      const reopened = await reopenFinancialYear(companyId, openYear.code);
      assert.equal(reopened.status, "OPEN");
    } catch (err) {
      // Close fails when open periods exist — that is expected and acceptable
      if (err instanceof Error && err.message.toLowerCase().includes("period")) {
        return;
      }
      throw err;
    }
  });

  it("deletes a financial year", async () => {
    const code = uniqueCode();
    const { startDate, endDate } = yearDates("2095-01-01");
    const year = await createFinancialYear(companyId, { code, startDate, endDate, status: "PLANNED" });

    await deleteFinancialYear(companyId, year.code);

    const found = await getFinancialYear(companyId, year.code);
    assert.equal(found, null);
  });
});

