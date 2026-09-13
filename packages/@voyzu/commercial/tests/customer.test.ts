// ============================================================================
// Customer examples using JSON-backed mocks, not the platform dispatcher.
// ============================================================================

import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { internalApi, resetMockData } from "./internal-api.mock";

beforeEach(resetMockData);

test("business objects: get a full customer", async () => {
  const customer = await internalApi.call(
    "@core/customer",
    "get",
    {
      id: 1,
    },
  );

  assert.ok(customer);

  assert.equal(customer.id, 1);
  assert.equal(customer.code, "CUSTOMER-001");
  assert.equal(customer.name, "Example Customer");

  assert.equal(customer.account.creditLimit, 5000);
  assert.equal(customer.account.purchaseOrderRequired, false);
});

test("business objects: adjust customer credit limit", async () => {
  await internalApi.call(
    "@core/customer/account",
    "adjustCreditLimit",
    {
      id: 1,
      amount: 2500,
    },
  );

  const customer = await internalApi.call(
    "@core/customer",
    "get",
    {
      id: 1,
    },
  );

  assert.ok(customer);
  assert.equal(customer.account.creditLimit, 7500);
});

test("business objects: update customer account fields", async () => {
  await internalApi.call(
    "@core/customer/account",
    "update",
    {
      id: 1,
      changes: {
        purchaseOrderRequired: true,
      },
    },
  );

  const customer = await internalApi.call(
    "@core/customer",
    "get",
    {
      id: 1,
    },
  );

  assert.ok(customer);
  assert.equal(customer.account.purchaseOrderRequired, true);
});

test("business objects: update customer name", async () => {
  await internalApi.call(
    "@core/customer",
    "update",
    {
      id: 1,
      changes: {
        name: "Renamed Customer",
      },
    },
  );

  const customer = await internalApi.call(
    "@core/customer",
    "get",
    {
      id: 1,
    },
  );

  assert.ok(customer);
  assert.equal(customer.name, "Renamed Customer");
});
