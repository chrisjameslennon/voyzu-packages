import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  detailBackHref,
  detailBackHrefFromSearchParams,
  detailLinkWithBackContext,
  normalizeDetailBackSource,
} from "../detail-back-target";

describe("detail back navigation", () => {
  it("returns the containing list when no source is provided", () => {
    assert.equal(
      detailBackHref({ fallbackHref: "/finance/journals" }),
      "/finance/journals",
    );
  });

  it("returns an allowlisted source detail when its code is provided", () => {
    assert.equal(
      detailBackHref({
        from: "journal",
        fromCode: "JRN 001",
        fallbackHref: "/finance/subledgers/ar/ledger-entries",
      }),
      "/finance/journals/JRN%20001",
    );
  });

  it("returns the containing list when a source detail has no code", () => {
    assert.equal(
      detailBackHref({
        from: "journal",
        fallbackHref: "/finance/subledgers/ar/ledger-entries",
      }),
      "/finance/subledgers/ar/ledger-entries",
    );
  });

  it("normalizes only supported query values", () => {
    assert.equal(normalizeDetailBackSource("ar-ledger-entry"), "arLedgerEntry");
    assert.equal(normalizeDetailBackSource("organization-audit"), "organizationAudit");
    assert.equal(normalizeDetailBackSource("https://example.com"), undefined);
  });

  it("returns to an allowlisted organization audit source", () => {
    assert.equal(
      detailBackHref({
        from: "organizationAudit",
        fromCode: "/organization/countries/NZ",
        fallbackHref: "/organization",
      }),
      "/organization/countries/NZ",
    );
  });

  it("rejects an external organization audit return target", () => {
    assert.equal(
      detailBackHref({
        from: "organizationAudit",
        fromCode: "https://example.com/organization/countries/NZ",
        fallbackHref: "/organization",
      }),
      "/organization",
    );
  });

  it("adds encoded back context without replacing an existing query", () => {
    assert.equal(
      detailLinkWithBackContext(
        "/finance/journals/JRN-001?tab=lines",
        "arLedgerEntry",
        "AR 001",
      ),
      "/finance/journals/JRN-001?tab=lines&from=ar-ledger-entry&fromCode=AR%20001",
    );
  });

  it("preserves list filters in the fallback and removes back context", () => {
    assert.equal(
      detailBackHrefFromSearchParams({
        searchParams: new URLSearchParams("action=UPDATE&from=unknown&fromCode=X"),
        fallbackHref: "/finance/audit",
        preserveSearchParams: true,
      }),
      "/finance/audit?action=UPDATE",
    );
  });
});
