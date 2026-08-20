import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";

import { getPool } from "@voyzu/capability/db";
import { listCompanies } from "../../../modules/companies/operations";
import { getFinancialYear } from "../../../modules/financial-years/operations";
import {
  listPeriods,
  closePeriod,
  reopenPeriod,
  seedPeriodsForYear,
} from "../../../modules/financial-years/operations";

const OPEN_FY_CODE = "FY-2026";

let companyId: number;
let fyId: number;

before(async () => {
  const companies = await listCompanies();
  const company = companies.find((c) => c.code === "ACME") ?? companies[0];
  if (!company) throw new Error("ACME company not found — run seed scripts first");
  companyId = company.id;

  const fy = await getFinancialYear(companyId, OPEN_FY_CODE);
  if (!fy) throw new Error(`Financial year ${OPEN_FY_CODE} not found — run seed scripts first`);
  fyId = fy.id;

  const periods = await listPeriods(fyId);
  if (periods.length === 0) {
    await seedPeriodsForYear(companyId, fyId, fy.startDate, fy.endDate);
  }
  await getPool().query("UPDATE fiscal_year SET status = 'OPEN' WHERE id = $1", [fyId]);
  await getPool().query("UPDATE fiscal_period SET status = 'OPEN' WHERE fiscal_year_id = $1", [fyId]);
});

after(async () => {
  await getPool().end();
});

describe("financial-period.service", () => {

  describe("listPeriods", () => {
    it("returns 12 periods for an OPEN financial year", async () => {
      const periods = await listPeriods(fyId);
      assert.equal(periods.length, 12);
    });

    it("periods are ordered by start_date ascending", async () => {
      const periods = await listPeriods(fyId);
      for (let i = 1; i < periods.length; i++) {
        assert.ok(periods[i].startDate > periods[i - 1].startDate);
      }
    });

    it("all periods belong to the correct fiscal year", async () => {
      const periods = await listPeriods(fyId);
      for (const p of periods) {
        assert.equal(p.financialYearId, fyId);
      }
    });
  });

  describe("closePeriod / reopenPeriod lifecycle", () => {
    it("closes an OPEN period and reopens it", async () => {
      const periods = await listPeriods(fyId);
      const period = periods[0];
      assert.equal(period.status, "OPEN");

      await closePeriod(companyId, OPEN_FY_CODE, period.code);
      const afterClose = await listPeriods(fyId);
      const closed = afterClose.find((p) => p.code === period.code);
      assert.equal(closed?.status, "CLOSED");

      await reopenPeriod(companyId, OPEN_FY_CODE, period.code);
      const afterReopen = await listPeriods(fyId);
      const reopened = afterReopen.find((p) => p.code === period.code);
      assert.equal(reopened?.status, "OPEN");
    });

    it("throws when closing an already-CLOSED period", async () => {
      const periods = await listPeriods(fyId);
      const period = periods[1];

      await closePeriod(companyId, OPEN_FY_CODE, period.code);
      try {
        await assert.rejects(
          () => closePeriod(companyId, OPEN_FY_CODE, period.code),
          /Must be OPEN/,
        );
      } finally {
        await reopenPeriod(companyId, OPEN_FY_CODE, period.code);
      }
    });

    it("throws when reopening an already-OPEN period", async () => {
      const periods = await listPeriods(fyId);
      const period = periods[2];
      assert.equal(period.status, "OPEN");

      await assert.rejects(
        () => reopenPeriod(companyId, OPEN_FY_CODE, period.code),
        /Must be CLOSED/,
      );
    });

    it("throws when parent FY code does not exist", async () => {
      await assert.rejects(
        () => closePeriod(companyId, "FY-NONEXISTENT", "APR"),
        /not found/,
      );
    });

    it("throws when period code does not exist", async () => {
      await assert.rejects(
        () => closePeriod(companyId, OPEN_FY_CODE, "BADCODE"),
        /not found/,
      );
    });
  });
});
