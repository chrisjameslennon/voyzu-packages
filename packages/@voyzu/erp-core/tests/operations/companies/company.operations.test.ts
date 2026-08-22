import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import { getPool } from "@voyzu/capability/db";
import {
  activateCompany,
  batchCreateCompanies,
  batchDeleteCompanies,
  batchGetCompanies,
  batchPatchCompanies,
  batchUpdateCompanies,
  createCompany,
  deactivateCompanies,
  deleteCompany,
  filterCompanies,
  getCompany,
  listCompanies,
  patchCompany,
  searchCompanies,
  updateCompany,
} from "../../../modules/companies/operations";

const codes = ["TEST-ERP-A", "TEST-ERP-B", "TEST-ERP-C"];

after(async () => {
  await getPool().query(`DELETE FROM company WHERE code = ANY($1::text[])`, [codes]);
});

describe("ERP Core company operations", () => {
  it("supports the complete organizational company lifecycle", async () => {
    const created = await createCompany({ code: codes[0], name: "ERP A", countryCode: "NZ", baseCurrencyCode: "NZD" });
    assert.equal(created.code, codes[0]);
    assert.equal((await getCompany(codes[0]))?.name, "ERP A");

    const updated = await updateCompany(codes[0], { code: codes[0], name: "ERP A Updated", countryCode: "AU", baseCurrencyCode: "AUD" });
    assert.equal(updated.countryCode, "AU");
    assert.equal((await patchCompany(codes[0], { name: "ERP A Patched" })).name, "ERP A Patched");
    assert.ok((await listCompanies()).some((company) => company.code === codes[0]));
    assert.equal((await filterCompanies([{ field: "code", operator: "=", value: codes[0] }])).length, 1);
    assert.equal((await searchCompanies("ERP A Patched")).length, 1);

    await batchCreateCompanies([
      { code: codes[1], name: "ERP B", countryCode: "NZ", baseCurrencyCode: "NZD" },
      { code: codes[2], name: "ERP C", countryCode: "NZ", baseCurrencyCode: "NZD" },
    ]);
    assert.equal((await batchGetCompanies([codes[1], codes[2]])).length, 2);
    await batchUpdateCompanies([
      { code: codes[1], name: "ERP B Updated", countryCode: "AU", baseCurrencyCode: "AUD" },
      { code: codes[2], name: "ERP C Updated", countryCode: "AU", baseCurrencyCode: "AUD" },
    ]);
    const patched = await batchPatchCompanies([
      { code: codes[1], name: "ERP B Patched" },
      { code: codes[2], name: "ERP C Patched" },
    ]);
    assert.deepEqual(patched.map((company) => company.name), ["ERP B Patched", "ERP C Patched"]);

    const inactive = await deactivateCompanies([codes[1], codes[2]]);
    assert.ok(inactive.every((company) => company.status === "INACTIVE"));
    assert.equal((await activateCompany(codes[1])).status, "ACTIVE");

    await batchDeleteCompanies([codes[1], codes[2]]);
    await deleteCompany(codes[0]);
    assert.equal(await getCompany(codes[0]), null);
  });
});
