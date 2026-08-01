import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { FinancialYearStatus } from "@voyzu/core/types/modules/financial-years";
import {
  ChangeCode,
  Close,
  Delete,
  type FinancialYearOperationState,
} from "../domain/operation-policy";

function year(
  id: number,
  status: FinancialYearStatus,
  hasPostings = false,
): FinancialYearOperationState {
  return {
    id,
    code: `FY${2025 + id}`,
    startDate: `${2024 + id}-04-01`,
    status,
    hasPostings,
  };
}

describe("financial year operation policy", () => {
  it("blocks a real code change after postings but permits a no-op", () => {
    const current = { code: "FY2026", hasPostings: true };
    assert.deepEqual(ChangeCode(current, "FY2026"), []);
    assert.equal(ChangeCode(current, "FY26")[0]?.code, "HAS_POSTINGS_CODE_LOCKED");
  });

  it("blocks closing a year from the middle of the contiguous open block", () => {
    const years = [year(1, "OPEN"), year(2, "OPEN"), year(3, "OPEN")];
    assert.equal(Close(years[1], years, 0)[0]?.code, "OPEN_FINANCIAL_YEARS_NOT_CONTIGUOUS");
    assert.deepEqual(Close(years[0], years, 0), []);
    assert.deepEqual(Close(years[2], years, 0), []);
  });

  it("blocks closing while financial periods remain open", () => {
    const years = [year(1, "OPEN")];
    assert.equal(Close(years[0], years, 2)[0]?.code, "FINANCIAL_YEAR_HAS_OPEN_PERIODS");
  });

  it("blocks deleting a financial year with postings", () => {
    const years = [year(1, "PLANNED", true)];
    assert.equal(Delete(years[0], years)[0]?.code, "HAS_POSTINGS_CANNOT_BE_DELETED");
  });

  it("blocks deleting a year from the middle of the financial calendar", () => {
    const years = [year(1, "CLOSED"), year(2, "PLANNED"), year(3, "PLANNED")];
    assert.equal(Delete(years[1], years)[0]?.code, "FINANCIAL_YEAR_CALENDAR_GAP");
  });
});
