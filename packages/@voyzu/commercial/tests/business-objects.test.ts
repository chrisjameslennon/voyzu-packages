import assert from "node:assert/strict";
import { test } from "node:test";
import type { Customer } from "@voyzu/types/business-objects/customer";

test("business objects: retrieve a customer by id and code (mock)", async () => {
  const customerCode = "CUSTOMER-001";
  const customer: Customer = {
    id: 1,
    name: "Example Customer",
    creditLimit: 5000,
    async get(id) { return id === customer.id ? customer : null; },
    async findByCode(code) { return code === customerCode ? customer : null; },
  };

  // Local mock only; no registry or database.
  const businessObjects: { customer: Customer } = { customer };

  const byId = await businessObjects.customer.get(1);
  const byCode = await businessObjects.customer.findByCode("CUSTOMER-001");

  assert.equal(byId, customer);
  assert.equal(byCode, customer);
  assert.equal(byId.creditLimit, 5000);
  assert.equal(await businessObjects.customer.get(999), null);
  assert.equal(await businessObjects.customer.findByCode("UNKNOWN"), null);
});
