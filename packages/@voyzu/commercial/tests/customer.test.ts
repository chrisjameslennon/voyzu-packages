// ============================================================================
// Customer examples using the composed platform dispatcher and JSON-backed data.
// ============================================================================

import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { internalApi, resetMockData } from "./internal-api.setup";

beforeEach(resetMockData);

test("business objects: get a full customer", async () => {
  const customer = await internalApi.call(
    "@erp/customer",
    "get",
    {
      party_id: 1,
    },
  );

  assert.ok(customer);

  assert.equal(customer.party_id, 1);
  assert.equal(customer.account.party_id, 1);
  assert.equal(customer.code, "CUSTOMER-001");
  assert.equal(customer.name, "Example Customer");

  assert.equal(customer.account.creditLimit, 5000);
  assert.equal(customer.account.purchaseOrderRequired, false);
});

test("customer account uses party_id, not its private row id", async () => {
  const account = await internalApi.call("@erp/CustomerAccount", "get", { party_id: 1 });
  assert.ok(account);
  assert.equal(account.party_id, 1);
  assert.equal(Object.hasOwn(account, "id"), false);
  assert.equal(await internalApi.call("@erp/CustomerAccount", "get", { party_id: 101 }), null);
  // @ts-expect-error Party-linked methods do not accept the ambiguous id field.
  await assert.rejects(internalApi.call("@erp/CustomerAccount", "get", { id: 1 }), /Invalid .* input/);
  assert.equal(internalApi.has("@core/customer/account"), false);
});

test("business objects: adjust customer credit limit", async () => {
  await internalApi.call(
    "@erp/CustomerAccount",
    "adjustCreditLimit",
    {
      party_id: 1,
      amount: 2500,
    },
  );

  const customer = await internalApi.call(
    "@erp/customer",
    "get",
    {
      party_id: 1,
    },
  );

  assert.ok(customer);
  assert.equal(customer.account.creditLimit, 7500);
});

test("business objects: update customer account fields", async () => {
  await internalApi.call(
    "@erp/CustomerAccount",
    "update",
    {
      party_id: 1,
      changes: {
        purchaseOrderRequired: true,
      },
    },
  );

  const customer = await internalApi.call(
    "@erp/customer",
    "get",
    {
      party_id: 1,
    },
  );

  assert.ok(customer);
  assert.equal(customer.account.purchaseOrderRequired, true);
});

test("business objects: update customer name", async () => {
  await internalApi.call(
    "@erp/customer",
    "update",
    {
      party_id: 1,
      changes: {
        name: "Renamed Customer",
      },
    },
  );

  const customer = await internalApi.call(
    "@erp/customer",
    "get",
    {
      party_id: 1,
    },
  );

  assert.ok(customer);
  assert.equal(customer.name, "Renamed Customer");
});
